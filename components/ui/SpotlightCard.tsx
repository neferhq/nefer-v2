"use client";

import {
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  /** Hex colour of the light that follows the pointer. */
  color?: string;
  /** Radius of the light in px. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Surface with a soft light that tracks the pointer (Aceternity-style spotlight).
 * Position is written to CSS variables, so pointer movement never re-renders React.
 */
export function SpotlightCard({
  children,
  color = "#8B5CF6",
  size = 420,
  className,
  style,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      style={style}
      className={cn("group/spot relative overflow-hidden", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), ${color}26, transparent 60%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
