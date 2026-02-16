"use client";
import React, { createContext, useContext } from 'react';
import {IGraph, INode} from "@/app/graph/page";

interface GraphContextType {
    graphData: IGraph;
    selectedNode: INode | null;
    setSelectedNode: (node: INode | null) => void;
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
    const [selectedNode, setSelectedNode] = React.useState<INode | null>(null);

    return (
        <GraphContext.Provider
            value={{graphData, selectedNode, setSelectedNode}}
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