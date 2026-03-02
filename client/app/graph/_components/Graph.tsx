import React, { useEffect, useRef, useState } from "react";
import {
  addEdge,
  Background,
  Connection,
  ReactFlow,
  useEdgesState,
  useNodesState,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BaseGraphNodeDemo, NODE_WIDTH, NODE_HEIGHT } from "@/app/graph/_components/base/BaseGraphNode";
import { GlowEdge, type GlowEdgeData } from "@/app/graph/_components/GlowEdge";
import { StarsBackground } from "@/app/graph/_components/StarsBackground";
import { useGraphContext } from "@/app/graph/_components/GraphContextWrappper";
import { getNodeColor, getHandleIdsForEdge } from "@/app/graph/_components/graphUtils";
import { INode, IEdge } from "@/app/graph/page";

const nodeTypes = {
  baseGraphNode: BaseGraphNodeDemo,
};

const edgeTypes = {
  glow: GlowEdge,
};

const defaultEdgeOptions = { type: "glow" as const };

/** URL фона: локальный файл из public/images/ или Unsplash */
const SPACE_BG_URL = "/images/space-bg.jpg";

const EDGE_TYPES: { label: string; value: string }[] = [
  { label: "родитель", value: "parent" },
  { label: "ребенок", value: "child" },
  { label: "супруг", value: "spouse" },
  { label: "брат", value: "brother" },
  { label: "враг", value: "enemy" },
  { label: "союзник", value: "ally" },
  { label: "владелец", value: "owns" },
  { label: "участвует", value: "participates" },
  { label: "расположен в", value: "located_in" },
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api";

const GraphInner = () => {
  const { graphData, setSelectedNode, isEditMode, authToken, refreshGraph } =
    useGraphContext();
  const { setCenter } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<INode>>([]);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<Edge<GlowEdgeData>>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null,
  );
  const [pendingEdgeType, setPendingEdgeType] = useState<string>(
    EDGE_TYPES[0]?.label ?? "",
  );
  const positionSaveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );
  const pendingPositions = useRef<Record<string, { x: number; y: number }>>({});
  const [positionSaveState, setPositionSaveState] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  useEffect(() => {
    if (graphData.nodes.length === 0) return;
    setIsMounted(true);

    const nodeMap = new Map(graphData.nodes.map((n) => [n.id, n]));

    const calculatedNodes: Node<INode>[] = graphData.nodes.map((node, index) => {
      const angle = (index / graphData.nodes.length) * 2 * Math.PI;
      const radius = 250;
      const hasPosition = typeof node.position?.x === "number" && typeof node.position?.y === "number";
      return {
        id: String(node.id),
        type: "baseGraphNode",
        position: {
          x: hasPosition ? node.position!.x : 500 + radius * Math.cos(angle),
          y: hasPosition ? node.position!.y : 350 + radius * Math.sin(angle),
        },
        data: node,
      };
    });

    const calculatedEdges: Edge<GlowEdgeData>[] = graphData.edges.map((edge: IEdge) => {
      const sourceNode = nodeMap.get(edge.from_node_id);
      const targetNode = nodeMap.get(edge.to_node_id);
      const sourceColor = sourceNode ? getNodeColor(sourceNode.type_en ?? "") : undefined;
      const sp = sourceNode?.position ?? { x: 0, y: 0 };
      const tp = targetNode?.position ?? { x: 0, y: 0 };
      const { sourceHandle, targetHandle } = getHandleIdsForEdge(sp.x, sp.y, tp.x, tp.y);
      return {
        id: `e${edge.from_node_id}-${edge.to_node_id}`,
        source: String(edge.from_node_id),
        target: String(edge.to_node_id),
        sourceHandle,
        targetHandle,
        type: "glow",
        data: {
          label: edge.type ?? undefined,
          sourceColor,
        },
      };
    });

    setNodes(calculatedNodes);
    setEdges(calculatedEdges);
  }, [graphData.nodes.length, graphData.edges.length]);

  useEffect(() => {
    if (nodes.length === 0) {
      return;
    }

    const chaosNode =
      nodes.find((node) => (node.data as INode).code === "chaos") ??
      nodes[0];

    const cx = chaosNode.position.x + NODE_WIDTH / 2;
    const cy = chaosNode.position.y + NODE_HEIGHT / 2;

    setCenter(cx, cy, { zoom: 0.7, duration: 0 });
  }, [nodes.length, setCenter]);

  if (!isMounted) return null;

  const onNodeClick = (_: React.MouseEvent, node: Node<INode>) => {
    setSelectedNode(node.data);
    const cx = node.position.x + NODE_WIDTH / 2;
    const cy = node.position.y + NODE_HEIGHT / 2;
    setCenter(cx, cy, { zoom: 1.2, duration: 800 });
  };

  const saveNodePosition = async (nodeId: string) => {
    if (!authToken) {
      return;
    }

    const numericId = Number(nodeId);
    if (!numericId) {
      return;
    }

    const pos = pendingPositions.current[nodeId];
    if (!pos) {
      return;
    }

    try {
      setPositionSaveState("saving");
      await fetch(`${API_URL}/admin/nodes/${numericId}/position`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          position: {
            x: pos.x,
            y: pos.y,
          },
        }),
      });

      void refreshGraph();
      setPositionSaveState("saved");
      setTimeout(() => {
        setPositionSaveState("idle");
      }, 2000);
    } catch {
      // игнорируем ошибки сохранения позиции
      setPositionSaveState("idle");
    }
  };

  const handleNodeDragStop = (_: React.MouseEvent, node: Node<INode>) => {
    if (!isEditMode || !authToken) {
      return;
    }

    const nodeId = node.id;
    pendingPositions.current[nodeId] = {
      x: node.position.x,
      y: node.position.y,
    };

    const existingTimer = positionSaveTimers.current[nodeId];
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    positionSaveTimers.current[nodeId] = setTimeout(() => {
      void saveNodePosition(nodeId);
      delete positionSaveTimers.current[nodeId];
      delete pendingPositions.current[nodeId];
    }, 5000);
  };

  const handleConnect = (params: Connection) => {
    if (!isEditMode || !authToken) {
      setEdges((eds) => addEdge(params, eds));
      return;
    }

    setPendingConnection(params);
    setPendingEdgeType(EDGE_TYPES[0]?.label ?? "");
  };

  const handleConfirmEdge = async () => {
    if (!pendingConnection || !authToken) {
      return;
    }

    const fromId = Number(pendingConnection.source);
    const toId = Number(pendingConnection.target);

    if (!fromId || !toId) {
      setPendingConnection(null);
      return;
    }

    const edgeType = EDGE_TYPES.find(
      (item) => item.label === pendingEdgeType,
    ) ?? EDGE_TYPES[0];

    try {
      const response = await fetch(`${API_URL}/admin/edges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          from_node_id: fromId,
          to_node_id: toId,
          type: edgeType.label,
          type_en: edgeType.value,
          meta: {},
        }),
      });

      if (response.ok) {
        void refreshGraph();
      }
    } catch {
      // ignore error, UI останется без нового ребра
    } finally {
      setPendingConnection(null);
    }
  };

  const handleCancelEdge = () => {
    setPendingConnection(null);
  };

  return (
    <div className="h-full w-full relative">
      {/* Фон: картинка из public/images/space-bg.jpg — звёздное небо как на референсе */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-[#0a0a12]"
        style={{
          backgroundImage: `url(${SPACE_BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Лёгкое затемнение по краям, чтобы ноды и подписи читались */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      {/*<StarsBackground />*/}

      <ReactFlow<Node<INode>, Edge<GlowEdgeData>>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelectedNode(null)}
        minZoom={0.2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        colorMode="dark"
        className="z-10 [&_.react-flow__pane]:bg-transparent [&_.react-flow__viewport]:bg-transparent"
      >
        <Background
          color="#334155"
          gap={32}
          size={0.5}
          style={{ opacity: 0.15 }}
        />
      </ReactFlow>

      {isEditMode && positionSaveState !== "idle" && (
        <div className="absolute bottom-4 left-4 z-50 rounded-lg bg-slate-900/90 border border-slate-700 px-3 py-1.5 shadow-lg text-[11px] text-slate-100 flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              positionSaveState === "saving" ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
          <span>
            {positionSaveState === "saving"
              ? "Сохраняем позицию…"
              : "Позиция сохранена"}
          </span>
        </div>
      )}

      {isEditMode && pendingConnection && (
        <div className="absolute bottom-4 right-4 z-50 rounded-lg bg-slate-900/95 border border-slate-700 px-4 py-3 shadow-xl text-xs text-slate-100 space-y-2">
          <div className="font-semibold text-slate-50">
            Создать связь между нодами
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-widest text-slate-400">
              Тип связи
            </label>
            <select
              className="w-full rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={pendingEdgeType}
              onChange={(event) => setPendingEdgeType(event.target.value)}
            >
              {EDGE_TYPES.map((item) => (
                <option key={item.value} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="px-2 py-1 rounded-md border border-slate-600 text-slate-200 hover:bg-slate-800"
              onClick={handleCancelEdge}
            >
              Отмена
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
              onClick={handleConfirmEdge}
            >
              Создать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Graph = () => (
  <ReactFlowProvider>
    <GraphInner />
  </ReactFlowProvider>
);

export default Graph;
