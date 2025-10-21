"use client";

import React, { useEffect, useMemo, useState } from "react";

/** HUDPlaybook — logless, stable, SSR-safe
 *  - Rounded SVG numbers to avoid hydration jitter
 *  - Calm animation + auto-advance
 *  - Play Card auto-sizes to content, top-row titles never overlap
 *  - Catcher cone follows ball; spray wedge hidden while ball is active
 *  - PVI capsule (top-left), Telemetry strip, WE (Win Expectancy) gauge ring
 */

type Pt = [number, number];
type Segment = [Pt, Pt];

type Play = {
  id: string;
  label: string;
  spray?: { a0: number; a1: number; r: number };
  runner: Pt[];
  ball?: Segment[];
  blips?: Pt[];
  card: { count: string; outs: number; ev: string; la: string; xba: string };
  notes?: string[];
};

export type HUDPlaybookProps = {
  showPlayCard?: boolean;
  clampToSafeArea?: boolean;
};

/* ---------- math / geometry helpers ---------- */

const fx = (n: number, d = 3) => (Number.isFinite(n) ? Number(n.toFixed(d)) : 0);

const C: Pt = [400, 400];
const BASE_R = 180;
const RINGS = [310, 220, 120] as const;

const polar = (c: Pt, r: number, deg: number): Pt => {
  const rad = (deg * Math.PI) / 180;
  return [c[0] + r * Math.cos(rad), c[1] + r * Math.sin(rad)];
};
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

const HOME: Pt = [C[0], C[1] + BASE_R];
const FIRST: Pt = [C[0] + BASE_R, C[1]];
const SECOND: Pt = [C[0], C[1] - BASE_R];
const THIRD: Pt = [C[0] - BASE_R, C[1]];
const MOUND: Pt = [C[0], C[1] + BASE_R * 0.12];

const OF = (deg: number, r = BASE_R * 2.3): Pt => polar(C, r, deg);

const angleDeg = (a: Pt, b: Pt) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;

const wedgeFromHome = (a0: number, a1: number, r: number) => {
  const p0 = polar(HOME, r, a0);
  const p1 = polar(HOME, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${HOME[0]} ${HOME[1]} L ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${large} 1 ${p1[0]} ${p1[1]} Z`;
};

/* ---------- tiny UI helpers ---------- */

const pviColor = (s: number) => (s < 40 ? "hsl(5 80% 60%)" : s < 70 ? "hsl(36 85% 60%)" : "hsl(148 60% 55%)");
const pill = (x: number, y: number, w: number, h: number, r = 10) =>
  `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r}
   A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r}
   V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;

const sparkPath = (xs: number[], w = 84, h = 22) => {
  if (!xs.length) return "";
  const step = w / Math.max(1, xs.length - 1);
  let d = `M 0 ${h * (1 - xs[0])}`;
  for (let i = 1; i < xs.length; i++) d += ` L ${i * step} ${h * (1 - xs[i])}`;
  return d;
};

/* ---------- curated plays ---------- */

