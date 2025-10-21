"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  baseLines?: string[]; // boot header lines
  stream?: string[];    // rotating activity messages
  maxLines?: number;    // clamp visible lines
  speedMs?: number;     // typing speed per char
  gapMs?: number;       // pause between lines
  className?: string;
};

export default function SystemLogLive({
  baseLines = ["[ SYSTEM LOG ]", "# TELEMETRY ... NOMINAL"],
  stream = [],
  maxLines = 8,
  speedMs = 16,
  gapMs = 340,
  className = "",
}: Props) {
  const [lines, setLines] = useState<string[]>([]);
  const [typing, setTyping] = useState("");
  const [phase, setPhase] = useState<"boot" | "live">("boot");

  // indices kept in refs to avoid re-arms on re-render
  const bootIdx = useRef(0);
  const streamIdx = useRef(0);

  // sanitize once; keep stable to avoid effect storms
  const cleanBase = useMemo(() => baseLines.map(sanitize).filter(Boolean), [baseLines]);
  const pool = useMemo(
    () =>
      (stream.length ? stream : ["# LINK.B2 ... 22ms", "# SWEEP.ACK ... OK", "# BLIP.DETECT ... 2", "# TELEMETRY ... NOMINAL"])
        .map(sanitize)
        .filter(Boolean),
    [stream]
  );

  // stable, cancelable sleepers (don’t use setInterval loops)
  const sleep = (ms: number, cancelled: () => boolean) =>
    new Promise<void>((res) => {
      const id = window.setTimeout(() => !cancelled() && res(), ms);
      // if cancelled flips before timeout, we just let it no-op on resolve gate
    });

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;

    const typeLine = async (s: string) => {
      setTyping("");
      // per-char type-on (lightweight; no intervals)
      for (let i = 0; i < s.length && !isCancelled(); i++) {
        setTyping((prev) => prev + s[i]);
        await sleep(speedMs, isCancelled);
      }
      await sleep(gapMs, isCancelled);
      if (isCancelled()) return;
      setLines((prev) => clamp([...prev, s], maxLines));
      setTyping(""); // finalize typed line
    };

    const boot = async () => {
      while (bootIdx.current < cleanBase.length && !isCancelled()) {
        const l = cleanBase[bootIdx.current++];
        await typeLine(l);
      }
      if (!isCancelled()) setPhase("live");
    };

    const live = async () => {
      // keep looping; cancelled flag + cleanup handles strict mode double-mount
      while (!isCancelled()) {
        const l = pool[streamIdx.current++ % pool.length] ?? "";
        if (!l) continue;
        await typeLine(l);
      }
    };

    // kick once per content change or phase change
    if (phase === "boot") boot();
    else live();

    return () => {
      cancelled = true; // stops any in-flight loops cleanly
    };
  }, [phase, cleanBase, pool, maxLines, speedMs, gapMs]);

  return (
    <div
      className={[
        "rounded-md border bg-[var(--panel-2)]/90",
        "border-[var(--hud-line)]/40 shadow-[inset_0_0_0_1px_rgba(0,0,0,.45)]",
        "p-3 mono text-[12px] leading-[1.35] text-[var(--ink)]",
        className,
      ].join(" ")}
      aria-live="polite"
      role="log"
    >
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      <div>
        {typing}
        {/* solid block caret; keep your existing CSS animation if present */}
        <span
          className="ml-1 inline-block h-[1em] w-[8px] align-baseline bg-[var(--hud-bright)]/85 animate-hud-caret"
          aria-hidden
        />
      </div>
    </div>
  );
}

/* utils */
function sanitize(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, ""); // ASCII only, keeps it readable
}

function clamp<T>(xs: T[], n: number) {
  return xs.length <= n ? xs : xs.slice(xs.length - n);
}