import React, { useEffect, useState } from "react";
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

const GraphInner = () => {
  const { graphData, setSelectedNode } = useGraphContext();
  const { setCenter } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<INode>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<GlowEdgeData>>([]);
  const [isMounted, setIsMounted] = useState(false);

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

  if (!isMounted) return null;

  const onNodeClick = (_: React.MouseEvent, node: Node<INode>) => {
    setSelectedNode(node.data);
    const cx = node.position.x + NODE_WIDTH / 2;
    const cy = node.position.y + NODE_HEIGHT / 2;
    setCenter(cx, cy, { zoom: 1.2, duration: 800 });
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
        onConnect={(params: Connection) => setEdges((eds) => addEdge(params, eds))}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelectedNode(null)}
        fitView
        colorMode="dark"
        className="z-10 [&_.react-flow__pane]:bg-transparent [&_.react-flow__viewport]:bg-transparent"
      >
        <Background color="#334155" gap={32} size={0.5} style={{ opacity: 0.15 }} />
      </ReactFlow>
    </div>
  );
};

const Graph = () => (
  <ReactFlowProvider>
    <GraphInner />
  </ReactFlowProvider>
);

export default Graph;
