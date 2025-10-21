"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const sheetId = useId();

  // Lock scroll + close on Esc (only when open)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className="
        sticky z-40
        mx-auto w-full max-w-7xl
        border-x border-b border-[color:var(--hud-grid)]
        bg-[var(--panel)]/80 backdrop-blur-sm
      "
      // sit right under the TopTape (fallback 40px if var not present)
      style={{ top: "var(--tape-h, 40px)" }}
    >
      <div className="flex items-center justify-between px-5 py-3">
        {/* Brand / status */}
        <div className="flex items-center gap-2">
          <span className="relative block h-5 w-5">
            <Image
              src="/logo.svg"
              alt="Statbase"
              fill
              className="object-contain brightness-0 invert"
            />
          </span>
          <span className="font-semibold tracking-tight">Statbase</span>
          <span className="ml-2 rounded-sm border border-[var(--hud-line)] bg-[var(--panel-2)] px-2 py-0.5 mono text-[11px] text-[var(--hud-bright)]">
            BETA IS LIVE
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="mono hidden items-center gap-5 text-[12px] uppercase tracking-widest text-[var(--muted)] md:flex">
          <a href="#app" className="hover:text-[var(--hud-bright)]">App</a>
          <a href="#features" className="hover:text-[var(--hud-bright)]">Features</a>
          <a href="#process" className="hover:text-[var(--hud-bright)]">System</a>
          <a href="#faq" className="hover:text-[var(--hud-bright)]">Resources</a>
          <Link
            href="mailto:daily@buseedo.com?subject=Statbase%20—%20Contact"
            className="rounded-[6px] border border-[var(--hud-accent)] px-3 py-1 text-[var(--hud-accent)] hover:bg-[color-mix(in_srgb,var(--hud-accent)_14%,transparent)]"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => setOpen(true)}
          className="
            md:hidden inline-flex items-center justify-center
            h-9 w-9 rounded-md border border-[color:var(--hud-grid)]
            text-[var(--ink)]/80 hover:text-[var(--hud-bright)]
            bg-[color-mix(in_srgb,var(--panel-2)_60%,transparent)]
          "
        >
          {/* burger */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <>
          {/* Backdrop (starts below TopTape, keeps blur) */}
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed left-0 right-0 bottom-0 z-40 bg-black/45 backdrop-blur-[2px] md:hidden"
            style={{ top: "var(--tape-h, 40px)" }}
          />

          {/* Panel */}
          <div
            id={sheetId}
            role="dialog"
            aria-modal="true"
            className="
              fixed right-0 z-50 h-[calc(100dvh-var(--tape-h,40px))]
              w-[86%] max-w-[360px]
              md:hidden
              border-l border-[color:var(--hud-grid)]
              bg-[var(--panel)]/92 backdrop-blur-md
              shadow-[0_10px_40px_rgba(0,0,0,.5)]
              animate-[slideIn_.18s_ease-out]
            "
            style={{ top: "var(--tape-h, 40px)" }}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--hud-grid)]">
              <span className="mono text-[11px] tracking-[.22em] text-[var(--muted)]">/MENU</span>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--hud-grid)] text-[var(--muted)] hover:text-[var(--hud-bright)]"
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="mono p-4 text-[13px] uppercase tracking-[.18em] text-[var(--ink)]">
              <a
                href="#app"
                onClick={() => setOpen(false)}
                className="block rounded-lg border border-[color:var(--hud-grid)]/60 bg-[color-mix(in_srgb,var(--panel-2)_65%,transparent)] px-4 py-3 mb-3 hover:border-[var(--hud-bright)]/60"
              >
                App
              </a>
              <a
                href="#features"
                onClick={() => setOpen(false)}
                className="block rounded-lg border border-[color:var(--hud-grid)]/60 bg-[color-mix(in_srgb,var(--panel-2)_65%,transparent)] px-4 py-3 mb-3 hover:border-[var(--hud-bright)]/60"
              >
                Features
              </a>
              <a
                href="#process"
                onClick={() => setOpen(false)}
                className="block rounded-lg border border-[color:var(--hud-grid)]/60 bg-[color-mix(in_srgb,var(--panel-2)_65%,transparent)] px-4 py-3 mb-3 hover:border-[var(--hud-bright)]/60"
              >
                System
              </a>
              <a
                href="#faq"
                onClick={() => setOpen(false)}
                className="block rounded-lg border border-[color:var(--hud-grid)]/60 bg-[color-mix(in_srgb,var(--panel-2)_65%,transparent)] px-4 py-3 mb-4 hover:border-[var(--hud-bright)]/60"
              >
                Resources
              </a>

              <Link
                href="mailto:daily@buseedo.com?subject=Statbase%20—%20Contact"
                className="block rounded-lg border border-[var(--hud-accent)] px-4 py-3 text-center text-[var(--hud-accent)] hover:bg-[color-mix(in_srgb,var(--hud-accent)_14%,transparent)]"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>

              {/* status footer */}
              <div className="mt-6 flex items-center justify-between text-[var(--muted)]">
                <span className="text-[11px]">EU OPS / PARIS NODE</span>
                <span className="rounded-sm border border-[var(--hud-line)] bg-[var(--panel-2)] px-2 py-0.5 mono text-[11px] text-[var(--hud-bright)]">
                  SYSTEM ONLINE
                </span>
              </div>
            </nav>
          </div>
        </>
      )}
      {/* tiny keyframe for the slide-in */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(12%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </header>
  );
}