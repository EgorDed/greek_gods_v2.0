import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { IGraphEdge, IGraphNode } from "@/app/graph/types";
import { formatEdgeLabel } from "@/app/graph/_components/graphUtils";
import { useGraphContext } from "@/app/graph/_components/GraphContextWrappper";
import { api } from "@/app/lib/api";

interface NodeRelationsListProps {
    selectedNode: IGraphNode;
    edges: IGraphEdge[];
    allNodes: IGraphNode[];
    isEditable: boolean;
}

// Список всех связей выбранной ноды.
// Показывает тип связи и вторую ноду; в режиме редактирования даёт удалить связь.
export const NodeRelationsList: React.FC<NodeRelationsListProps> = ({
    selectedNode,
    edges,
    allNodes,
    isEditable,
}) => {
    const { authToken, isAdmin, refreshGraph } = useGraphContext();

    const handleDeleteEdge = useCallback(
        async (edgeId: number) => {
            if (!authToken || !isAdmin) {
                return;
            }

            try {
                await api.edges.delete(authToken, edgeId);
                void refreshGraph();
            } catch {
                // ignore
            }
        },
        [authToken, isAdmin, refreshGraph],
    );

    if (edges.length === 0) {
        return null;
    }

    return (
        <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-white/60 uppercase tracking-widest">
                <span>Связи</span>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {edges.map((edge) => {
                    const isFrom = edge.from_node_id === selectedNode.id;
                    const otherNodeId = isFrom ? edge.to_node_id : edge.from_node_id;
                    const otherNode = allNodes.find((node) => node.id === otherNodeId);
                    const relationLabel = formatEdgeLabel(edge, selectedNode, otherNode ?? null);

                    return (
                        <div
                            key={edge.id}
                            className="flex items-center justify-between gap-2 text-[11px] text-gray-200 bg-white/5 border border-white/10 rounded-md px-2 py-1"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold">
                                    {relationLabel} {otherNode ? `→ ${otherNode.title}` : ""}
                                </span>
                            </div>
                            {isEditable && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-10 text-[10px] text-red-300 hover:text-red-200 hover:bg-red-500/10"
                                    onClick={() => handleDeleteEdge(edge.id)}
                                >
                                    Удалить
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
