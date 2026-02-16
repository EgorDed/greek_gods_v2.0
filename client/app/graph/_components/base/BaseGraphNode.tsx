import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

import { Rocket } from "lucide-react";
import {INode} from "@/app/graph/page";


export type BaseGraphNodeDemoProps = {
    data: INode
};

export const BaseGraphNodeDemo = memo(({data}: BaseGraphNodeDemoProps) => {
    const glowColor =
        data.type_en === 'God' ? 'rgba(147, 51, 234, 0.6)' : 'rgba(59, 130, 246, 0.6)';
    
    return (
        <div className="relative group">
            {/* Input Handle */}
            <Handle 
                type="target" 
                position={Position.Top} 
                className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50"
                style={{ top: '-6px' }}
            />
            
            <div 
                className="rounded-3xl p-[2px] transition-all duration-300 group-hover:scale-105 shadow-2xl"
                style={{
                    background: `linear-gradient(135deg, ${glowColor}, transparent)`,
                    boxShadow: `0 0 25px ${glowColor}`,
                }}
            >
                <div 
                    className="w-48 rounded-[22px] bg-black/90 backdrop-blur-2xl text-white overflow-hidden"
                >
                    {/* Header/Drag area */}
                    <div className="flex flex-col items-center py-4 gap-1 select-none">
                        <div className="p-2 rounded-full bg-white/10 mb-1">
                             <Rocket className="size-5 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold tracking-wider uppercase text-center px-2 leading-tight">
                            {data.title}
                        </h3>
                        <div className="text-[10px] px-3 py-0.5 rounded-full bg-white/20 text-purple-200 border border-white/10 uppercase tracking-tighter">
                            {data.type}
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="px-4 pb-5 text-center select-none">
                        <p className="text-[11px] leading-relaxed text-gray-400 italic">
                            {data.short_description || "No description available"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Output Handle */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50"
                style={{ bottom: '-6px' }}
            />
        </div>
    );
});

BaseGraphNodeDemo.displayName = "BaseGraphNodeDemo";