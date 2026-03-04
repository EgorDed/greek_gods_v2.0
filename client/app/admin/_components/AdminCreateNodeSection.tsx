import { FormEvent } from "react";
import type { IGraphNode } from "@/app/graph/types";

interface MetaOption {
    label: string;
    value: string;
}

interface AdminCreateNodeSectionProps {
    nodeTypes: MetaOption[];
    edgeTypes: MetaOption[];
    genders: MetaOption[];
    sortedNodes: IGraphNode[];
    loading: boolean;
    newCode: string;
    newTitle: string;
    newType: string;
    newShortDescription: string;
    newDescription: string;
    newIcon: string;
    newAvatar: string;
    newGender: string;
    newX: number;
    newY: number;
    relationTargetId: number | "";
    relationType: string;
    relationDirection: "from_new" | "to_new";
    onChangeNewCode: (value: string) => void;
    onChangeNewTitle: (value: string) => void;
    onChangeNewType: (value: string) => void;
    onChangeNewShortDescription: (value: string) => void;
    onChangeNewDescription: (value: string) => void;
    onChangeNewIcon: (value: string) => void;
    onChangeNewAvatar: (value: string) => void;
    onChangeNewGender: (value: string) => void;
    onChangeNewX: (value: number) => void;
    onChangeNewY: (value: number) => void;
    onChangeRelationTargetId: (value: number | "") => void;
    onChangeRelationType: (value: string) => void;
    onChangeRelationDirection: (value: "from_new" | "to_new") => void;
    onSubmit: (event: FormEvent) => void;
    onRefreshGraph: () => void;
}

export function AdminCreateNodeSection({
    nodeTypes,
    edgeTypes,
    genders,
    sortedNodes,
    loading,
    newCode,
    newTitle,
    newType,
    newShortDescription,
    newDescription,
    newIcon,
    newAvatar,
    newGender,
    newX,
    newY,
    relationTargetId,
    relationType,
    relationDirection,
    onChangeNewCode,
    onChangeNewTitle,
    onChangeNewType,
    onChangeNewShortDescription,
    onChangeNewDescription,
    onChangeNewIcon,
    onChangeNewAvatar,
    onChangeNewGender,
    onChangeNewX,
    onChangeNewY,
    onChangeRelationTargetId,
    onChangeRelationType,
    onChangeRelationDirection,
    onSubmit,
    onRefreshGraph,
}: AdminCreateNodeSectionProps) {
    return (
        <section className="rounded-xl bg-white shadow-sm border border-zinc-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">Добавление ноды и связи</h2>
                <button
                    type="button"
                    onClick={onRefreshGraph}
                    className="text-xs text-zinc-500 hover:text-zinc-800"
                >
                    Обновить список нод
                </button>
            </div>

            <form
                onSubmit={onSubmit}
                className="flex flex-col gap-3 md:flex-row md:items-end md:flex-wrap"
            >
                <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-end w-full">
                    <div className="flex-1 min-w-[140px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Код</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newCode}
                            onChange={(event) => onChangeNewCode(event.target.value)}
                            placeholder="zeus_child"
                            required
                        />
                    </div>

                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Заголовок
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newTitle}
                            onChange={(event) => onChangeNewTitle(event.target.value)}
                            placeholder="Новая нода"
                            required
                        />
                    </div>

                    <div className="w-[140px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Тип ноды
                        </label>
                        <select
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newType}
                            onChange={(event) => onChangeNewType(event.target.value)}
                        >
                            {nodeTypes.map((item) => (
                                <option key={item.value} value={item.label}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-[140px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Пол</label>
                        <select
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newGender}
                            onChange={(event) => onChangeNewGender(event.target.value)}
                        >
                            {genders.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-[120px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">X</label>
                        <input
                            type="number"
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newX}
                            onChange={(event) => onChangeNewX(Number(event.target.value) || 0)}
                        />
                    </div>

                    <div className="w-[120px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Y</label>
                        <input
                            type="number"
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newY}
                            onChange={(event) => onChangeNewY(Number(event.target.value) || 0)}
                        />
                    </div>

                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Краткое описание
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newShortDescription}
                            onChange={(event) => onChangeNewShortDescription(event.target.value)}
                            placeholder="Кратко о ноде"
                            required
                        />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Описание
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newDescription}
                            onChange={(event) => onChangeNewDescription(event.target.value)}
                            placeholder="Полное описание"
                            required
                        />
                    </div>

                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Icons (имя файла в /icons)
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newIcon}
                            onChange={(event) => onChangeNewIcon(event.target.value)}
                            placeholder="zeus.svg"
                        />
                    </div>

                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Avatar (имя файла в /avatars)
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={newAvatar}
                            onChange={(event) => onChangeNewAvatar(event.target.value)}
                            placeholder="zeus.png"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-end w-full border-t border-dashed border-zinc-200 pt-3 mt-2">
                    <div className="w-[220px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Связать с нодой
                        </label>
                        <select
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={relationTargetId}
                            onChange={(event) =>
                                onChangeRelationTargetId(
                                    event.target.value ? Number(event.target.value) : "",
                                )
                            }
                        >
                            <option value="">Без связи</option>
                            {sortedNodes.map((node) => (
                                <option key={node.id} value={node.id}>
                                    {node.title} ({node.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-[160px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Тип связи
                        </label>
                        <select
                            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={relationType}
                            onChange={(event) => onChangeRelationType(event.target.value)}
                        >
                            {edgeTypes.map((item) => (
                                <option key={item.value} value={item.label}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-[220px]">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Направление связи
                        </label>
                        <div className="flex items-center gap-2 text-xs text-zinc-700">
                            <label className="inline-flex items-center gap-1">
                                <input
                                    type="radio"
                                    className="h-3 w-3"
                                    checked={relationDirection === "from_new"}
                                    onChange={() => onChangeRelationDirection("from_new")}
                                />
                                <span>новая → выбранная</span>
                            </label>
                            <label className="inline-flex items-center gap-1">
                                <input
                                    type="radio"
                                    className="h-3 w-3"
                                    checked={relationDirection === "to_new"}
                                    onChange={() => onChangeRelationDirection("to_new")}
                                />
                                <span>выбранная → новая</span>
                            </label>
                        </div>
                    </div>

                    <div className="md:ml-auto">
                        <button
                            type="submit"
                            className="w-full md:w-auto rounded-md bg-zinc-900 text-white px-4 py-2 text-xs font-medium hover:bg-zinc-800 transition disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "Сохраняем..." : "Добавить ноду"}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}
