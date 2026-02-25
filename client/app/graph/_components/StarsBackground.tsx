"use client";

import React, { useMemo } from "react";

// Два слоя: 1) туманность (облака), 2) звёзды разного размера и яркости

function useStarfield() {
  return useMemo(() => {
    const seed = (s: number) => {
      let x = s;
      return () => {
        x = (x * 9301 + 49297) % 233280;
        return x / 233280;
      };
    };
    const r = seed(12345);
    const small: { x: number; y: number; o: number }[] = [];
    for (let i = 0; i < 400; i++) {
      small.push({ x: r() * 100, y: r() * 100, o: 0.4 + r() * 0.6 });
    }
    const medium: { x: number; y: number; o: number; r: number }[] = [];
    for (let i = 0; i < 120; i++) {
      medium.push({
        x: r() * 100,
        y: r() * 100,
        o: 0.6 + r() * 0.4,
        r: 0.15 + r() * 0.2,
      });
    }
    const large: { x: number; y: number; o: number; r: number }[] = [];
    for (let i = 0; i < 25; i++) {
      large.push({
        x: r() * 100,
        y: r() * 100,
        o: 0.8 + r() * 0.2,
        r: 0.35 + r() * 0.3,
      });
    }
    return { small, medium, large };
  }, []);
}

export function StarsBackground() {
  const { small, medium, large } = useStarfield();

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
      aria-hidden
    >
      {/* Туманность: облака газа/пыли в тёмно-синем, фиолетовом, коричневом */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="nebula1" cx="30%" cy="20%" r="50%">
            <stop offset="0%" stopColor="rgba(30, 27, 75, 0.5)" />
            <stop offset="70%" stopColor="rgba(15, 23, 42, 0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="nebula2" cx="70%" cy="80%" r="45%">
            <stop offset="0%" stopColor="rgba(49, 46, 129, 0.4)" />
            <stop offset="60%" stopColor="rgba(30, 27, 75, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="nebula3" cx="55%" cy="35%" r="40%">
            <stop offset="0%" stopColor="rgba(45, 55, 72, 0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="nebula4" cx="15%" cy="70%" r="35%">
            <stop offset="0%" stopColor="rgba(120, 53, 15, 0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="nebula5" cx="85%" cy="15%" r="30%">
            <stop offset="0%" stopColor="rgba(67, 56, 202, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#nebula1)" />
        <rect width="100" height="100" fill="url(#nebula2)" />
        <rect width="100" height="100" fill="url(#nebula3)" />
        <rect width="100" height="100" fill="url(#nebula4)" />
        <rect width="100" height="100" fill="url(#nebula5)" />
      </svg>

      {/* Звёзды: мелкие точки */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {small.map((s, i) => (
          <circle
            key={`s-${i}`}
            cx={s.x}
            cy={s.y}
            r={0.08}
            fill="rgba(255,255,255,0.95)"
            opacity={s.o}
          />
        ))}
      </svg>

      {/* Звёзды: средние */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {medium.map((s, i) => (
          <circle
            key={`m-${i}`}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="rgba(255,255,255,0.98)"
            opacity={s.o}
          />
        ))}
      </svg>

      {/* Звёзды: крупные со свечением */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="bigStar">
            <stop offset="0%" stopColor="rgba(255,255,255,1)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {large.map((s, i) => (
          <g key={`l-${i}`}>
            <circle
              cx={s.x}
              cy={s.y}
              r={s.r * 2.5}
              fill="url(#bigStar)"
              opacity={s.o * 0.5}
            />
            <circle
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="rgba(255,255,255,1)"
              opacity={s.o}
              filter="url(#starGlow)"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