const PLAYS: Play[] = [
  { id:"lf-single-1st-to-3rd", label:"Single LF → 1st to 3rd",
    spray:{a0:208,a1:228,r:BASE_R*2.05},
    runner:[FIRST, lerp(FIRST,SECOND,0.08), SECOND, THIRD],
    ball:[[OF(220), SECOND]], blips:[FIRST,SECOND,THIRD],
    card:{count:"0–0", outs:0, ev:"89 mph", la:"14°", xba:".610"} },
  { id:"rf-single-hold-1b", label:"Single RF → hold at 1B",
    spray:{a0:320,a1:338,r:BASE_R*2.0},
    runner:[FIRST], ball:[[OF(330), FIRST]], blips:[FIRST],
    card:{count:"1–0", outs:0, ev:"92 mph", la:"11°", xba:".520"} },
  { id:"deep-cf-fly-tag", label:"Flyout deep CF (tag attempt)",
    spray:{a0:260,a1:275,r:BASE_R*2.3},
    runner:[THIRD, lerp(THIRD,HOME,0.25), THIRD],
    ball:[[OF(268,BASE_R*2.35), HOME]], blips:[THIRD,HOME],
    card:{count:"1–1", outs:1, ev:"96 mph", la:"28°", xba:".090"} },
  { id:"rf-assist-3b", label:"RF assist to 3B",
    spray:{a0:318,a1:336,r:BASE_R*2.2},
    runner:[FIRST, lerp(FIRST,SECOND,0.25), FIRST],
    ball:[[OF(330), THIRD]], blips:[THIRD],
    card:{count:"0–2", outs:1, ev:"97 mph", la:"18°", xba:".210"} },
  { id:"relay-cutoff-home", label:"Relay → cutoff → home",
    spray:{a0:300,a1:318,r:BASE_R*2.1},
    runner:[SECOND, lerp(SECOND,THIRD,0.45), THIRD, lerp(THIRD,HOME,0.25)],
    ball:[[OF(308), SECOND],[SECOND, HOME]], blips:[SECOND,HOME],
    card:{count:"2–1", outs:1, ev:"101 mph", la:"12°", xba:".540"} },
  { id:"squeeze", label:"Suicide squeeze",
    spray:{a0:350,a1:370,r:BASE_R*1.2},
    runner:[THIRD, lerp(THIRD,HOME,0.35), HOME],
    ball:[[MOUND, HOME]], blips:[HOME],
    card:{count:"0–0", outs:0, ev:"31 mph", la:"6°", xba:".420"} },
  { id:"gap-double-2b", label:"Gap double to LCF",
    spray:{a0:230,a1:248,r:BASE_R*2.2},
    runner:[FIRST, SECOND],
    ball:[[OF(242,BASE_R*2.35), SECOND]], blips:[SECOND],
    card:{count:"2–2", outs:0, ev:"101 mph", la:"22°", xba:".680"} },
  { id:"grounder-63", label:"6–3 routine",
    spray:{a0:184,a1:198,r:BASE_R*1.12},
    runner:[HOME], ball:[[polar(C,BASE_R*1.1,190), FIRST]], blips:[FIRST],
    card:{count:"0–1", outs:1, ev:"81 mph", la:"-8°", xba:".070"} },
  { id:"sac-fly-rf", label:"Sac fly RF — run scores",
    spray:{a0:322,a1:340,r:BASE_R*2.05},
    runner:[THIRD, lerp(THIRD,HOME,0.55), HOME],
    ball:[[OF(332), HOME]], blips:[HOME],
    card:{count:"0–1", outs:1, ev:"88 mph", la:"32°", xba:".650"} },
  { id:"rf-line-double", label:"RF line double — runner to 3B",
    spray:{a0:342,a1:352,r:BASE_R*2.35},
    runner:[FIRST, SECOND, THIRD],
    ball:[[OF(348,BASE_R*2.4), SECOND]], blips:[SECOND,THIRD],
    card:{count:"1–1", outs:0, ev:"103 mph", la:"17°", xba:".720"} },
];

/* ---------- component ---------- */

