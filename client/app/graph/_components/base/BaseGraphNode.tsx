import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { INode } from "@/app/graph/page";
import { getNodeColor, getNodeIconPath } from "@/app/graph/_components/graphUtils";

export type BaseGraphNodeDemoProps = {
  data: INode;
};

const NODE_WIDTH = 192;
const NODE_HEIGHT = 150;

export const BaseGraphNodeDemo = memo(({ data }: BaseGraphNodeDemoProps) => {
  const glowColor = getNodeColor(data.type_en ?? "");
  const iconPath = getNodeIconPath(data.code ?? "", data.type_en ?? "");

  return (
    <div className="relative group">
      <Handle type="target" id="target-top" position={Position.Top} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50" style={{ top: "-6px" }} />
      <Handle type="target" id="target-right" position={Position.Right} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50" style={{ right: "-6px" }} />
      <Handle type="target" id="target-bottom" position={Position.Bottom} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50" style={{ bottom: "-6px" }} />
      <Handle type="target" id="target-left" position={Position.Left} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50" style={{ left: "-6px" }} />
      <Handle type="source" id="source-top" position={Position.Top} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50" style={{ top: "-6px" }} />
      <Handle type="source" id="source-right" position={Position.Right} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50" style={{ right: "-6px" }} />
      <Handle type="source" id="source-bottom" position={Position.Bottom} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50" style={{ bottom: "-6px" }} />
      <Handle type="source" id="source-left" position={Position.Left} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !z-50" style={{ left: "-6px" }} />

      <div
        className="rounded-3xl p-[2px] transition-all duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${glowColor}, transparent)`,
          boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor.replace("0.7", "0.3")}`,
        }}
      >
        <div
          className="w-48 rounded-[22px] bg-[#0c0c0f] text-white overflow-hidden border border-white/5"
          style={{
            boxShadow: `inset 0 0 20px ${glowColor.replace("0.7", "0.15")}`,
          }}
        >
          <div className="flex flex-col items-center py-4 gap-1 select-none">
            <div
              className="p-2 rounded-full bg-[#1a1a22] border border-white/10 mb-1 flex items-center justify-center"
              style={{
                boxShadow: `0 0 12px ${glowColor}`,
              }}
            >
              <img
                src={iconPath}
                alt=""
                className="size-6 opacity-95"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <h3 className="text-lg font-bold tracking-wider uppercase text-center px-2 leading-tight drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
              {data.title}
            </h3>
            <div
              className="text-[10px] px-3 py-0.5 rounded-full bg-[#1a1a22] border border-white/10 uppercase tracking-tighter"
              style={{ color: glowColor }}
            >
              {data.type}
            </div>
          </div>

          <div className="px-4 pb-5 text-center select-none">
            <p className="text-[11px] leading-relaxed text-gray-400 italic">
              {data.short_description || "No description available"}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
});

BaseGraphNodeDemo.displayName = "BaseGraphNodeDemo";

export { NODE_WIDTH, NODE_HEIGHT };
