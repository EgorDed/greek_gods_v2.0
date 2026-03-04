"use client";

import React from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import { ToastProvider } from "@/app/context/ToastContext";

export const AppProviders = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
    );
};
