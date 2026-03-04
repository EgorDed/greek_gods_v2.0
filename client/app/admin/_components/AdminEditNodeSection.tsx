import type { IGraphNode } from "@/app/graph/types";
import { NodeEditForm } from "@/app/graph/_components/editor/NodeEditForm";

interface MetaOption {
    label: string;
    value: string;
}

interface AdminEditNodeSectionProps {
    nodeTypes: MetaOption[];
    sortedNodes: IGraphNode[];
    token: string | null;
    loading: boolean;
    editNodeId: number | "";
    onSelectEditNode: (value: string) => void;
    onSaved: () => Promise<void> | void;
}

export function AdminEditNodeSection({
    nodeTypes,
    sortedNodes,
    token,
    loading,
    editNodeId,
    onSelectEditNode,
    onSaved,
}: AdminEditNodeSectionProps) {
    const selectedNode =
        typeof editNodeId === "number"
            ? sortedNodes.find((node) => node.id === editNodeId) ?? null
            : null;

    return (
        <section className="rounded-xl bg-white shadow-sm border border-zinc-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">Редактирование ноды</h2>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-start md:flex-wrap">
                <div className="flex-1 min-w-[220px]">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Нода</label>
                    <select
                        className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        value={editNodeId}
                        onChange={(event) => onSelectEditNode(event.target.value)}
                    >
                        <option value="">Не выбрана</option>
                        {sortedNodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.title} ({node.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-[2] min-w-[260px]">
                    {selectedNode && token ? (
                        <NodeEditForm
                            node={selectedNode as any}
                            token={token}
                            nodeTypes={nodeTypes}
                            onSaved={onSaved}
                        />
                    ) : (
                        <div className="text-xs text-zinc-500 mt-2">
                            Выберите ноду слева, чтобы отредактировать её поля.
                        </div>
                    )}
                </div>
            </div>

            {loading && (
                <div className="text-xs text-zinc-400 pt-1">
                    Сохранение или обновление данных...
                </div>
            )}
        </section>
    );
}
