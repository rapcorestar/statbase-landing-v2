"use client";
import React, { useEffect, useRef, useState } from "react";

export default function TopTape() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef  = useRef<HTMLDivElement>(null);

  const [vars, setVars] = useState<{ loopW: number; speed: number }>({
    loopW: 0,
    speed: 20,
  });

  // Keep --tape-h in sync for sticky header spacing
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const setH = () =>
      document.documentElement.style.setProperty(
        "--tape-h",
        `${Math.round(el.getBoundingClientRect().height)}px`
      );
    setH();
    const ro = new ResizeObserver(setH);
    ro.observe(el);
    // @ts-ignore
    document.fonts?.ready?.then(setH);
    window.addEventListener("resize", setH);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setH);
    };
  }, []);

  // Measure Copy A width + gap to compute loop distance & speed
  useEffect(() => {
    const measure = () => {
      const copy = copyRef.current;
      const track = trackRef.current;
      if (!copy || !track) return;

      const wA = Math.ceil(copy.getBoundingClientRect().width);
      const cs = getComputedStyle(track);
      const gapPx = parseFloat(cs.columnGap || cs.gap || "0") || 0;

      const loopW = wA + Math.round(gapPx);
      const pxPerSec = 80; // adjust to taste (higher = faster)
      const dur = Math.max(8, loopW / pxPerSec);

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      setVars({ loopW, speed: prefersReduced ? 0 : dur });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (copyRef.current) ro.observe(copyRef.current);
    // @ts-ignore
    document.fonts?.ready?.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const messages = [
    "*** CONFIDENTIAL — FIELD TEST IN PROGRESS ***",
    "STATBASE — BASEBALL ANALYTICS LAB",
    ">>> ADAPTIVE AI INSIGHTS",
    "*** CONFIDENTIEL — ESSAIS TERRAIN EN COURS ***",
    "STATBASE — LAB D’ANALYTIQUE DU BASEBALL",
    ">>> ANALYSE IA ADAPTATIVE",
    "*** VERTRAULICH — FELDVERSUCH AKTIV ***",
    "STATBASE — BASEBALL-ANALYTIK-LABOR",
    ">>> ADAPTIVE KI-ERKENNTNISSE",
    "*** RISERVATO — TEST SUL CAMPO IN CORSO ***",
    "STATBASE — LAB DI ANALISI BASEBALL",
    ">>> APPROFONDIMENTI IA ADATTIVA",
    "*** CONFIDENCIAL — PRUEBA DE CAMPO EN CURSO ***",
    "STATBASE — LAB DE ANÁLISIS DE BÉISBOL",
    ">>> INFORMES IA ADAPTATIVA",
  ];

  return (
    <div
      ref={rootRef}
      className="
        tape sticky top-0 z-50 w-full overflow-hidden
        border-b border-[var(--hud-grid)]
        bg-[color-mix(in_srgb,var(--panel)_85%,black)]
        font-[var(--font-tape)] uppercase tracking-[.22em]
        select-none
      "
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden">
        <div
          ref={trackRef}
          className="tape-track flex items-center gap-10 py-1"
          style={
            {
              // consumed by global CSS
              // @ts-ignore
              "--loop-w": `${vars.loopW}px`,
              "--tape-speed": `${vars.speed}s`,
            } as React.CSSProperties
          }
        >
          {/* Copy A — measured */}
          <div ref={copyRef} className="inline-flex items-center gap-10 whitespace-nowrap">
            {messages.map((msg, i) => (
              <span
                key={`a-${i}`}
                className="text-[13px] font-normal leading-6 text-[#57ff9d] [text-shadow:_0_0_2px_#57ff9d60,0_0_4px_#57ff9d40]"
              >
                {msg}
              </span>
            ))}
          </div>

          {/* Copy B — seamless continuation */}
          <div aria-hidden className="inline-flex items-center gap-10 whitespace-nowrap">
            {messages.map((msg, i) => (
              <span
                key={`b-${i}`}
                className="text-[13px] font-normal leading-6 text-[#57ff9d] [text-shadow:_0_0_2px_#57ff9d60,0_0_4px_#57ff9d40]"
              >
                {msg}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,255,120,0.03)_0_1px,transparent_1px_3px)] opacity-[0.35]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(87,255,157,0.04),transparent_70%)] mix-blend-screen" />
    </div>
  );
}