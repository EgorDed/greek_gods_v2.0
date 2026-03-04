"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type ToastKind = "success" | "error";

interface IToastState {
    id: number;
    message: string;
    type: ToastKind;
}

interface IToastContext {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
}

const ToastContext = createContext<IToastContext | undefined>(undefined);

export const ToastProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [toast, setToast] = useState<IToastState | null>(null);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timer = setTimeout(() => {
            setToast(null);
        }, 4000);

        return () => clearTimeout(timer);
    }, [toast]);

    const show = useCallback((message: string, type: ToastKind) => {
        setToast({
            id: Date.now(),
            message,
            type,
        });
    }, []);

    const showSuccess = useCallback((message: string) => show(message, "success"), [show]);

    const showError = useCallback((message: string) => show(message, "error"), [show]);

    return (
        <ToastContext.Provider value={{ showSuccess, showError }}>
            {children}

            {toast && (
                <div className="fixed bottom-4 right-4 z-[9999]">
                    <div
                        className={`rounded-lg px-4 py-3 text-sm shadow-lg border ${
                            toast.type === "error"
                                ? "bg-red-900/90 border-red-500 text-red-50"
                                : "bg-emerald-900/90 border-emerald-500 text-emerald-50"
                        }`}
                    >
                        {toast.message}
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = (): IToastContext => {
    const ctx = useContext(ToastContext);

    if (!ctx) {
        throw new Error("useToast must be used within ToastProvider");
    }

    return ctx;
};
