"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, ApiError } from "@/app/lib/api";
import { useToast } from "./ToastContext";

interface IAuthContext {
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [token, setToken] = useState<string | null>(null);
    const { showError, showSuccess } = useToast();

    // Читаем токен из localStorage один раз на клиенте.
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const stored = window.localStorage.getItem("adminToken");
        if (stored) {
            setToken(stored);
        }
    }, []);

    const login = useCallback(
        async (email: string, password: string) => {
            try {
                const result = await api.auth.login(email, password);

                if (typeof window !== "undefined") {
                    window.localStorage.setItem("adminToken", result.token);
                }

                setToken(result.token);
                showSuccess("Успешный вход в админку.");
            } catch (error) {
                const message =
                    error instanceof ApiError ? error.message : "Не удалось выполнить авторизацию.";
                showError(message);
                throw error;
            }
        },
        [showError, showSuccess],
    );

    const logout = useCallback(async () => {
        try {
            await api.auth.logout(token);
        } catch {
            // игнорируем ошибки выхода
        } finally {
            if (typeof window !== "undefined") {
                window.localStorage.removeItem("adminToken");
            }
            setToken(null);
            showSuccess("Вы вышли из админки.");
        }
    }, [token, showSuccess]);

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): IAuthContext => {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return ctx;
};
