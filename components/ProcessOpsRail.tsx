"use client";
import * as React from "react";

/* ---------- types ---------- */
type Stage = {
  code: string;
  title: string;
  caption?: string;
  eta?: string;
  status?: "idle" | "live" | "done";          // optional seed
  statusOverride?: "idle" | "live" | "done";  // hard override
};

type Props = {
  stages: Stage[];
  title?: string;
  tag?: string;
  hopMs?: number;       // autoplay hop per stage
  auto?: boolean;       // autoplay on/off
  pauseOnHover?: boolean;
};

export default function ProcessOpsRail({
  stages,
  title = "Transparent operations",
  tag = "/ HOW IT WORKS",
  hopMs = 2400,
  auto = true,
  pauseOnHover = true,
}: Props) {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  /* ---------- autoplay ---------- */
  React.useEffect(() => {
    if (!auto || paused) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % stages.length),
      hopMs
    );
    return () => clearInterval(id);
  }, [auto, paused, hopMs, stages.length]);

  const stepPct = stages.length > 1 ? 100 / (stages.length - 1) : 100;
  const pct = active * stepPct;

  const deriveStatus = (idx: number, s: Stage): "idle" | "live" | "done" => {
    const o = s.statusOverride ?? s.status;
    if (o) return o;
    if (idx < active) return "done";
    if (idx === active) return "live";
    return "idle";
  };

  /* ---------- mobile swipe handlers ---------- */
  const startX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    const threshold = 40; // px
    if (dx < -threshold) setActive((i) => Math.min(i + 1, stages.length - 1));
    if (dx > threshold) setActive((i) => Math.max(i - 1, 0));
  };

  return (
    <section
      className="relative mx-auto max-w-7xl border-x border-b border-[color:var(--hud-grid)] bg-[var(--panel)] px-6 pb-16 pt-12 md:px-10"
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="mono mb-3 text-[11px] tracking-[.22em] text-[var(--muted)]">
          {tag}
        </div>
        <h3
          className="
            font-[--font-display]
            text-[34px] sm:text-[48px] md:text-[56px] lg:text-[64px]
            tracking-[-0.015em] leading-[1.05]
            text-[var(--ink)]
            tracking-tight
          "
        >
          {title}
        </h3>
      </div>

      {/* RAIL */}
      <div className="relative">
        <div className="relative h-[42px]">
          {/* base rail */}
          <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-[color:var(--hud-grid)]" />
          {/* progress fill */}
          <div
            className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-[var(--hud-line)] transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
          {/* scanner glow */}
          <div
            className="pointer-events-none absolute top-1/2 h-[18px] w-[120px] -translate-y-1/2 translate-x-[-60px] rounded-full bg-[radial-gradient(closest-side,rgba(126,205,160,.45),transparent_70%)] blur-[8px] transition-[left] duration-500"
            style={{ left: `${pct}%` }}
          />
          {/* nodes ON the line */}
          {stages.map((s, i) => {
            const status = deriveStatus(i, s);
            const isLive = status === "live";
            const isDone = status === "done";
            return (
              <button
                key={s.code + i}
                className="group absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${i * stepPct}%` }}
                onClick={() => setActive(i)}
                aria-label={s.title}
              >
                <span
                  className={[
                    "block h-4 w-4 rounded-full border transition-colors",
                    isLive
                      ? "border-[var(--hud-amber)] bg-[color-mix(in_srgb,var(--hud-amber)_60%,transparent)] shadow-[0_0_0_3px_rgba(255,194,102,.12)]"
                      : isDone
                      ? "border-[var(--hud-bright)] bg-[color-mix(in_srgb,var(--hud-bright)_36%,transparent)]"
                      : "border-[var(--hud-grid)] bg-[var(--panel-2)]",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* MOBILE SLIDER */}
      <div
        className="mt-6 overflow-hidden md:hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* track */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {stages.map((s, i) => {
            const status = deriveStatus(i, s);
            return (
              <div key={"m-" + s.code} className="w-full shrink-0 pr-2">
                <StageCard s={s} status={status} />
              </div>
            );
          })}
        </div>

        {/* mobile controls */}
        <div className="mt-4 flex items-center justify-between">
          <button
            className="mono rounded-md border border-[color:var(--hud-grid)] px-3 py-1 text-[12px] tracking-[.18em] text-[var(--muted)] disabled:opacity-40"
            onClick={() => setActive((i) => Math.max(0, i - 1))}
            disabled={active === 0}
          >
            ◀ PREV
          </button>
          <div className="mono text-[12px] tracking-[.22em] text-[var(--muted)]">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(stages.length).padStart(2, "0")}
          </div>
          <button
            className="mono rounded-md border border-[color:var(--hud-grid)] px-3 py-1 text-[12px] tracking-[.18em] text-[var(--muted)] disabled:opacity-40"
            onClick={() =>
              setActive((i) => Math.min(stages.length - 1, i + 1))
            }
            disabled={active === stages.length - 1}
          >
            NEXT ▶
          </button>
        </div>
      </div>

      {/* DESKTOP GRID */}
      <div className="mt-8 hidden gap-10 md:grid lg:grid-cols-5 md:grid-cols-2">
        {stages.map((s, i) => {
          const status = deriveStatus(i, s);
          return <StageCard key={s.code} s={s} status={status} />;
        })}
      </div>
    </section>
  );
}

/* ---------- presentational bits ---------- */

function StageCard({
  s,
  status,
}: {
  s: { code: string; title: string; caption?: string; eta?: string };
  status: "idle" | "live" | "done";
}) {
  const isLive = status === "live";
  const isDone = status === "done";

  return (
    <article className="space-y-4">
      <div className="mono flex items-center gap-3 text-[12px] tracking-[.22em] text-[var(--muted)]">
        <span>/{s.code}</span>
      </div>
      <h4
        className={[
          "text-2xl font-semibold",
          isLive ? "text-[var(--ink)]" : "text-[color-mix(in_srgb,var(--ink)_86%,transparent)]",
        ].join(" ")}
      >
        {s.title}
      </h4>
      {s.caption && (
        <p className="max-w-xs text-[15px] leading-relaxed text-[var(--muted)]">
          {s.caption}
        </p>
      )}
      <div className="flex flex-wrap gap-3 pt-1">
        {s.eta && <Badge label="ETA" value={s.eta} tone="neutral" />}
        <Badge
          label="STATUS"
          value={status.toUpperCase()}
          tone={isLive ? "amber" : isDone ? "green" : "neutral"}
          blink={isLive}
        />
      </div>
    </article>
  );
}

function Badge({
  label,
  value,
  tone = "neutral",
  blink = false,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "green" | "amber";
  blink?: boolean;
}) {
  const toneCls =
    tone === "green"
      ? "border-[var(--hud-bright)] text-[var(--hud-bright)]"
      : tone === "amber"
      ? "border-[var(--hud-amber)] text-[var(--hud-amber)]"
      : "border-[color:var(--hud-grid)] text-[var(--muted)]";

  return (
    <span
      className={[
        "mono inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] tracking-[.18em]",
        "bg-[color-mix(in_srgb,var(--panel-2)_72%,transparent)]",
        toneCls,
      ].join(" ")}
    >
      <span>{label}</span>
      <span className="font-bold">{value}</span>
      {blink && (
        <span className="relative ml-1 inline-block h-[6px] w-[6px] rounded-full bg-[var(--hud-amber)]">
          <span className="absolute inset-0 rounded-full bg-[var(--hud-amber)] opacity-60 animate-[ping_1.8s_ease_infinite]" />
        </span>
      )}
    </span>
  );
}