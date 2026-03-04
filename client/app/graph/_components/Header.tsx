"use client";
import React from "react";
import { useGraphContext } from "@/app/graph/_components/GraphContextWrappper";

const Header = () => {
    const { isAdmin, isEditMode, setIsEditMode, groupParentEdges, setGroupParentEdges } =
        useGraphContext();

    const toggleEdit = () => {
        if (!isAdmin) return;
        setIsEditMode(!isEditMode);
    };

    const toggleGrouping = () => {
        setGroupParentEdges(!groupParentEdges);
    };

    return (
        <header className="h-[100px] w-full fixed top-0 left-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-md flex items-center justify-between px-8">
            <h1 className="text-white text-2xl font-bold tracking-widest uppercase">
                Greek Gods Graph
            </h1>

            <div className="flex items-center gap-3">
                {!isAdmin ? (
                    <span className="text-xs text-slate-400">
                        Войдите через /admin, чтобы редактировать
                    </span>
                ) : null}
                <button
                    type="button"
                    onClick={toggleEdit}
                    disabled={!isAdmin}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        isEditMode
                            ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                            : "border-slate-500/60 bg-slate-800/60 text-slate-200"
                    } ${!isAdmin ? "opacity-50 cursor-not-allowed" : "hover:border-emerald-400/70"}`}
                >
                    {isEditMode ? "Режим редактирования" : "Режим просмотра"}
                </button>
                <button
                    type="button"
                    onClick={toggleGrouping}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        groupParentEdges
                            ? "border-sky-400 bg-sky-500/10 text-sky-200"
                            : "border-slate-500/60 bg-slate-800/60 text-slate-200"
                    } hover:border-sky-400/70`}
                >
                    {groupParentEdges ? "Упрощать родительские связи" : "Показывать все связи"}
                </button>
            </div>
        </header>
    );
};

export default Header;
