"use client";
import React from "react";

type Stat = { value: string | number; note: string };

export default function FieldResults({
  kicker = "DATABASE — SAMPLE SIZE",
  heading = "Field results",
  items,
}: { kicker?: string; heading?: string; items: Stat[] }) {
  return (
    <section
      className="
        relative mx-auto w-full max-w-7xl
        border-x border-b border-[color:var(--hud-grid)]
        bg-[var(--panel)]
        px-6 md:px-10 pt-12 pb-16
      "
    >
      {/* Kicker */}
      <div className="mono text-[11px] tracking-[.22em] uppercase text-[var(--muted)] mb-3">
        /{kicker.toLowerCase()}
      </div>

      {/* Headline */}
      <h2
        className="
          font-[--font-semibold]
          text-[34px] sm:text-[48px] md:text-[56px] lg:text-[64px]
          tracking-[-0.015em] leading-[1.05]
          text-[var(--ink)]
          mb-6 tracking-tight
        "
      >
        {heading}
      </h2>

      {/* Core stats */}
      <div
        className="
          grid gap-10 sm:gap-12
          sm:grid-cols-3
          text-left
        "
      >
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-start">
            {/* numeric index */}
            <span className="mono text-[11px] text-[var(--muted)] tracking-[.22em] mb-1">
              /{String(i + 1).padStart(2, "0")}
            </span>

            {/* Number */}
            <span
              className="
                font-[--font-semibold] tabular-nums
                text-[64px] sm:text-[76px] md:text-[84px]
                leading-none tracking-[-0.02em]
                text-[var(--hud-bright)]
                [text-shadow:_0_0_6px_rgba(126,205,160,.18)]
              "
            >
              {item.value}
            </span>

            {/* Label — consistent with CTA mono */}
            <span
              className="
                mono mt-3 text-[11px] md:text-[12px] uppercase tracking-[.18em]
                text-[var(--muted)]
              "
            >
              {item.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}