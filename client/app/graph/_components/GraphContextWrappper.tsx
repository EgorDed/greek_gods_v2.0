"use client";
import React, { createContext, useContext } from 'react';
import {IGraph} from "@/app/graph/page";

interface GraphContextType {
    graphData: IGraph
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

interface GraphProviderProps {
    graphData: IGraph
    children: React.ReactNode
}

export function GraphContextWrapper({
    children,
    graphData
}: Readonly<GraphProviderProps>) {
    return (
        <GraphContext.Provider
            value={{graphData}}
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