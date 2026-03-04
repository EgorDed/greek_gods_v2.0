interface AdminGraphStatsProps {
    nodesCount: number;
    edgesCount: number;
    loading: boolean;
}

export function AdminGraphStats({ nodesCount, edgesCount, loading }: AdminGraphStatsProps) {
    return (
        <section className="rounded-xl bg-white shadow-sm border border-zinc-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">Текущее состояние графа</h2>
                {loading && <span className="text-xs text-zinc-500">Обновление...</span>}
            </div>
            <p className="text-xs text-zinc-500">
                Нод: {nodesCount}, связей: {edgesCount}
            </p>
        </section>
    );
}
