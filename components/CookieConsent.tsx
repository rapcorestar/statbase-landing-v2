"use client";
import { useEffect, useState } from "react";

/**
 * CookieConsent (compact + granular)
 * - Slim bottom bar by default
 * - "Customize" reveals a small panel with categories
 * - Essential (locked), Analytics, Functional, Marketing
 * - Stores in localStorage: `statbase-consent`
 * - Reopen anywhere by dispatching: window.dispatchEvent(new Event("open-cookie-consent"))
 */

type Prefs = {
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "statbase-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({
    analytics: false,
    functional: false,
    marketing: false,
  });

  // Show only if no prior choice
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {}
  }, []);

  // Allow reopening from anywhere
  useEffect(() => {
    const open = () => {
      // Load previously saved prefs if any
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setPrefs(JSON.parse(saved));
      } catch {}
      setCustomize(false);
      setVisible(true);
    };
    window.addEventListener("open-cookie-consent", open);
    return () => window.removeEventListener("open-cookie-consent", open);
  }, []);

  const set = (p: Partial<Prefs>) => setPrefs((prev) => ({ ...prev, ...p }));

  const persistAndClose = (p: Prefs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
    setVisible(false);
    setCustomize(false);
    // hook your trackers here based on `p`
  };

  const onAcceptAll = () =>
    persistAndClose({ analytics: true, functional: true, marketing: true });

  const onRejectAll = () =>
    persistAndClose({ analytics: false, functional: false, marketing: false });

  const onSave = () => persistAndClose(prefs);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="
        fixed inset-x-0 bottom-0 z-[9999]
        border-t border-[color:var(--hud-grid)]
        bg-[color-mix(in_srgb,var(--panel)_92%,black)]
        backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm
        text-[var(--ink)]
      "
    >
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        {/* COMPACT BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] leading-relaxed text-[var(--muted)]">
            We use cookies to run Statbase (essential), improve performance, and measure usage. Choose what’s ok.
            <a href="/privacy" className="ml-2 text-[var(--hud-bright)] underline-offset-2 hover:underline">
              Privacy
            </a>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onRejectAll}
              className="mono rounded-[6px] border border-[var(--hud-grid)] px-3 py-1.5 text-[11px] uppercase tracking-[.18em] hover:border-[var(--hud-line)]"
            >
              Reject all
            </button>
            <button
              onClick={() => setCustomize((v) => !v)}
              className="mono rounded-[6px] border border-[var(--hud-grid)] px-3 py-1.5 text-[11px] uppercase tracking-[.18em] hover:border-[var(--hud-line)]"
              aria-expanded={customize}
              aria-controls="cookie-customize"
            >
              Customize
            </button>
            <button
              onClick={onAcceptAll}
              className="btn-wire mono text-[11px] uppercase tracking-[.18em] px-3 py-1.5"
            >
              Accept all
            </button>
          </div>
        </div>

        {/* CUSTOMIZE — SMALL PANEL */}
        <div
          id="cookie-customize"
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            customize ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className="
                mt-3 rounded-xl border border-[color:var(--hud-grid)]
                bg-[color-mix(in_srgb,var(--panel-2)_84%,transparent)] p-4
              "
            >
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Essential (locked) */}
                <ConsentRow
                  title="Essential"
                  desc="Required for security and basic functionality."
                  locked
                  checked
                />
                <ConsentRow
                  title="Analytics"
                  desc="Helps us understand usage and improve performance."
                  checked={prefs.analytics}
                  onChange={(v) => set({ analytics: v })}
                />
                <ConsentRow
                  title="Functional"
                  desc="Extra UX like saved filters and preferences."
                  checked={prefs.functional}
                  onChange={(v) => set({ functional: v })}
                />
                <ConsentRow
                  title="Marketing"
                  desc="Campaign measurement and partner insights."
                  checked={prefs.marketing}
                  onChange={(v) => set({ marketing: v })}
                />
              </ul>

              {/* actions */}
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => setCustomize(false)}
                  className="mono rounded-[6px] border border-[var(--hud-grid)] px-3 py-1.5 text-[11px] uppercase tracking-[.18em] hover:border-[var(--hud-line)]"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  className="mono rounded-[6px] border border-[var(--hud-line)] px-3 py-1.5 text-[11px] uppercase tracking-[.18em] text-[var(--hud-bright)] hover:bg-[color-mix(in_srgb,var(--hud-bright)_10%,transparent)]"
                >
                  Save choices
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ——— Small row ——— */
function ConsentRow({
  title,
  desc,
  checked = false,
  locked = false,
  onChange,
}: {
  title: string;
  desc: string;
  checked?: boolean;
  locked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <li
      className={[
        "flex items-start justify-between gap-3 rounded-lg border p-3",
        locked
          ? "border-[var(--hud-grid)]/70 bg-[color-mix(in_srgb,var(--panel-2)_85%,transparent)] opacity-90"
          : checked
          ? "border-[var(--hud-line)] bg-[color-mix(in_srgb,var(--panel-2)_82%,transparent)]"
          : "border-[var(--hud-grid)] bg-[var(--panel)] hover:border-[var(--hud-line)]/50",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-[--font-display] text-[15px] text-[var(--ink)]">{title}</span>
          {locked && (
            <span className="mono text-[10px] uppercase tracking-[.18em] text-[var(--hud-grid)]">always on</span>
          )}
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--muted)]">{desc}</p>
      </div>
      {!locked && (
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--hud-bright)]"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          aria-label={title}
        />
      )}
    </li>
  );
}