import React from "react";
import { Button } from "@/components/ui/button";
import type { IGraphNode } from "@/app/graph/types";
import type { MetaOption } from "@/app/lib/metaOptions";

interface SiblingRelationSectionProps {
    mode: "existing" | "new";
    setMode: (mode: "existing" | "new") => void;

    selectableNodes: IGraphNode[];

    siblingTargetId: number | "";
    setSiblingTargetId: (value: number | "") => void;

    siblingNewCode: string;
    setSiblingNewCode: (value: string) => void;
    siblingNewTitle: string;
    setSiblingNewTitle: (value: string) => void;
    siblingNewTypeLabel: string;
    setSiblingNewTypeLabel: (value: string) => void;
    siblingNewGender: string;
    setSiblingNewGender: (value: string) => void;
    siblingNewShortDescription: string;
    setSiblingNewShortDescription: (value: string) => void;
    siblingNewDescription: string;
    setSiblingNewDescription: (value: string) => void;
    siblingNewIcon: string;
    setSiblingNewIcon: (value: string) => void;
    siblingNewAvatar: string;
    setSiblingNewAvatar: (value: string) => void;

    nodeTypes: MetaOption[];
    genders: MetaOption[];

    loading: boolean;
    onCreateExisting: () => void;
    onCreateNew: () => void;
}

// Блок, который рисует UI для связи «брат/сестра»:
// - режим "с существующей нодой"
// - режим "создать новую ноду"
export const SiblingRelationSection: React.FC<SiblingRelationSectionProps> = ({
    mode,
    setMode,
    selectableNodes,
    siblingTargetId,
    setSiblingTargetId,
    siblingNewCode,
    setSiblingNewCode,
    siblingNewTitle,
    setSiblingNewTitle,
    siblingNewTypeLabel,
    setSiblingNewTypeLabel,
    siblingNewGender,
    setSiblingNewGender,
    siblingNewShortDescription,
    setSiblingNewShortDescription,
    siblingNewDescription,
    setSiblingNewDescription,
    siblingNewIcon,
    setSiblingNewIcon,
    siblingNewAvatar,
    setSiblingNewAvatar,
    nodeTypes,
    genders,
    loading,
    onCreateExisting,
    onCreateNew,
}) => {
    return (
        <div className="mt-2 rounded-lg border border-white/15 bg-white/5 p-3 space-y-3">
            <div className="text-[11px] text-white/60 uppercase tracking-widest">
                Новая связь «брат/сестра»
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
                    <span>Создать новую ноду</span>
                </label>
            </div>

            {mode === "existing" ? (
                <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-white/50">
                        Выбор ноды
                    </label>
                    <select
                        className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={siblingTargetId}
                        onChange={(event) =>
                            setSiblingTargetId(event.target.value ? Number(event.target.value) : "")
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
                                value={siblingNewCode}
                                onChange={(event) => setSiblingNewCode(event.target.value)}
                                className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="zeus_brother"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                                Заголовок
                            </label>
                            <input
                                value={siblingNewTitle}
                                onChange={(event) => setSiblingNewTitle(event.target.value)}
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
                                value={siblingNewTypeLabel}
                                onChange={(event) => setSiblingNewTypeLabel(event.target.value)}
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
                                value={siblingNewGender}
                                onChange={(event) => setSiblingNewGender(event.target.value)}
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
                            value={siblingNewShortDescription}
                            onChange={(event) => setSiblingNewShortDescription(event.target.value)}
                            className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Кратко о ноде"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                            Описание
                        </label>
                        <textarea
                            value={siblingNewDescription}
                            onChange={(event) => setSiblingNewDescription(event.target.value)}
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
                                value={siblingNewIcon}
                                onChange={(event) => setSiblingNewIcon(event.target.value)}
                                className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="zeus.svg"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                                Avatar (/avatars)
                            </label>
                            <input
                                value={siblingNewAvatar}
                                onChange={(event) => setSiblingNewAvatar(event.target.value)}
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
                            {loading ? "Создаём..." : "Создать ноду и связь"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
