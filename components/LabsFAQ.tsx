"use client";
import { useState } from "react";

type QA = { q: string; a: string };

export default function LabsFAQ({
  items,
  frame = "full", // "full" | "none"
  rounded = "2xl", // allows matching your general design tokens
}: {
  items: QA[];
  frame?: "full" | "none";
  rounded?: "md" | "lg" | "xl" | "2xl" | "3xl" | string;
}) {
  const frameClasses =
    frame === "full"
      ? `border border-[color:var(--hud-grid)] rounded-${rounded}`
      : `border-0 rounded-${rounded}`;

  return (
    <section
      id="faq"
      className={[
        "relative mx-auto w-full max-w-7xl overflow-hidden",
        "bg-[var(--panel)] px-6 py-12 md:px-10",
        frameClasses,
      ].join(" ")}
    >
      {/* Optional subtle separator when frame is off */}
      {frame === "none" && (
        <div className="absolute left-0 right-0 top-0 h-px bg-[color:var(--hud-grid)]/50" />
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,38%)_1fr]">
        {/* Left headline */}
        <div className="lg:sticky lg:top-[72px]">
          <div className="mono mb-4 text-[11px] tracking-[.22em] text-[var(--muted)]">/FAQ</div>
          <h2
            className="
              font-[--font-semibold] leading-[0.92]
              text-[40px] sm:text-[56px] md:text-[72px] lg:text-[84px]
              tracking-[-0.02em] tracking-tight
            "
          >
            Questions
            <br /> you might
            <br /> ask
          </h2>
        </div>

        {/* Right list */}
        <ul className="divide-y divide-[color:var(--hud-grid)]/60">
          {items.map((it, idx) => (
            <FAQRow key={idx} n={idx + 1} {...it} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FAQRow({ n, q, a }: { n: number; q: string; a: string }) {
  const [open, setOpen] = useState(n === 1); // one open by default
  return (
    <li className="py-4 md:py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group grid w-full grid-cols-[64px_1fr_28px] items-start gap-3 text-left"
        aria-expanded={open}
      >
        <span className="mono pt-1 text-[12px] tracking-[.22em] text-[var(--muted)]">
          /{String(n).padStart(2, "0")}
        </span>

        <span className="font-[--font-display] text-[22px] sm:text-[26px] md:text-[28px] tracking-[-0.01em]">
          {q}
        </span>

        <svg
          className={`mt-1 h-5 w-5 transition-transform duration-200 ${
            open ? "rotate-45" : "rotate-0"
          }`}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M12 5v14M5 12h14"
            stroke="var(--hud-bright)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="ml-[64px] mr-7 mt-3 text-[14px] leading-[1.6] text-[var(--muted)]">{a}</p>
        </div>
      </div>
    </li>
  );
}