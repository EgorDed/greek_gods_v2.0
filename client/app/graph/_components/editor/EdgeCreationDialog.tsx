import React from "react";
import { Connection } from "@xyflow/react";
import type { MetaOption } from "@/app/lib/metaOptions";

interface EdgeCreationDialogProps {
    isEditMode: boolean;
    pendingConnection: Connection | null;
    edgeTypes: MetaOption[];
    pendingEdgeType: string;
    setPendingEdgeType: (value: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

// Диалог в правом нижнем углу,
// который появляется при соединении двух нод в режиме редактирования
// и даёт выбрать тип создаваемой связи.
export const EdgeCreationDialog: React.FC<EdgeCreationDialogProps> = ({
    isEditMode,
    pendingConnection,
    edgeTypes,
    pendingEdgeType,
    setPendingEdgeType,
    onConfirm,
    onCancel,
}) => {
    if (!isEditMode || !pendingConnection || edgeTypes.length === 0) {
        return null;
    }

    return (
        <div className="absolute bottom-4 right-4 z-50 rounded-lg bg-slate-900/95 border border-slate-700 px-4 py-3 shadow-xl text-xs text-slate-100 space-y-2">
            <div className="font-semibold text-slate-50">Создать связь между нодами</div>
            <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-widest text-slate-400">
                    Тип связи
                </label>
                <select
                    className="w-full rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={pendingEdgeType}
                    onChange={(event) => setPendingEdgeType(event.target.value)}
                >
                    {edgeTypes.map((item) => (
                        <option key={item.value} value={item.label}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
                <button
                    type="button"
                    className="px-2 py-1 rounded-md border border-slate-600 text-slate-200 hover:bg-slate-800"
                    onClick={onCancel}
                >
                    Отмена
                </button>
                <button
                    type="button"
                    className="px-3 py-1 rounded-md bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
                    onClick={onConfirm}
                >
                    Создать
                </button>
            </div>
        </div>
    );
};
