import React from "react";
import { Button } from "@/components/ui/button";
import type { IGraphNode } from "@/app/graph/types";
import type { MetaOption } from "@/app/lib/metaOptions";

interface ChildRelationSectionProps {
    mode: "existing" | "new";
    setMode: (mode: "existing" | "new") => void;

    selectableNodes: IGraphNode[];

    childTargetId: number | "";
    setChildTargetId: (value: number | "") => void;

    childNewCode: string;
    setChildNewCode: (value: string) => void;
    childNewTitle: string;
    setChildNewTitle: (value: string) => void;
    childNewTypeLabel: string;
    setChildNewTypeLabel: (value: string) => void;
    childNewGender: string;
    setChildNewGender: (value: string) => void;
    childNewShortDescription: string;
    setChildNewShortDescription: (value: string) => void;
    childNewDescription: string;
    setChildNewDescription: (value: string) => void;
    childNewIcon: string;
    setChildNewIcon: (value: string) => void;
    childNewAvatar: string;
    setChildNewAvatar: (value: string) => void;

    nodeTypes: MetaOption[];
    genders: MetaOption[];

    loading: boolean;
    onCreateExisting: () => void;
    onCreateNew: () => void;
}

// Блок UI для связи «сын/дочь»:
// - выбор уже существующей ноды-ребёнка
// - создание новой ноды-ребёнка
export const ChildRelationSection: React.FC<ChildRelationSectionProps> = ({
    mode,
    setMode,
    selectableNodes,
    childTargetId,
    setChildTargetId,
    childNewCode,
    setChildNewCode,
    childNewTitle,
    setChildNewTitle,
    childNewTypeLabel,
    setChildNewTypeLabel,
    childNewGender,
    setChildNewGender,
    childNewShortDescription,
    setChildNewShortDescription,
    childNewDescription,
    setChildNewDescription,
    childNewIcon,
    setChildNewIcon,
    childNewAvatar,
    setChildNewAvatar,
    nodeTypes,
    genders,
    loading,
    onCreateExisting,
    onCreateNew,
}) => {
    return (
        <div className="mt-2 rounded-lg border border-white/15 bg-white/5 p-3 space-y-3">
            <div className="text-[11px] text-white/60 uppercase tracking-widest">
                Новая связь «сын/дочь»
            </div>

            <div className="flex items-center gap-3 text-[11px] text-white/70">
                <label className="inline-flex items-center gap-1">
                    <input
                        type="radio"
                        className="h-3 w-3"
                        checked={mode === "existing"}
                        onChange={() => setMode("existing")}
                    />
                    <span>С существующей нодой</span>
                </label>
                <label className="inline-flex items-center gap-1">
                    <input
                        type="radio"
                        className="h-3 w-3"
                        checked={mode === "new"}
                        onChange={() => setMode("new")}
                    />
                    <span>Создать новую ноду-ребёнка</span>
                </label>
            </div>

            {mode === "existing" ? (
                <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-white/50">
                        Нода-ребёнок
                    </label>
                    <select
                        className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={childTargetId}
                        onChange={(event) =>
                            setChildTargetId(event.target.value ? Number(event.target.value) : "")
                        }
                    >
                        <option value="">Не выбрана</option>
                        {selectableNodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.title} ({node.code})
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-end pt-1">
                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-emerald-500/20 border-emerald-400/70 hover:bg-emerald-500/40 text-[11px] h-8 px-3"
                            onClick={onCreateExisting}
                            disabled={loading}
                        >
                            {loading ? "Добавляем..." : "Создать связь"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                                Код
                            </label>
                            <input
                                value={childNewCode}
                                onChange={(event) => setChildNewCode(event.target.value)}
                                className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="zeus_child"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                                Заголовок
                            </label>
                            <input
                                value={childNewTitle}
                                onChange={(event) => setChildNewTitle(event.target.value)}
                                className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Имя ноды"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                                Тип
                            </label>
                            <select
                                className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={childNewTypeLabel}
                                onChange={(event) => setChildNewTypeLabel(event.target.value)}
                            >
                                {nodeTypes.map((item) => (
                                    <option key={item.value} value={item.label}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                                Пол
                            </label>
                            <select
                                className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={childNewGender}
                                onChange={(event) => setChildNewGender(event.target.value)}
                            >
                                {genders.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                            Краткое описание
                        </label>
                        <input
                            value={childNewShortDescription}
                            onChange={(event) => setChildNewShortDescription(event.target.value)}
                            className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Кратко о ноде"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                            Описание
                        </label>
                        <textarea
                            value={childNewDescription}
                            onChange={(event) => setChildNewDescription(event.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                                Icon (/icons)
                            </label>
                            <input
                                value={childNewIcon}
                                onChange={(event) => setChildNewIcon(event.target.value)}
                                className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="zeus.svg"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                                Avatar (/avatars)
                            </label>
                            <input
                                value={childNewAvatar}
                                onChange={(event) => setChildNewAvatar(event.target.value)}
                                className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="zeus.png"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-1">
                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-emerald-500/20 border-emerald-400/70 hover:bg-emerald-500/40 text-[11px] h-8 px-3"
                            onClick={onCreateNew}
                            disabled={loading}
                        >
                            {loading ? "Создаём..." : "Создать ноду-ребёнка и связь"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
