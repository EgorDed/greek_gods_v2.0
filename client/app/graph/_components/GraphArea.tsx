"use client";
import React from 'react'
import NodeCart from "@/app/graph/_components/NodeCart";
import Graph from "@/app/graph/_components/Graph";

const GraphArea = () => {
    return (
        <div className="flex h-screen pt-[100px] bg-[#020617] overflow-hidden">
            <div className="flex-grow relative h-full">
                <Graph />
            </div>
            <div className="w-[400px] h-full border-l border-white/10 bg-black/40 backdrop-blur-md z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                <NodeCart />
            </div>
        </div>
    )
}

export default GraphArea