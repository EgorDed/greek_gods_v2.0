import type { IGraphNode } from "@/app/graph/types";

interface AdminDeleteNodeSectionProps {
    sortedNodes: IGraphNode[];
    loading: boolean;
    deleteNodeId: number | "";
    onChangeDeleteNodeId: (value: number | "") => void;
    onDelete: () => void;
}

export function AdminDeleteNodeSection({
    sortedNodes,
    loading,
    deleteNodeId,
    onChangeDeleteNodeId,
    onDelete,
}: AdminDeleteNodeSectionProps) {
    return (
        <section className="rounded-xl bg-white shadow-sm border border-zinc-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">Удаление ноды</h2>
                <p className="text-xs text-zinc-500">Важно: связей автоматически не удаляем.</p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex-1 min-w-[220px]">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                        Нода для удаления
                    </label>
                    <select
                        className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={deleteNodeId}
                        onChange={(event) =>
                            onChangeDeleteNodeId(
                                event.target.value ? Number(event.target.value) : "",
                            )
                        }
                    >
                        <option value="">Не выбрана</option>
                        {sortedNodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.title} ({node.code})
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={onDelete}
                    className="w-full md:w-auto rounded-md bg-red-600 text-white px-4 py-2 text-xs font-medium hover:bg-red-700 transition disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Удаляем..." : "Удалить ноду"}
                </button>
            </div>
        </section>
    );
}
