import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Background,
    Connection,
    ReactFlow,
    useEdgesState,
    useNodesState,
    Node,
    Edge,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BaseGraphNodeDemo, NODE_WIDTH, NODE_HEIGHT } from "@/app/graph/_components/base/BaseGraphNode";
import { JunctionNode, type JunctionNodeData } from "@/app/graph/_components/base/JunctionNode";
import { GlowEdge, type GlowEdgeData } from "@/app/graph/_components/GlowEdge";
import { useGraphContext } from "@/app/graph/_components/GraphContextWrappper";
import { getNodeColor, getHandleIdsForEdge } from "@/app/graph/_components/graphUtils";
import type { IGraphNode, IGraphEdge } from "@/app/graph/types";
import { useMetaOptions } from "@/app/hooks/useMetaOptions";
import { PositionSaveIndicator } from "@/app/graph/_components/editor/PositionSaveIndicator";
import { EdgeCreationDialog } from "@/app/graph/_components/editor/EdgeCreationDialog";
import { api, ApiError } from "@/app/lib/api";
import { useToast } from "@/app/context/ToastContext";

type JunctionKind = "junction";

type JunctionData = JunctionNodeData & {
    kind: JunctionKind;
};

type GraphNodeData = IGraphNode | JunctionData;
type GraphFlowNode = Node<GraphNodeData>;
type GraphFlowEdge = Edge<GlowEdgeData>;

interface ParentGroup {
    key: string;
    parentIds: number[];
    childIds: number[];
    junctionId: string;
}

const nodeTypes = {
    baseGraphNode: BaseGraphNodeDemo,
    junctionNode: JunctionNode,
};

const edgeTypes = {
    glow: GlowEdge,
};

const defaultEdgeOptions = { type: "glow" as const };

/** URL фона: локальный файл из public/images/ или Unsplash */
const SPACE_BG_URL = "/images/space-bg.jpg";

function isJunctionNode(node: GraphFlowNode): node is Node<JunctionData> {
    return (node.data as JunctionData | IGraphNode).kind === "junction";
}

function buildParentGroups(edges: IGraphEdge[]): ParentGroup[] {
    const childToParents = new Map<number, Set<number>>();

    edges.forEach((edge) => {
        if (edge.type_en !== "parent") {
            return;
        }

        const childId = edge.to_node_id;
        const parentId = edge.from_node_id;

        let parents = childToParents.get(childId);
        if (!parents) {
            parents = new Set<number>();
            childToParents.set(childId, parents);
        }

        parents.add(parentId);
    });

    const groupMap = new Map<string, { parentIds: number[]; childIds: number[] }>();

    childToParents.forEach((parents, childId) => {
        if (parents.size === 0) {
            return;
        }

        const parentIds = Array.from(parents).sort((a, b) => a - b);
        const key = `parentGroup:${parentIds.join("-")}`;

        let group = groupMap.get(key);
        if (!group) {
            group = {
                parentIds,
                childIds: [],
            };
            groupMap.set(key, group);
        }

        group.childIds.push(childId);
    });

    const result: ParentGroup[] = [];

    groupMap.forEach((group, key) => {
        if (group.childIds.length < 2) {
            return;
        }

        const junctionId = `junction-${group.parentIds.join("-")}`;

        result.push({
            key,
            parentIds: group.parentIds,
            childIds: group.childIds,
            junctionId,
        });
    });

    return result;
}