export default function HUDPlaybook({
  showPlayCard = true,
  clampToSafeArea = true,
}: HUDPlaybookProps) {
  const [idx, setIdx] = useState(0);
  const play = PLAYS[idx % PLAYS.length];

  useEffect(() => { console.log("[HUD] mounted"); }, []);

  // animation clock 0..1 (CSR only)
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const PERIOD = 2600;
    const loop = (now: number) => {
      setT(((now - start) % PERIOD) / PERIOD);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [idx]);

  // calm auto-advance
  useEffect(() => {
    const hop = setTimeout(() => setIdx((k) => (k + 1) % PLAYS.length), 3200);
    return () => clearTimeout(hop);
  }, [idx]);

  /* ---------- runner position along polyline by arc-length ---------- */
  const runnerPos = useMemo<Pt | null>(() => {
    const path = play.runner;
    if (!path || path.length < 2) return null;
    const lens: number[] = [];
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const d = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]);
      lens.push(d); total += d;
    }
    if (total <= 0) return path[path.length - 1];
    let L = t * total;
    for (let i = 0; i < lens.length; i++) {
      const d = lens[i];
      if (L <= d || i === lens.length - 1) {
        const w = Math.max(0, Math.min(1, L / Math.max(1, d)));
        return lerp(path[i], path[i + 1], w);
      }
      L -= d;
    }
    return path[path.length - 1];
  }, [t, play.runner]);

  /* ---------- live ball position + catcher cone (robust) ---------- */
  const ballNow: Pt | null = useMemo(() => {
    const segs = (play.ball ?? []).filter(
      (s): s is Segment => Array.isArray(s) && Array.isArray(s[0]) && Array.isArray(s[1])
    );
    const n = segs.length;
    if (!n) return null;

    const u = Math.min(Math.max(t, 0), 0.999999);
    const slot = 1 / n;
    const k = Math.min(n - 1, Math.max(0, Math.floor(u / slot)));
    const localT = (u - k * slot) / slot;

    const seg = segs[k];
    if (!seg) return null;
    const [a, b] = seg;
    return lerp(a, b, Math.max(0, Math.min(1, localT)));
  }, [t, play.ball]);

  const cone = useMemo(() => {
    if (!ballNow) return null;
    const center = angleDeg(HOME, ballNow);
    const half = 9; // degrees half width
    return { a0: center - half, a1: center + half, r: BASE_R * 2.6 };
  }, [ballNow]);

  /* ---------- PVI (headline) ---------- */
  const PVI = useMemo(() => ({
    score: 82, delta: +6, pct: 92, spark: [0.46, 0.53, 0.52, 0.61, 0.58, 0.67, 0.72, 0.78, 0.82],
  }), []);

  /* ---------- WE (Win Expectancy) from current play ---------- */
  const WE = useMemo(() => {
    // very lightweight heuristic: combine xBA (as prob of hit) with EV & LA bonuses
    const xba = Number(play.card.xba.replace(/[^0-9.]/g, "")) || 0;  // 0..1-ish
    const ev = Number(play.card.ev.replace(/[^0-9.]/g, "")) || 0;     // mph
    const la = Number(play.card.la.replace(/[^-0-9.]/g, "")) || 0;    // deg

    const evBonus = Math.min(Math.max((ev - 80) / 35, 0), 1);         // 80..115mph → 0..1
    const barrel = Math.exp(-Math.pow((la - 15) / 12, 2));            // bell curve around 15°
    const base = Math.min(1, xba + 0.25 * evBonus + 0.25 * barrel);

    // oscillate slightly with t so the arc breathes
    const breathe = 0.02 * Math.sin(t * 2 * Math.PI);
    const p = Math.min(1, Math.max(0, base + breathe));

    return { p, percent: Math.round(p * 100), color: pviColor(Math.round(p * 100)) };
  }, [play.card, t]);

  /* ---------- Play Card auto-size (no overlap on the top row) ---------- */
  const YEAR = new Date().getFullYear();
  const inset = clampToSafeArea ? 18 : 8;

  const cardDims = useMemo(() => {
    const padX = 12, padY = 12;
    const leftTitle = "PLAY CARD";
    const rightTitle = `SERIE-A / ${YEAR}`;

    const ch12 = 7.2, ch13 = 7.8;

    const leftW = Math.ceil(leftTitle.length * ch12);
    const rightW = Math.ceil(rightTitle.length * ch12);
    const titleGap = 16;

    const rows = [
      ["Count", play.card.count],
      ["Outs", String(play.card.outs)],
      ["EV", play.card.ev],
      ["LA", play.card.la],
      ["xBA", play.card.xba],
      ["PVI", `${PVI.score} (${PVI.pct}th)`],
    ] as const;

    const labelW = Math.ceil(play.label.length * ch13);
    const colGap = 110;
    const maxVal = Math.max(...rows.map(([, v]) => String(v).length));
    const rowsW = Math.ceil(colGap + maxVal * ch12);

    const topRowNeed = leftW + titleGap + rightW;
    const innerW = Math.max(topRowNeed, labelW, rowsW);
    const w = padX * 2 + innerW;
    const h = padY * 2 + 20 + 8 + 18 + rows.length * 18;

    return { x: 800 - (inset + 18) - w, y: inset + 20, w, h, padX, padY, colGap, titleGap, leftTitle, rightTitle, rows };
  }, [play.label, play.card, inset, YEAR, PVI]);

  const segP = (segIdx: number, clock: number, count: number) => {
    if (!count) return 0;
    const slot = 1 / count;
    const start = segIdx * slot;
    return Math.max(0, Math.min(1, (clock - start) / slot));
  };

  return (
    <svg
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid meet"        // not 'slice'
      className="absolute inset-0 h-full w-full z-10"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >

      {/* side rails */}
      <g className="mono" fontSize="10" fill="var(--hud-bright)" opacity=".55">
        <text x="0" y="408" transform="rotate(-90 16 408)">SIGNAL RANGE · 1.000 MHz — 801.808 MHz</text>
        <text x="1024" y="408" textAnchor="end" transform="rotate(90 784 408)">SIGNAL RANGE · 1.000 MHz — 801.808 MHz</text>
      </g>

      {/* PVI capsule (top-left) */}
      {/* {(() => {
        const x = 24, y = 22, w = 260, h = 56, pad = 12;
        const col = pviColor(PVI.score);
        const sparkW = 84, sparkH = 22;
        return (
          <g transform={`translate(${x},${y})`}>
            <path d={pill(0,0,w,h,10)}
              fill="color-mix(in srgb, var(--panel-2) 92%, transparent)"
              stroke="color-mix(in srgb, var(--hud-line) 85%, transparent)"/>
            <text x={pad} y={18}
              fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
              fontSize="11" fill="var(--muted)" opacity=".9"
              style={{fontKerning:"none",fontVariantLigatures:"none"}}>
              PVI INDEX
            </text>
            <text x={pad} y={36}
              fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
              fontSize="18" fill={col}
              style={{fontKerning:"none",fontVariantLigatures:"none"}}>
              {PVI.score}
            </text>
            <text x={w - pad} y={20} textAnchor="end"
              fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
              fontSize="11" fill="var(--ink)" opacity=".85">
              Δ vs Lg {PVI.delta >= 0 ? "+" : ""}{PVI.delta}
            </text>
            <text x={w - pad} y={36} textAnchor="end"
              fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
              fontSize="12" fill="var(--ink)" opacity=".9">
              {PVI.pct}ᵗʰ percentile
            </text>
            <g transform={`translate(${w - pad - sparkW},${h - pad - sparkH})`} opacity=".9">
              <rect width={sparkW} height={sparkH} rx="4" ry="4"
                fill="color-mix(in srgb, var(--panel-2) 85%, transparent)" stroke="var(--hud-line)"/>
              <path d={sparkPath(PVI.spark, sparkW-8, sparkH-8)} transform="translate(4,4)"
                fill="none" stroke={col} strokeWidth="1.5"/>
            </g>
          </g>
        );
      })()} */}

      {/* Telemetry strip (under PVI) — ingest/tracking/model + live link/fps */}
      {(() => {
        const x = 24, y = 40, w = 310, h = 32, pad = 10;
        const led = (on: boolean) => (on ? "var(--hud-bright)" : "var(--hud-line)");
        const on1 = (t % 1) < 0.7;                         // Ingest
        const on2 = ((t + 0.33) % 1) < 0.7;                // Tracking
        const on3 = ((t + 0.66) % 1) < 0.7;                // Model
        const link = 18 + Math.round(10 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2))); // 18..28 ms
        const fps  = 58 + Math.round(4 * (0.5 + 0.5 * Math.cos(t * Math.PI * 2)));
        return (
          <g transform={`translate(${x},${y})`} opacity=".95">
            <path d={pill(0,0,w,h,8)}
              fill="color-mix(in srgb, var(--panel-2) 92%, transparent)"
              stroke="color-mix(in srgb, var(--hud-line) 85%, transparent)"/>
            {[
              ["INGEST", on1, 0],
              ["TRACK",  on2, 84],
              ["MODEL",  on3, 168],
            ].map(([label, on, dx], i)=>(
              <g key={i} transform={`translate(${Number(dx)},0)`}>
                <circle cx={pad} cy={h/2} r="4" fill={on ? led(true) : led(false)} opacity={on ? 0.95 : 0.55}/>
                <text x={pad+10} y={h/2+4}
                  fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
                  fontSize="11" fill="var(--ink)" opacity=".8">{label as string}</text>
              </g>
            ))}
            <text x={w - pad} y={h/2 - 2} textAnchor="end"
              fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
              fontSize="11" fill="var(--muted)">Link {link}ms</text>
            <text x={w - pad} y={h/2 + 10} textAnchor="end"
              fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
              fontSize="11" fill="var(--muted)">{fps} fps</text>
          </g>
        );
      })()}

      {/* rings */}
      <g stroke="var(--hud-line)" strokeWidth="1.2" fill="none" opacity=".55">
        <circle cx={fx(C[0])} cy={fx(C[1])} r={fx(RINGS[0])} />
        <circle cx={fx(C[0])} cy={fx(C[1])} r={fx(RINGS[1])} strokeDasharray="6 8" />
        <circle cx={fx(C[0])} cy={fx(C[1])} r={fx(RINGS[2])} />
      </g>

      {/* WE G A U G E — arc around outer ring */}
      {(() => {
        const R = RINGS[0] + 14;
        const start = -90; // top
        const sweep = 360 * WE.p;
        const a0 = (start * Math.PI) / 180;
        const a1 = ((start + sweep) * Math.PI) / 180;
        const p0: Pt = [C[0] + R * Math.cos(a0), C[1] + R * Math.sin(a0)];
        const p1: Pt = [C[0] + R * Math.cos(a1), C[1] + R * Math.sin(a1)];
        const large = sweep > 180 ? 1 : 0;
        const d = `M ${fx(p0[0])} ${fx(p0[1])} A ${fx(R)} ${fx(R)} 0 ${large} 1 ${fx(p1[0])} ${fx(p1[1])}`;
        return (
          <g opacity=".9">
            <circle cx={fx(C[0])} cy={fx(C[1])} r={fx(R)} stroke="var(--hud-line)" strokeOpacity=".25" fill="none"/>
            <path d={d} stroke={WE.color} strokeWidth="4" fill="none"/>
            <text x={fx(C[0])} y={fx(C[1]-R-8)} textAnchor="middle"
              fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
              fontSize="11" fill="var(--ink)" opacity=".8">WE {WE.percent}%</text>
          </g>
        );
      })()}

      {/* optional quadrantal ticks */}
      {/* {[25,50,75,95].map((v,i)=>{
        const a = -90 + (v/100)*360;
        const p = polar(C, RINGS[0], a);
        const q = polar(C, RINGS[0]+10, a);
        return (
          <g key={i} opacity=".45">
            <line x1={fx(p[0])} y1={fx(p[1])} x2={fx(q[0])} y2={fx(q[1])} stroke="var(--hud-line)"/>
            <text x={fx(q[0])} y={fx(q[1])}
              fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
              fontSize="10" fill="var(--muted)" textAnchor="middle" dy="10">
              {v}
            </text>
          </g>
        );
      })} */}

      {/* diamond */}
      <g stroke="var(--hud-line)" strokeWidth="2" fill="none" opacity=".75">
        <polygon points={`${fx(SECOND[0])},${fx(SECOND[1])} ${fx(THIRD[0])},${fx(THIRD[1])} ${fx(HOME[0])},${fx(HOME[1])} ${fx(FIRST[0])},${fx(FIRST[1])}`} />
        {[FIRST, SECOND, THIRD, HOME].map((p, i) => (
          <rect key={i} x={fx(p[0] - 5)} y={fx(p[1] - 5)} width={fx(10)} height={fx(10)} rx={fx(2)} ry={fx(2)} fill="none" stroke="var(--hud-line)" opacity=".5" />
        ))}
        <circle cx={fx(MOUND[0])} cy={fx(MOUND[1])} r={fx(6.5)} stroke="var(--hud-line)" fill="none" opacity=".5" />
      </g>

      {/* show spray only when no active ball path (prevents “double cone”) */}
      {play.spray && !(play.ball && play.ball.length) && (
        <path d={wedgeFromHome(play.spray.a0, play.spray.a1, play.spray.r)} fill="var(--hud-line)" opacity=".18" />
      )}

      {/* catcher cone — follows the ball */}
      {cone && (
        <path d={wedgeFromHome(cone.a0, cone.a1, cone.r)} fill="var(--hud-bright)" opacity=".12" />
      )}

      {/* runner guide */}
      <polyline
        points={play.runner.map((p) => `${fx(p[0])},${fx(p[1])}`).join(" ")}
        fill="none" stroke="var(--hud-dashed)" strokeWidth={1.2} strokeDasharray="4 8" opacity=".55"
      />

      {/* runner + PVI aura */}
      {runnerPos && (
        <g transform={`translate(${fx(runnerPos[0])} ${fx(runnerPos[1])})`}>
          <circle r={fx(10)} fill="none" stroke={pviColor(PVI.score)} strokeOpacity=".75" strokeWidth={1.7}/>
          <circle r={fx(7)} fill="var(--hud-bright)" opacity=".22" />
          <circle r={fx(3.5)} fill="var(--hud-bright)" />
        </g>
      )}

      {/* throws (progressively revealed) */}
      {play.ball?.map(([a, b], i) => {
        const p = segP(i, t, play.ball!.length);
        const mid: Pt = [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];
        return (
          <g key={i}>
            <line x1={fx(a[0])} y1={fx(a[1])} x2={fx(mid[0])} y2={fx(mid[1])} stroke="var(--hud-bright)" strokeWidth={2} opacity=".9" />
            {p >= 0.99 && <circle cx={fx(b[0])} cy={fx(b[1])} r={fx(5.5)} fill="var(--hud-bright)"/>}
          </g>
        );
      })}

      {/* blips */}
      {play.blips?.map((p, i) => (
        <circle key={i} cx={fx(p[0])} cy={fx(p[1])} r={fx(5.5)} fill="var(--hud-bright)" opacity=".55" />
      ))}

      {/* PLAY CARD — autosized and collision-free */}
      {showPlayCard && (
        <g transform={`translate(${fx(cardDims.x)},${fx(cardDims.y)})`}>
          <rect
            width={fx(cardDims.w)}
            height={fx(cardDims.h)}
            rx={fx(10)}
            ry={fx(10)}
            fill="color-mix(in srgb, var(--panel-2) 92%, transparent)"
            stroke="color-mix(in srgb, var(--hud-line) 85%, transparent)"
          />

          <text x={cardDims.padX} y={20}
            fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
            fontSize={12} fill="var(--ink)" opacity=".7">
            {cardDims.leftTitle}
          </text>
          <text x={fx(cardDims.w - cardDims.padX)} y={20} textAnchor="end"
            fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
            fontSize={12} fill="var(--ink)" opacity=".7">
            {cardDims.rightTitle}
          </text>

          <text x={cardDims.padX} y={42}
            fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
            fontSize={13} fill="var(--ink)" style={{ fontWeight:600 }}>
            {play.label}
          </text>

          {cardDims.rows.map(([k,v], i) => (
            <g key={k as string} transform={`translate(${cardDims.padX},${64 + i*18})`}>
              <text
                fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
                fontSize={12} fill="var(--ink)" opacity=".7">{k}</text>
              <text x={cardDims.colGap}
                fontFamily='ui-monospace,SFMono-Regular,Menlo,Monaco,"Courier New",monospace'
                fontSize={12} fill="var(--ink)">{v as string}</text>
            </g>
          ))}
        </g>
      )}

      {/* footer */}
      <g className="mono" fontSize="11" fill="var(--muted)">
        <text x="40" y="758">© {YEAR} STATBASE.EU / ACTIVE NODE: PARIS</text>
        <text x="760" y="758" textAnchor="end">OPERATIONAL UNIT: SB-25V04</text>
      </g>
    </svg>
  );
}