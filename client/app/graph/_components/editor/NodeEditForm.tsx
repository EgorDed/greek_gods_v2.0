import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { IGraphNode } from "@/app/graph/types";
import { api, ApiError } from "@/app/lib/api";
import { useToast } from "@/app/context/ToastContext";

interface NodeEditFormProps {
    node: IGraphNode;
    token: string;
    nodeTypes: { label: string; value: string }[];
    onSaved: () => Promise<void> | void;
}

// Форма редактирования самой ноды (название, тип, описания, иконки).
export const NodeEditForm: React.FC<NodeEditFormProps> = ({ node, token, nodeTypes, onSaved }) => {
    const [title, setTitle] = useState("");
    const [typeLabel, setTypeLabel] = useState<string>("");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");
    const [avatar, setAvatar] = useState("");
    const [icon, setIcon] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError, showSuccess } = useToast();

    // При смене выбранной ноды заполняем форму её данными.
    useEffect(() => {
        setTitle(node.title ?? "");

        if (nodeTypes.length > 0) {
            const currentType =
                nodeTypes.find((item) => item.value === node.type_en) ??
                nodeTypes.find((item) => item.label === node.type) ??
                nodeTypes[0];

            setTypeLabel(currentType?.label ?? nodeTypes[0]?.label ?? "");
        }

        setShortDescription(node.short_description ?? "");
        setDescription(node.description ?? "");
        setAvatar(node.avatar ?? "");
        setIcon(node.icon ?? "");
        setError(null);
    }, [node, nodeTypes]);

    const handleSave = async () => {
        if (!token || nodeTypes.length === 0) {
            return;
        }

        const nodeType = nodeTypes.find((item) => item.label === typeLabel) ?? nodeTypes[0];

        try {
            setSaving(true);
            setError(null);

            await api.nodes.update(token, node.id, {
                code: node.code,
                title,
                type: nodeType.label,
                type_en: nodeType.value,
                short_description: shortDescription,
                description,
                avatar: avatar || null,
                icon: icon || null,
                meta: node.meta ?? {},
            });

            showSuccess("Нода обновлена.");
            await onSaved();
        } catch (error) {
            const message =
                error instanceof ApiError ? error.message : "Ошибка при сохранении изменений.";
            setError(message);
            showError(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-3 text-xs">
            {error && (
                <div className="rounded-md border border-red-400/60 bg-red-500/10 px-3 py-2 text-xs text-red-100">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                    Заголовок
                </label>
                <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                    Тип
                </label>
                <select
                    value={typeLabel}
                    onChange={(event) => setTypeLabel(event.target.value)}
                    className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    Краткое описание
                </label>
                <input
                    value={shortDescription}
                    onChange={(event) => setShortDescription(event.target.value)}
                    className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                    Описание
                </label>
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                        Icon (/icons)
                    </label>
                    <input
                        value={icon}
                        onChange={(event) => setIcon(event.target.value)}
                        className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="zeus.svg"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">
                        Avatar (/avatars)
                    </label>
                    <input
                        value={avatar}
                        onChange={(event) => setAvatar(event.target.value)}
                        className="w-full rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="zeus.png"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-emerald-500/20 border-emerald-400/70 hover:bg-emerald-500/40 text-[11px] h-8 px-3"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Сохраняем..." : "Сохранить"}
                </Button>
            </div>
        </div>
    );
};