export const GraphInner = () => {
    const {
        graphData,
        setSelectedNode,
        isEditMode,
        authToken,
        refreshGraph,
        isAdmin,
        groupParentEdges,
    } = useGraphContext();
    const { options: metaOptions } = useMetaOptions();
    const { setCenter } = useReactFlow();
    const { showError } = useToast();

    const [nodes, setNodes, onNodesChange] = useNodesState<GraphFlowNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<GraphFlowEdge>([]);
    const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
    const [pendingEdgeType, setPendingEdgeType] = useState<string>("");
    const positionSaveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const pendingPositions = useRef<Record<string, { x: number; y: number }>>({});
    const [positionSaveState, setPositionSaveState] = useState<"idle" | "saving" | "saved">("idle");

    const calculated = useMemo<{
        nodes: GraphFlowNode[];
        edges: GraphFlowEdge[];
    }>(() => {
        if (graphData.nodes.length === 0) {
            return {
                nodes: [],
                edges: [],
            };
        }

        const baseNodes: GraphFlowNode[] = [];
        const nodeByNumericId = new Map<number, GraphFlowNode>();

        graphData.nodes.forEach((node, index) => {
            const angle = (index / graphData.nodes.length) * 2 * Math.PI;
            const radius = 250;
            const hasPosition =
                typeof node.position?.x === "number" && typeof node.position?.y === "number";

            const flowNode: GraphFlowNode = {
                id: String(node.id),
                type: "baseGraphNode",
                position: {
                    x: hasPosition ? node.position!.x : 500 + radius * Math.cos(angle),
                    y: hasPosition ? node.position!.y : 350 + radius * Math.sin(angle),
                },
                data: node,
            };

            baseNodes.push(flowNode);
            nodeByNumericId.set(node.id, flowNode);
        });

        const parentGroups = groupParentEdges ? buildParentGroups(graphData.edges) : [];

        const junctionNodes: GraphFlowNode[] = parentGroups.map((group) => {
            const relatedNodes: GraphFlowNode[] = [];

            group.parentIds.forEach((parentId) => {
                const parentNode = nodeByNumericId.get(parentId);
                if (parentNode) {
                    relatedNodes.push(parentNode);
                }
            });

            group.childIds.forEach((childId) => {
                const childNode = nodeByNumericId.get(childId);
                if (childNode) {
                    relatedNodes.push(childNode);
                }
            });

            let x = 500;
            let y = 350;

            if (relatedNodes.length > 0) {
                const sum = relatedNodes.reduce(
                    (acc, n) => {
                        return {
                            x: acc.x + n.position.x + NODE_WIDTH / 2,
                            y: acc.y + n.position.y + NODE_HEIGHT / 2,
                        };
                    },
                    { x: 0, y: 0 },
                );

                x = sum.x / relatedNodes.length;
                y = sum.y / relatedNodes.length;
            }

            const junctionData: JunctionData = {
                kind: "junction",
                parentIds: group.parentIds,
                childIds: group.childIds,
            };

            const node: GraphFlowNode = {
                id: group.junctionId,
                type: "junctionNode",
                position: {
                    x,
                    y,
                },
                data: junctionData,
                draggable: false,
                selectable: false,
                focusable: false,
            };

            return node;
        });

        const allNodes: GraphFlowNode[] = [...baseNodes, ...junctionNodes];
        const flowNodeById = new Map<string, GraphFlowNode>();

        allNodes.forEach((node) => {
            flowNodeById.set(node.id, node);
        });

        const reactEdges: GraphFlowEdge[] = [];

        if (graphData.edges.length === 0) {
            return {
                nodes: allNodes,
                edges: reactEdges,
            };
        }

        const dataNodeMap = new Map<number, IGraphNode>(
            graphData.nodes.map((node) => [node.id, node]),
        );

        const groupedParentPairs = new Set<string>();

        parentGroups.forEach((group) => {
            group.parentIds.forEach((parentId) => {
                group.childIds.forEach((childId) => {
                    groupedParentPairs.add(`${parentId}-${childId}`);
                });
            });
        });

        const addDefaultEdge = (edge: IGraphEdge) => {
            const sourceFlowNode = flowNodeById.get(String(edge.from_node_id));
            const targetFlowNode = flowNodeById.get(String(edge.to_node_id));

            const sp = sourceFlowNode?.position ?? { x: 0, y: 0 };
            const tp = targetFlowNode?.position ?? { x: 0, y: 0 };

            const { sourceHandle, targetHandle } = getHandleIdsForEdge(sp.x, sp.y, tp.x, tp.y);

            const sourceNode = dataNodeMap.get(edge.from_node_id);
            const sourceColor = sourceNode ? getNodeColor(sourceNode.type_en ?? "") : undefined;

            reactEdges.push({
                id: String(edge.id),
                source: String(edge.from_node_id),
                target: String(edge.to_node_id),
                sourceHandle,
                targetHandle,
                type: "glow",
                data: {
                    label: edge.type ?? undefined,
                    sourceColor,
                },
            });
        };

        graphData.edges.forEach((edge) => {
            if (groupParentEdges && edge.type_en === "parent") {
                const key = `${edge.from_node_id}-${edge.to_node_id}`;

                if (groupedParentPairs.has(key)) {
                    return;
                }
            }

            addDefaultEdge(edge);
        });

        parentGroups.forEach((group) => {
            const sampleEdge =
                graphData.edges.find(
                    (edge) =>
                        edge.type_en === "parent" &&
                        group.parentIds.includes(edge.from_node_id) &&
                        group.childIds.includes(edge.to_node_id),
                ) ?? null;

            const label = sampleEdge?.type ?? "родитель";

            group.parentIds.forEach((parentId) => {
                const sourceId = String(parentId);
                const targetId = group.junctionId;

                const sourceFlowNode = flowNodeById.get(sourceId);
                const targetFlowNode = flowNodeById.get(targetId);

                const sp = sourceFlowNode?.position ?? { x: 0, y: 0 };
                const tp = targetFlowNode?.position ?? { x: 0, y: 0 };

                const { sourceHandle, targetHandle } = getHandleIdsForEdge(
                    sp.x,
                    sp.y,
                    tp.x,
                    tp.y,
                );

                const sourceNode = dataNodeMap.get(parentId);
                const sourceColor = sourceNode ? getNodeColor(sourceNode.type_en ?? "") : undefined;

                reactEdges.push({
                    id: `parent-${parentId}-to-${group.junctionId}`,
                    source: sourceId,
                    target: targetId,
                    sourceHandle,
                    targetHandle,
                    type: "glow",
                    data: {
                        label,
                        sourceColor,
                    },
                });
            });

            group.childIds.forEach((childId) => {
                const sourceId = group.junctionId;
                const targetId = String(childId);

                const sourceFlowNode = flowNodeById.get(sourceId);
                const targetFlowNode = flowNodeById.get(targetId);

                const sp = sourceFlowNode?.position ?? { x: 0, y: 0 };
                const tp = targetFlowNode?.position ?? { x: 0, y: 0 };

                const { sourceHandle, targetHandle } = getHandleIdsForEdge(
                    sp.x,
                    sp.y,
                    tp.x,
                    tp.y,
                );

                const childNode = dataNodeMap.get(childId);
                const sourceColor = childNode ? getNodeColor(childNode.type_en ?? "") : undefined;

                reactEdges.push({
                    id: `junction-${group.junctionId}-to-child-${childId}`,
                    source: sourceId,
                    target: targetId,
                    sourceHandle,
                    targetHandle,
                    type: "glow",
                    data: {
                        label,
                        sourceColor,
                    },
                });
            });
        });

        return {
            nodes: allNodes,
            edges: reactEdges,
        };
    }, [graphData.nodes, graphData.edges, groupParentEdges]);

    useEffect(() => {
        if (graphData.nodes.length === 0) {
            setNodes([]);
            setEdges([]);
            return;
        }

        setNodes(calculated.nodes);
        setEdges(calculated.edges);
    }, [graphData.nodes.length, calculated, setNodes, setEdges]);

    const EDGE_TYPES = metaOptions?.edgeTypes ?? [];

    useEffect(() => {
        if (nodes.length === 0) {
            return;
        }

        const chaosNode =
            nodes.find((node) => !isJunctionNode(node) && (node.data as IGraphNode).code === "chaos") ??
            nodes.find((node) => !isJunctionNode(node)) ??
            nodes[0];

        const cx = chaosNode.position.x + NODE_WIDTH / 2;
        const cy = chaosNode.position.y + NODE_HEIGHT / 2;

        setCenter(cx, cy, { zoom: 0.7, duration: 0 });
    }, [nodes.length, setCenter]);

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: GraphFlowNode) => {
            if (isJunctionNode(node)) {
                return;
            }

            setSelectedNode(node.data as IGraphNode);
            const cx = node.position.x + NODE_WIDTH / 2;
            const cy = node.position.y + NODE_HEIGHT / 2;
            setCenter(cx, cy, { zoom: 1.2, duration: 800 });
        },
        [setCenter, setSelectedNode],
    );

    const saveNodePosition = useCallback(
        async (nodeId: string) => {
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

                await api.nodes.updatePosition(authToken, numericId, {
                    x: pos.x,
                    y: pos.y,
                });

                void refreshGraph();
                setPositionSaveState("saved");
                setTimeout(() => {
                    setPositionSaveState("idle");
                }, 2000);
            } catch (error) {
                const message =
                    error instanceof ApiError
                        ? error.message
                        : "Не удалось сохранить позицию ноды.";
                showError(message);
                setPositionSaveState("idle");
            }
        },
        [authToken, refreshGraph, showError],
    );

    const handleNodeDragStop = useCallback(
        (_: React.MouseEvent, node: GraphFlowNode) => {
            if (isJunctionNode(node)) {
                return;
            }

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
        },
        [authToken, isEditMode, saveNodePosition],
    );

    const handleConnect = useCallback(
        (params: Connection) => {
            if (!isEditMode || !authToken) {
                return;
            }

            setPendingConnection(params);
            setPendingEdgeType(EDGE_TYPES[0]?.label ?? "");
        },
        [EDGE_TYPES, authToken, isEditMode],
    );

    const handleConfirmEdge = useCallback(async () => {
        if (!pendingConnection || !authToken) {
            return;
        }

        const fromId = Number(pendingConnection.source);
        const toId = Number(pendingConnection.target);

        if (!fromId || !toId) {
            setPendingConnection(null);
            return;
        }

        const edgeType = EDGE_TYPES.find((item) => item.label === pendingEdgeType) ?? EDGE_TYPES[0];

        if (!edgeType) {
            return;
        }

        try {
            await api.edges.create(authToken, {
                from_node_id: fromId,
                to_node_id: toId,
                type: edgeType.label,
                type_en: edgeType.value,
                meta: {},
            });

            void refreshGraph();
        } catch (error) {
            const message =
                error instanceof ApiError
                    ? error.message
                    : "Не удалось создать связь между нодами.";
            showError(message);
        } finally {
            setPendingConnection(null);
        }
    }, [EDGE_TYPES, authToken, pendingConnection, pendingEdgeType, refreshGraph, showError]);

    const handleCancelEdge = useCallback(() => {
        setPendingConnection(null);
    }, []);

    const handlePaneClick = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    return (
        <div className="h-full w-full relative">
            <div
                className="absolute inset-0 pointer-events-none z-0 bg-[#0a0a12]"
                style={{
                    backgroundImage: `url(${SPACE_BG_URL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
                }}
            />

            <ReactFlow<Node<IGraphNode>, Edge<GlowEdgeData>>
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
                onPaneClick={handlePaneClick}
                minZoom={0.2}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                colorMode="dark"
                className="z-10 [&_.react-flow__pane]:bg-transparent [&_.react-flow__viewport]:bg-transparent"
            >
                <Background color="#334155" gap={32} size={0.5} style={{ opacity: 0.15 }} />
            </ReactFlow>

            {isAdmin && <PositionSaveIndicator state={positionSaveState} />}

            {isAdmin && (
                <EdgeCreationDialog
                    isEditMode={isEditMode}
                    pendingConnection={pendingConnection}
                    edgeTypes={EDGE_TYPES}
                    pendingEdgeType={pendingEdgeType}
                    setPendingEdgeType={setPendingEdgeType}
                    onConfirm={handleConfirmEdge}
                    onCancel={handleCancelEdge}
                />
            )}
        </div>
    );
};

