import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

export type JunctionNodeData = {
    kind: "junction";
    parentIds: number[];
    childIds: number[];
};

type JunctionNodeProps = {
    data: JunctionNodeData;
};

export const JunctionNode = memo(({ data }: JunctionNodeProps) => {
    return (
        <div className="relative group">
            <Handle
                type="target"
                id="target-top"
                position={Position.Top}
                className="!w-2 !h-2 !bg-sky-400 !border !border-white !z-50"
                style={{ top: "-4px" }}
            />
            <Handle
                type="target"
                id="target-right"
                position={Position.Right}
                className="!w-2 !h-2 !bg-sky-400 !border !border-white !z-50"
                style={{ right: "-4px" }}
            />
            <Handle
                type="target"
                id="target-bottom"
                position={Position.Bottom}
                className="!w-2 !h-2 !bg-sky-400 !border !border-white !z-50"
                style={{ bottom: "-4px" }}
            />
            <Handle
                type="target"
                id="target-left"
                position={Position.Left}
                className="!w-2 !h-2 !bg-sky-400 !border !border-white !z-50"
                style={{ left: "-4px" }}
            />
            <Handle
                type="source"
                id="source-top"
                position={Position.Top}
                className="!w-2 !h-2 !bg-sky-400 !border !border-white !z-50"
                style={{ top: "-4px" }}
            />
            <Handle
                type="source"
                id="source-right"
                position={Position.Right}
                className="!w-2 !h-2 !bg-sky-400 !border !border-white !z-50"
                style={{ right: "-4px" }}
            />
            <Handle
                type="source"
                id="source-bottom"
                position={Position.Bottom}
                className="!w-2 !h-2 !bg-sky-400 !border !border-white !z-50"
                style={{ bottom: "-4px" }}
            />
            <Handle
                type="source"
                id="source-left"
                position={Position.Left}
                className="!w-2 !h-2 !bg-sky-400 !border !border-white !z-50"
                style={{ left: "-4px" }}
            />

            <div className="flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.9)] border border-white/80" />
            </div>
        </div>
    );
});

JunctionNode.displayName = "JunctionNode";

