// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import ResponsiveFix from "../components/ResponsiveFix";

import { SiteHeader } from "../components/SiteHeader";
import TopTape from "../components/TopTape";
import FieldResults from "../components/FieldResults";
import FeaturePVI from "../components/FeaturePVI";
import ProcessOpsRail from "../components/ProcessOpsRail";
import LabsFAQ from "../components/LabsFAQ";

const HUDPlaybook = dynamic(() => import("../components/HUDPlaybook"), { ssr: false });

export const metadata = {
  title: "Statbase — European Baseball Intelligence Layer",
  description:
    "The most comprehensive European pre-analyzed insights DB. League-aware PVI, AI Scout Insights, and verified stats for federations, teams, and scouts.",
  openGraph: {
    title: "Statbase — European Baseball Intelligence Layer",
    description:
      "Verified stats. Contextual scoring. League-aware AI models. The distributed intelligence network for sport.",
    url: "https://www.statbase.eu",
    siteName: "Statbase",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Statbase" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Statbase — European Baseball Intelligence Layer",
    description:
      "Verified stats. Contextual scoring. League-aware AI models. The distributed intelligence network for sport.",
    images: ["/og.jpg"],
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased">
      <ResponsiveFix />
      {/* TAPE & HEADER */}
      <TopTape />
      <SiteHeader />

      {/* HERO — left (copy) / right (HUD) */}
      <section 
        id="app"
        className="
          relative mx-auto w-full max-w-7xl
          border-x border-b border-[color:var(--hud-grid)]
          grid grid-cols-1 lg:grid-cols-2
          items-stretch overflow-hidden
        "
      >
        {/* full-width grid background */}
        <div className="hud-grid-bg absolute inset-0 z-0" aria-hidden />
        <div className="hud-left-vignette absolute inset-0 z-0" aria-hidden />

        {/* LEFT SIDE */}
        <div className="relative flex flex-col justify-center px-6 py-10 md:px-10 md:py-14 bg-[var(--panel)]/80 backdrop-blur-[1px]">
          <div className="relative z-10">
            <div className="space-y-5">
              {/* Unit label */}
              <div className="mono text-[12px] uppercase tracking-[.22em] text-[var(--hud-bright)] opacity-80">
                Research & Technology Unit / EU OPS
              </div>

              {/* Headline */}
              <h1 className="font-[--font-semibold] text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-[var(--ink)]">
                Advanced baseball <br className="hidden sm:block" /> performance intelligence
              </h1>

              {/* Descriptor */}
              <p className="max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
                Our systems convert verified European data into <span className="text-[var(--hud-bright)] font-semibold">decision-grade intelligence</span>.
                League-aware <span className="font-semibold text-[var(--hud-bright)]">Player Value Index</span>, adaptive AI scouting, and transparent context
                for federations, clubs, and analysts.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://app.statbase.eu"
                className="btn-wire mono text-[12px] uppercase tracking-wider inline-flex items-center justify-center"
              >
                Launch the app
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-[6px] border border-[color:var(--hud-grid)] bg-[var(--panel)] px-4 py-2 mono text-[12px] uppercase tracking-wider hover:border-[var(--hud-line)]"
              >
                What’s inside
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Responsive HUD */}
        <div
          className="
            relative bg-[var(--panel)]/80 backdrop-blur-[1px]
            flex items-center justify-center
            p-3 md:p-4
          "
        >
          <div
            className="
              hud-frame hud-backlight relative overflow-hidden
              aspect-square w-full max-w-[760px]
              sm:max-w-[600px] md:max-w-[640px] lg:max-w-[720px] xl:max-w-[760px]
            "
          >
            <div className="hud-grid-bg pointer-events-none absolute inset-0 z-0" />
            <div className="hud-crt pointer-events-none absolute inset-0 z-0" />
            <div className="relative z-10 h-full w-full">
              <HUDPlaybook />
            </div>
          </div>
        </div>
      </section>

      {/* === FIELD RESULTS / STATS === */}
      <section id="stats">
        <FieldResults
          items={[
            { value: "300K",  note: "in-game events re-calculated" },
            { value: "1,200", note: "verified players in the index" },
            { value: "50",    note: "clubs analyzed across Europe" },
          ]}
        />
      </section>

      {/* === FEATURES / PVI EXPLAINED === */}
      <section id="features">
        <FeaturePVI
          pvi="Inspired by proven sabermetric logic such as wOBA and FIP, OUR INDEX blends offensive efficiency, power impact, and pitching command – adjusted for each league’s context."
          heading={["Built for", "decisions"]}
          items={[
            {
              title: "Player Value Index",
              tag: "PVI",
              body:
                "Single comparable score calibrated by league + role. Built to rank development → impact without bias.",
            },
            {
              title: "AI Scout Insights",
              tag: "Reports",
              body:
                "Decision-grade narratives: strengths, risks, and contextual comps — fast read, zero fluff.",
            },
            {
              title: "Verified EU stats",
              tag: "Telemetry",
              body:
                "Federation feeds normalized with validation layers. Transparent inputs for trustworthy outputs.",
            },
            {
              title: "Club Admin",
              tag: "OPS",
              body:
                "All-in-one: Roster tools, season monitoring, and data verification workflows for technical staff - connected directly to the league-aware backend.",
            },
          ]}
        />
      </section>

      {/* === PROCESS / OPERATIONS RAIL === */}
      <section id="process">
        <ProcessOpsRail
          stages={[
            {
              code: "STG_ING_A1",
              title: "Ingest",
              caption: "Connect federation feeds or upload seasons. We clean, normalize, dedupe.",
              eta: "24–72h",
              status: "live",
            },
            {
              code: "STG_CTX_B4",
              title: "Contextualize",
              caption: "League + role benchmarking; compute PVI, subscores, tiers & comps.",
              eta: "T+1d",
            },
            {
              code: "STG_PRS_C9",
              title: "Present",
              caption: "Clear player/team views with aligned math for fair decisions.",
              eta: "Instant",
            },
            {
              code: "STG_DPL_D2",
              title: "Deploy",
              caption: "Org-scoped sharing, exports (PDF/CSV) and API hooks.",
              eta: "Same day",
            },
            {
              code: "STG_ADT_E7",
              title: "Audit",
              caption: "Transparency layer: inputs, checks & diffs kept verifiable.",
              eta: "Rolling",
            },
          ]}
        />
      </section>

      {/* === FAQ / CONSOLE === */}
      <section
        id="faq"
        className="relative mx-auto max-w-7xl border-x border-b border-[color:var(--hud-grid)] bg-[var(--panel)] px-6 pb-16 pt-12 md:px-10"
      >
        <div className="mt-6">
          <LabsFAQ
            items={[
              {
                q: "Why Statbase, and why now?",
                a: "Because athletes deserve more than box scores. We compress raw stats into signals scouts actually use — clarity where careers are made.",
              },
              {
                q: "What makes Player Value Index different?",
                a: "PVI is league-aware and role-adjusted. It scales from development to impact so teams can compare players instantly and fairly.",
              },
              {
                q: "Who is Statbase built for?",
                a: "Federations, clubs, and pro scouting groups across Europe — and any league needing verified, comparable evaluations.",
              },
              {
                q: "Do we have to change our workflow?",
                a: "No. Import your stats or connect feeds; we handle normalization, math, and presentation.",
              },
              {
                q: "What about data privacy and security?",
                a: "Today, we link to your existing footage. Tomorrow, we’ll host it securely, privacy-first. Your data, your career – protected from day one.",
              },
            ]}
          />
        </div>
      </section>

       {/* FOOTER */}
            <footer className="border-t border-[color:var(--hud-grid)] bg-[var(--panel)]">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
                <div className="flex items-center gap-2">
                  <span className="relative block h-3 w-3">
                            <Image
                              src="/logo.svg"
                              alt="Statbase"
                              fill
                              className="object-contain brightness-0 invert"
                            />
                  </span>
                  <span className="text-sm font-semibold">Statbase</span>
                </div>
                <div className="mono text-[12px] text-[var(--muted)]">
                  © {new Date().getFullYear()} Statbase / Division of BUSEEDO SAS
                </div>
              </div>
            </footer>
          </main>
        );
      }
