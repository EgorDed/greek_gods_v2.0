import React from "react";

interface PositionSaveIndicatorProps {
    state: "idle" | "saving" | "saved";
}

// Небольшой индикатор в левом нижнем углу,
// который показывает процесс сохранения позиции ноды.
export const PositionSaveIndicator: React.FC<PositionSaveIndicatorProps> = ({ state }) => {
    if (state === "idle") {
        return null;
    }

    const isSaving = state === "saving";

    return (
        <div className="absolute bottom-4 left-4 z-50 rounded-lg bg-slate-900/90 border border-slate-700 px-3 py-1.5 shadow-lg text-[11px] text-slate-100 flex items-center gap-2">
            <span
                className={`inline-block h-2 w-2 rounded-full ${
                    isSaving ? "bg-amber-400" : "bg-emerald-400"
                }`}
            />
            <span>{isSaving ? "Сохраняем позицию…" : "Позиция сохранена"}</span>
        </div>
    );
};
