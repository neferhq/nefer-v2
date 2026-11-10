"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { PALETTE } from "@/lib/palette";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shaders                                                                   */
/* -------------------------------------------------------------------------- */

const VERTEX_SHADER = /* glsl */ `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/**
 * Domain-warped fbm drives four colour blobs plus a thin aurora ribbon.
 * The pointer swirls the field and pulls each blob toward it by a different
 * amount, so the colours trail the cursor in layers instead of piling up.
 */
const FRAGMENT_SHADER = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;      // 0..1, y up
uniform float uVel;        // smoothed pointer speed
uniform float uTheme;      // 0 = dark, 1 = light (eased in JS)
uniform float uScroll;     // scrollY / viewport height
uniform float uIntensity;
uniform vec3  uC0;         // emerald
uniform vec3  uC1;         // violet
uniform vec3  uC2;         // blue
uniform vec3  uC3;         // crimson

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.02 + vec2(17.0, 9.0);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float asp = uRes.x / uRes.y;
  float half_w = asp * 0.5;

  // Screen space, centred, aspect corrected.
  vec2 p = uv - 0.5;
  p.x *= asp;
  vec2 m = uMouse - 0.5;
  m.x *= asp;

  float t = uTime * 0.05;

  // Pointer swirl.
  vec2 d = p - m;
  float md = dot(d, d);
  float infl = exp(-md * 6.0) * (0.25 + min(uVel, 1.5));
  p += vec2(-d.y, d.x) * infl * 0.55;

  // Noise field scrolls slowly with the page; blobs stay anchored to the screen.
  vec2 pn = p + vec2(0.0, uScroll * 0.25);
  vec2 q = vec2(fbm(pn * 1.3 + vec2(0.0, t)),
                fbm(pn * 1.3 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(pn * 1.6 + 2.0 * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(pn * 1.6 + 2.0 * q + vec2(8.3, 2.8) - t * 1.2));
  float f = fbm(pn * 1.1 + 2.2 * r);
  vec2 pw = p + (r - 0.5) * 0.55;

  // Blob centres drift on their own and lean toward the pointer.
  vec2 c0 = vec2(-half_w * 0.70 + 0.12 * sin(t * 5.1),  0.22 + 0.10 * cos(t * 4.3));
  vec2 c1 = vec2( half_w * 0.65 + 0.14 * cos(t * 4.1),  0.30 + 0.10 * sin(t * 5.7));
  vec2 c2 = vec2( half_w * 0.15 + 0.16 * sin(t * 3.7 + 1.0), -0.30 + 0.08 * cos(t * 4.9));
  vec2 c3 = vec2(-half_w * 0.35 + 0.12 * cos(t * 6.3), -0.18 + 0.12 * sin(t * 3.3));
  c0 += (m - c0) * 0.06;
  c1 += (m - c1) * 0.10;
  c2 += (m - c2) * 0.16;
  c3 += (m - c3) * 0.24;

  float w0 = exp(-dot(pw - c0, pw - c0) * 2.6);
  float w1 = exp(-dot(pw - c1, pw - c1) * 2.6);
  float w2 = exp(-dot(pw - c2, pw - c2) * 2.2);
  float w3 = exp(-dot(pw - c3, pw - c3) * 4.5);

  float W = w0 + w1 + w2 + w3;
  vec3 tint = (w0 * uC0 + w1 * uC1 + w2 * uC2 + w3 * uC3) / (W + 1e-3);
  float k = 1.0 - exp(-W * 1.2);
  float body = 0.55 + 0.9 * f;

  // Aurora ribbon: a luminous line that bends with the warp field.
  float ribbonY = 0.18 + 0.10 * sin(pw.x * 2.4 + t * 7.0) + (f - 0.5) * 0.45;
  float ry = (pw.y - ribbonY) * 6.5;
  float rb = exp(-ry * ry);
  vec3 rc = mix(mix(uC0, uC2, smoothstep(-half_w, 0.0, p.x)), uC1, smoothstep(0.0, half_w, p.x));

  vec3 baseD = vec3(0.0353, 0.0510, 0.0863);   // #090D16
  vec3 baseL = vec3(0.9725, 0.9804, 0.9882);   // #F8FAFC

  vec3 dark = baseD + tint * k * 0.30 * body * uIntensity
                    + rc * rb * 0.16 * (0.5 + k) * uIntensity;
  dark += mix(uC1, uC2, 0.5) * exp(-md * 18.0) * (0.04 + uVel * 0.10) * uIntensity;
  dark *= mix(0.80, 1.0, smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(1.0, 0.9))));

  vec3 light = mix(baseL, tint, clamp(k * 0.26 * body * uIntensity, 0.0, 0.42));
  light = mix(light, rc, rb * 0.12 * uIntensity);

  vec3 col = mix(dark, light, uTheme);

  // Dither to kill gradient banding.
  col += (hash(frag) - 0.5) * (1.5 / 255.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[FluidBackground] shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export interface FluidBackgroundProps {
  /** Four hex colours: [blob 1, blob 2, blob 3, blob 4]. Defaults to the brand palette. */
  colors?: readonly [string, string, string, string];
  /** Glow strength multiplier. 1 is the designed look. */
  intensity?: number;
  /** Render scale relative to CSS pixels. Lower is cheaper, the gradient stays smooth. */
  resolution?: number;
  className?: string;
}

const DEFAULT_COLORS = [
  PALETTE.emerald,
  PALETTE.violet,
  PALETTE.blue,
  PALETTE.crimson,
] as const;

export function FluidBackground({
  colors = DEFAULT_COLORS,
  intensity = 1,
  resolution = 0.5,
  className,
}: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const themeTarget = useRef(0);
  const redraw = useRef<(() => void) | null>(null);
  const [fallback, setFallback] = useState(false);

  const colorKey = colors.join("|");

  // Theme changes are eased inside the render loop; this only updates the target.
  useEffect(() => {
    themeTarget.current = resolvedTheme === "light" ? 1 : 0;
    redraw.current?.();
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      setFallback(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setFallback(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[FluidBackground] link error:", gl.getProgramInfoLog(program));
      setFallback(true);
      return;
    }
    gl.useProgram(program);

    // One oversized triangle covers the viewport.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const uVel = u("uVel");
    const uTheme = u("uTheme");
    const uScroll = u("uScroll");
    const uIntensity = u("uIntensity");

    colors.forEach((hex, i) => {
      const [r, g, b] = hexToRgb(hex);
      gl.uniform3f(u(`uC${i}`), r, g, b);
    });
    gl.uniform1f(uIntensity, intensity);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Animation state.
    const mouse = { x: 0.5, y: 0.55 };
    const target = { x: 0.5, y: 0.55 };
    let lastMove = -Infinity;
    let vel = 0;
    let scroll = window.scrollY / Math.max(1, window.innerHeight);
    let theme = document.documentElement.classList.contains("dark") ? 0 : 1;
    themeTarget.current = theme;
    let time = reduced ? 14 : 0;
    let first = true;

    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uVel, vel);
      gl.uniform1f(uTheme, theme);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (first) {
        first = false;
        canvas.style.opacity = "1";
      }
    };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * resolution;
      const w = Math.max(2, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(2, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
      if (reduced) draw();
    };

    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
      lastMove = performance.now();
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setFallback(true);
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;

      // Drift on its own when the pointer is idle (and on touch devices).
      if (now - lastMove > 3000) {
        target.x = 0.5 + 0.28 * Math.sin(time * 0.23);
        target.y = 0.55 + 0.18 * Math.cos(time * 0.19);
      }

      const px = mouse.x;
      const py = mouse.y;
      const follow = 1 - Math.exp(-dt * 4);
      mouse.x += (target.x - mouse.x) * follow;
      mouse.y += (target.y - mouse.y) * follow;

      const speed = Math.hypot(mouse.x - px, mouse.y - py) / Math.max(dt, 1e-3);
      vel += (Math.min(speed * 0.6, 1.5) - vel) * (1 - Math.exp(-dt * 6));
      theme += (themeTarget.current - theme) * (1 - Math.exp(-dt * 6));
      scroll += (window.scrollY / Math.max(1, window.innerHeight) - scroll) * (1 - Math.exp(-dt * 5));

      draw();
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    canvas.addEventListener("webglcontextlost", onContextLost);

    if (reduced) {
      redraw.current = () => {
        theme = themeTarget.current;
        draw();
      };
      draw();
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      redraw.current = null;
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      // Free GPU resources. The context itself is left alive on purpose: React Strict Mode
      // remounts onto the same canvas, and a lost context cannot be revived.
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorKey, intensity, resolution]);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      {fallback ? (
        <StaticAura colors={colors} />
      ) : (
        <canvas
          ref={canvasRef}
          className="h-full w-full opacity-0 transition-opacity duration-1000"
        />
      )}
    </div>
  );
}

/** CSS-only stand-in for browsers without WebGL. Same palette, no motion. */
function StaticAura({ colors }: { colors: readonly string[] }) {
  const [c0, c1, c2, c3] = colors;
  return (
    <div
      className="absolute inset-0 opacity-40 dark:opacity-30"
      style={{
        background: [
          `radial-gradient(40% 35% at 18% 22%, ${c0}, transparent 70%)`,
          `radial-gradient(38% 34% at 82% 28%, ${c1}, transparent 70%)`,
          `radial-gradient(45% 38% at 55% 85%, ${c2}, transparent 70%)`,
          `radial-gradient(22% 20% at 30% 65%, ${c3}, transparent 70%)`,
        ].join(","),
      }}
    />
  );
}
