// app/gate/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

type Tab = "password" | "request";

export default function GatePage() {
  const [tab, setTab] = useState<Tab>("password");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  async function onUnlock(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/demo/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const { next } = await res.json();
        window.location.href = next;
      } else {
        setErr(await res.text());
      }
    } catch {
      setErr("Network error. Please try again.");
    } finally { setLoading(false); }
  }

  async function onLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    if (!consent) {
      setErr("Please agree to data processing to continue.");
      return;
    }
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, any> = Object.fromEntries(fd.entries());
    payload.consent = true;
    try {
      const res = await fetch("/api/demo/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        setConsent(false);
        alert("Thanks! We’ll review and approve you shortly.");
        setTab("password");
      } else {
        setErr(await res.text());
      }
    } catch {
      setErr("Network error. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* sticky header, same look as site */}
      <header className="sticky top-0 z-50 border-b border-[color:var(--hud-grid)] bg-[color-mix(in_srgb,var(--panel)_78%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Statbase"
              className="h-5 w-5 object-contain brightness-0 invert" // 👈 makes it white
            />
            <span className="font-semibold tracking-tight">Statbase</span>
            <span className="ml-2 rounded-sm border border-[var(--hud-line)] bg-[var(--panel-2)] px-2 py-[2px] mono text-[11px] text-[var(--hud-bright)]">
              PRIVATE PREVIEW
            </span>
          </div>
          <nav className="mono hidden gap-5 text-[11px] tracking-[.22em] text-[var(--muted)] sm:flex">
            <Link href="/" className="hover:text-[var(--hud-bright)]">Home</Link>
            <Link href="/privacy" className="hover:text-[var(--hud-bright)]">Privacy</Link>
          </nav>
        </div>
      </header>

      <section className="relative mx-auto w-full max-w-7xl border-x border-[color:var(--hud-grid)] bg-[var(--panel)] px-6 pb-16 pt-10 md:px-10">
        <div className="mono text-[11px] uppercase tracking-[.22em] text-[var(--muted)]">/ ACCESS GATE</div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,42%)_1fr]">
          {/* left: title & switch */}
          <aside className="lg:sticky lg:top-[72px]">
            <h1 className="font-[--font-display] text-[40px] leading-[0.95] tracking-[-0.02em] sm:text-[56px] md:text-[64px]">
              Secure access
              <br />to the app
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
              If you’ve been approved, enter the demo password. Otherwise request access —
              we’ll verify your org and enable login.
            </p>

            <div className="mt-6 inline-grid grid-cols-2 overflow-hidden rounded-lg border border-[color:var(--hud-grid)] bg-[color-mix(in_srgb,var(--panel-2)_70%,transparent)] p-1">
              <button
                onClick={() => setTab("password")}
                className={[
                  "px-3 py-2 text-sm font-medium transition",
                  tab === "password"
                    ? "rounded-md bg-[var(--panel)] text-[var(--ink)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]",
                ].join(" ")}
              >
                Enter password
              </button>
              <button
                onClick={() => setTab("request")}
                className={[
                  "px-3 py-2 text-sm font-medium transition",
                  tab === "request"
                    ? "rounded-md bg-[var(--panel)] text-[var(--ink)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]",
                ].join(" ")}
              >
                Request demo
              </button>
            </div>

            <p className="mono mt-4 text-[11px] tracking-[.18em] text-[var(--muted)]">
              Approved clubs, federations and pro scouting orgs only. Requests are reviewed.
            </p>
          </aside>

          {/* right: forms */}
          <div className="rounded-2xl border border-[color:var(--hud-grid)] bg-[color-mix(in_srgb,var(--panel-2)_75%,transparent)] p-5 md:p-6">
            {tab === "password" ? (
              <form onSubmit={onUnlock} className="space-y-4">
                <Field name="email" type="email" label="Work email" required />
                <Field name="password" type="password" label="Demo password" required />

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="btn-wire disabled:opacity-60">
                    {loading ? "Checking…" : "Unlock & continue"}
                  </button>
                  <Link
                    href="/privacy"
                    className="mono rounded-md border border-[color:var(--hud-grid)] px-3 py-2 text-[12px] tracking-[.18em] text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    Privacy
                  </Link>
                </div>
                {err && <ErrorBanner msg={err} />}
              </form>
            ) : (
              <form onSubmit={onLead} className="space-y-4">
                <Field name="name" label="Full name" />
                <Field name="email" type="email" label="Work email" required />
                <Field name="org" label="Team / Federation / Org" />
                <Field name="role" label="Role (Scout, Coach, Player, Admin…)" />
                <TextArea name="note" label="What do you want to evaluate?" rows={5} />

                <label className="mt-1 flex items-start gap-3 text-[14px] leading-relaxed">
                  <input
                    type="checkbox"
                    className="mt-[3px] h-4 w-4 rounded border-[color:var(--hud-grid)] bg-[var(--panel)]"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                  />
                  <span className="text-[var(--muted)]">
                    I agree to be contacted and consent to processing for demo access per{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-[var(--hud-bright)] underline decoration-[var(--hud-bright)]/40 underline-offset-2 hover:opacity-80"
                    >
                      Privacy Policy
                    </Link>
                    . I can withdraw consent anytime.
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="btn-wire disabled:opacity-60">
                    {loading ? "Sending…" : "Request access"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("password")}
                    className="mono rounded-md border border-[color:var(--hud-grid)] px-3 py-2 text-[12px] tracking-[.18em] text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    Enter password
                  </button>
                </div>

                {err && <ErrorBanner msg={err} />}

                <p className="mono mt-3 text-[10px] leading-relaxed tracking-[.18em] text-[var(--muted)]">
                  Controller: BUSEEDO SAS • Purpose: demo access & product updates • Legal basis: consent (Art. 6(1)(a) GDPR) •
                  Retention: until consent withdrawn or 12 months after last contact • Rights: access, rectification, erasure,
                  restriction, objection, portability • Contact: daily@buseedo.com
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="mono mx-auto mt-8 max-w-lg text-center text-[11px] tracking-[.22em] text-[var(--muted)]">
          Approved domains & emails only.
        </p>
      </section>
    </main>
  );
}

/* ---------- UI bits ---------- */

function Field({
  name, label, type = "text", required,
}: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mono mb-2 block text-[10px] tracking-[.22em] text-[var(--muted)]">
        {label}{required ? " *" : ""}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="
          w-full rounded-xl border border-[color:var(--hud-grid)]
          bg-[color-mix(in_srgb,var(--panel)_70%,black)] px-3 py-2
          text-[var(--ink)] outline-none
          focus:border-[var(--hud-accent)] focus:ring-1 focus:ring-[var(--hud-accent)]
          placeholder:text-[var(--muted)]
        "
      />
    </label>
  );
}

function TextArea({
  name, label, rows = 4,
}: { name: string; label: string; rows?: number }) {
  return (
    <label className="block">
      <span className="mono mb-2 block text-[10px] tracking-[.22em] text-[var(--muted)]">{label}</span>
      <textarea
        name={name}
        rows={rows}
        className="
          w-full rounded-xl border border-[color:var(--hud-grid)]
          bg-[color-mix(in_srgb,var(--panel)_70%,black)] px-3 py-2
          text-[var(--ink)] outline-none
          focus:border-[var(--hud-accent)] focus:ring-1 focus:ring-[var(--hud-accent)]
          placeholder:text-[var(--muted)]
        "
      />
    </label>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="mono rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-[12px] tracking-[.12em] text-red-300">
      {msg}
    </div>
  );
}