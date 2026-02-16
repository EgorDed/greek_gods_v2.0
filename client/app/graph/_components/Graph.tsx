import React, {useEffect, useState} from 'react';
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
    useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {BaseGraphNodeDemo} from "@/app/graph/_components/base/BaseGraphNode";
import {useGraphContext} from "@/app/graph/_components/GraphContextWrappper";
import {INode} from "@/app/graph/page";

const nodeTypes = {
    baseGraphNode: BaseGraphNodeDemo,
};

const GraphInner = () => {
    const {graphData, setSelectedNode} = useGraphContext();
    const { setCenter } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState<Node<INode>>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        console.log("Graph is mounting...", graphData);
        setIsMounted(true);

        if (graphData.nodes.length > 0) {
            const calculatedNodes: Node<INode>[] = graphData.nodes.map((node, index) => {
                const angle = (index / graphData.nodes.length) * 2 * Math.PI;
                const radius = 250;
                return {
                    id: String(node.id),
                    type: "baseGraphNode",
                    position: {
                        x: 500 + radius * Math.cos(angle),
                        y: 350 + radius * Math.sin(angle),
                    },
                    data: node,
                };
            });

            const calculatedEdges = graphData.edges.map((edge) => {
                const labelBgPadding: [number, number] = [4, 2];

                return {
                    id: `e${edge.from_node_id}-${edge.to_node_id}`,
                    source: String(edge.from_node_id),
                    target: String(edge.to_node_id),
                    label: edge.type,
                    animated: true,
                    style: { stroke: '#ffffff88', strokeWidth: 2 },
                    labelStyle: { fill: '#fff', fontWeight: 700, fontSize: 10 },
                    labelBgPadding,
                    labelBgBorderRadius: 4,
                    labelBgStyle: { fill: '#000000aa' },
                };
            });

            setNodes(calculatedNodes);
            setEdges(calculatedEdges);
        }
    }, []);

    if (!isMounted) return null;

    const onNodeClick = (_: React.MouseEvent, node: Node<INode>) => {
        setSelectedNode(node.data);
        void setCenter(200, 200, { zoom: 1.2, duration: 800 });
    };

    return (
        <div className="h-full w-full relative">
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%), 
                                     url('https://www.transparenttextures.com/patterns/stardust.png')`,
                    backgroundBlendMode: 'screen',
                    opacity: 0.5
                }}
            />

            <ReactFlow<Node<INode>, Edge>
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(params: Connection) => setEdges((eds) => addEdge(params, eds))}
                onNodeClick={onNodeClick}
                onPaneClick={() => setSelectedNode(null)}
                fitView
                colorMode="dark"
                className="z-10"
            >
                <Background color="#333" gap={20} />
            </ReactFlow>
        </div>
    )
}

const Graph = () => (
    <ReactFlowProvider>
        <GraphInner />
    </ReactFlowProvider>
);

export default Graph;