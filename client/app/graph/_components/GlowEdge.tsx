"use client";

import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

export type GlowEdgeData = {
  label?: string;
  sourceColor?: string;
};

export function GlowEdge({
  id,
  data = {},
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
}: EdgeProps<Edge<GlowEdgeData>>) {
  const edgeData = data as GlowEdgeData;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const color = edgeData?.sourceColor ?? "rgba(147, 51, 234, 0.8)";
  const glowColor = color.replace("0.8", "0.4").replace(")", ", 0.5)");
  const filterId = `edgeGlow-${String(id).replace(/[^a-z0-9-]/gi, "")}`;

  const transform = `translate(${labelX}px,${labelY}px) translate(-50%, -50%)`;

  return (
    <>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g className="react-flow__edge-path-group">
        <path
          id={`${id}-glow`}
          d={edgePath}
          fill="none"
          stroke={glowColor}
          strokeWidth={12}
          strokeLinecap="round"
          className="react-flow__edge-interaction"
          style={{ filter: `url(#${filterId})` }}
        />
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            stroke: color,
            strokeWidth: 2,
            strokeLinecap: "round",
            filter: `url(#${filterId})`,
          }}
        />
      </g>
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute pointer-events-none rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/90"
            style={{
              transform,
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 0 8px rgba(0,0,0,0.5)",
            }}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
