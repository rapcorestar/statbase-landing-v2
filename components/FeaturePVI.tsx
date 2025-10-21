"use client";
import React from "react";

type Mini = { title: string; body: string; tag?: string };

export default function FeaturePVI({
  pvi,
  items,
  kicker = "/FEATURES",
  heading = ["Player Value", "Index (PVI)"],
}: {
  // the centerpiece sentence (exact text you provided)
  pvi: string;
  // supporting modules (short + sharp)
  items: Mini[];
  kicker?: string;
  heading?: [string, string] | [string, string, string];
}) {
  return (
    <section
      id="features"
      className="
        relative mx-auto w-full max-w-7xl
        border-x border-b border-[color:var(--hud-grid)]
        bg-[var(--panel)] px-6 py-12 md:px-10 tracking-tight
      "
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,42%)_1fr]">
        {/* LEFT: sticky headline + centerpiece explainer */}
        <aside className="lg:sticky lg:top-[72px]">
          <div className="mono mb-4 text-[11px] tracking-[.22em] text-[var(--muted)]">
            {kicker}
          </div>

          <h2
            className="
              font-[--font-semibold]
              text-[34px] sm:text-[48px] md:text-[56px] lg:text-[64px]
              tracking-[-0.015em] leading-[1.05]
              text-[var(--ink)]
              mb-6 tracking-tight
            "
          >
            {heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* centerpiece explainer */}
          <div className="mt-6 rounded-2xl border border-[color:var(--hud-grid)] bg-[color-mix(in_srgb,var(--panel-2)_78%,transparent)] p-5 md:p-6">
            <span
              className="
                mono mb-2 inline-flex items-center rounded-md
                border border-[0.7px] border-[var(--hud-accent)]
                px-2 py-[2px] text-[10px] tracking-[.22em]
                text-[var(--hud-accent)]
              "
            >
              PVI - EXPLAINED
            </span>
            <p className="text-[15px] leading-[1.7] text-[var(--ink)]/90">
              <em className="not-italic text-[var(--ink)]">
                Inspired by proven sabermetric logic such as wOBA and FIP
              </em>
              , our index blends{" "}
              <strong className="font-semibold text-[var(--hud-bright)]">
                offensive efficiency
              </strong>
              ,{" "}
              <strong className="font-semibold text-[var(--hud-bright)]">
                power impact
              </strong>
              , and{" "}
              <strong className="font-semibold text-[var(--hud-bright)]">
                pitching command
              </strong>{" "}
              - adjusted for each league’s context.
            </p>

            {/* micro factors – cockpit-style chips */}
            {/* <div className="mt-4 flex flex-wrap gap-2">
              {["Efficiency model", "Power weighting", "Command scoring", "League/role adjust"].map(
                (k) => (
                  <span
                    key={k}
                    className="mono rounded-md border border-[var(--hud-line)]/35 px-2 py-[4px] text-[10px] tracking-[.22em] text-[var(--muted)]"
                  >
                    {k}
                  </span>
                )
              )}
            </div> */}
          </div>

          {/* faint wiring line for the research vibe */}
          <div className="mt-6 h-px w-full bg-[color:var(--hud-grid)]/60" />
          <div className="mono mt-2 text-[11px] tracking-[.22em] text-[var(--muted)]">
            <span>{`[PATENT PENDING / PROPRIETARY DEVELOPMENT]`}</span>
          </div>
        </aside>

        {/* RIGHT: brief, non-card list (FAQ-adjacent, not a copy) */}
        <div>
          <ul className="divide-y divide-[color:var(--hud-grid)]/60">
            {items.map((m, i) => (
              <li key={i} className="py-5">
                <div className="grid grid-cols-[64px_1fr_auto] items-start gap-3">
                  <span className="mono pt-1 text-[12px] tracking-[.22em] text-[var(--muted)]">
                    /{String(i + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="font-[--font-display] text-[22px] sm:text-[24px] tracking-[-0.01em]">
                      {m.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-[14px] leading-[1.65] text-[var(--muted)]">
                      {m.body}
                    </p>
                  </div>

                  {m.tag ? (
                    <span className="mono mt-[2px] inline-flex items-center rounded-md border border-[var(--hud-line)]/40 px-2 py-[2px] text-[10px] tracking-[.22em] text-[var(--muted)]">
                      {m.tag}
                    </span>
                  ) : (
                    <span />
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* subtle end rule */}
          <div className="mt-6 h-px w-full bg-[color:var(--hud-grid)]/40" />
        </div>
      </div>
    </section>
  );
}