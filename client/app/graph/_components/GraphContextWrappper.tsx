"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { IGraphData, IGraphNode } from "@/app/graph/types";
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";

type IGraph = IGraphData;

interface GraphContextType {
    graphData: IGraph;
    selectedNode: IGraphNode | null;
    setSelectedNode: (node: IGraphNode | null) => void;
    isAdmin: boolean;
    authToken: string | null;
    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
    groupParentEdges: boolean;
    setGroupParentEdges: (value: boolean) => void;
    refreshGraph: () => Promise<void>;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

interface GraphProviderProps {
    graphData: IGraph;
    children: React.ReactNode;
    initialErrorMessage?: string | null;
}

export function GraphContextWrapper({
    children,
    graphData,
    initialErrorMessage,
}: Readonly<GraphProviderProps>) {
    const [graphState, setGraphState] = useState<IGraph>(graphData);
    const [selectedNode, setSelectedNode] = useState<IGraphNode | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [groupParentEdges, setGroupParentEdges] = useState(true);
    const { token } = useAuth();
    const { showError } = useToast();

    useEffect(() => {
        if (initialErrorMessage) {
            showError(initialErrorMessage);
        }
    }, [initialErrorMessage, showError]);

    const refreshGraph = async () => {
        try {
            const data = await api.graph.get();
            setGraphState(data);
        } catch {
            showError("Не удалось обновить граф.");
        }
    };

    return (
        <GraphContext.Provider
            value={{
                graphData: graphState,
                selectedNode,
                setSelectedNode,
                isAdmin: !!token,
                authToken: token,
                isEditMode,
                setIsEditMode,
                groupParentEdges,
                setGroupParentEdges,
                refreshGraph,
            }}
        >
            {children}
        </GraphContext.Provider>
    );
}

export function useGraphContext() {
    const context = useContext(GraphContext);

    if (!context) {
        throw new Error("useGraphContext must be used within GraphProvider");
    }

    return context;
}
