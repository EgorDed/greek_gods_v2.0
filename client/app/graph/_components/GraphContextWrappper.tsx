"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { IGraph, INode } from "@/app/graph/page";

interface GraphContextType {
  graphData: IGraph;
  selectedNode: INode | null;
  setSelectedNode: (node: INode | null) => void;
  isAdmin: boolean;
  authToken: string | null;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  refreshGraph: () => Promise<void>;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

interface GraphProviderProps {
  graphData: IGraph;
  children: React.ReactNode;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api";

export function GraphContextWrapper({
  children,
  graphData,
}: Readonly<GraphProviderProps>) {
  const [graphState, setGraphState] = useState<IGraph>(graphData);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = window.localStorage.getItem("adminToken");
    setAuthToken(token);
  }, []);

  const isAdmin = !!authToken;

  const refreshGraph = async () => {
    try {
      const response = await fetch(`${API_URL}/graph`);
      if (!response.ok) {
        return;
      }

      const data: IGraph = await response.json();
      setGraphState(data);
    } catch {
      // ignore refresh errors
    }
  };

  return (
    <GraphContext.Provider
      value={{
        graphData: graphState,
        selectedNode,
        setSelectedNode,
        isAdmin,
        authToken,
        isEditMode,
        setIsEditMode,
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
