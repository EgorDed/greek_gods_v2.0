import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { GraphInner } from "@/app/graph/_components/GraphInner";

const Graph = () => (
    <ReactFlowProvider>
        <GraphInner />
    </ReactFlowProvider>
);

export default Graph;
