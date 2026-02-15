"use client";
import React from 'react'
import NodeCart from "@/app/graph/_components/NodeCart";
import Graph from "@/app/graph/_components/Graph";

const GraphArea = () => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#020617]">
            <div className="flex-1 h-[80%] relative">
                <Graph />
            </div>
            <div className="w-80 h-full border-l border-white/10 bg-black/40 backdrop-blur-md z-20">
                <NodeCart />
            </div>
        </div>
    )
}

export default GraphArea