// app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy — Statbase",
  description:
    "How BUSEEDO SAS (Statbase) collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "21 Oct 2025"; // keep static to avoid hydration mismatch

export default function PrivacyPage() {
  return (
    <main
      id="privacy"
      className="
        relative mx-auto w-full max-w-7xl
        border-x border-b border-[color:var(--hud-grid)]
        bg-[var(--panel)] px-6 py-12 md:px-10
      "
    >
      {/* Grid like your FAQ: big sticky left column + content on the right */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,38%)_1fr]">
        {/* LEFT — sticky header */}
        <aside className="lg:sticky lg:top-[72px] self-start">
          <div className="mono text-[11px] tracking-[.22em] text-[var(--muted)] mb-4">
            /LEGAL
          </div>
          <h1
            className="
              font-[--font-display] leading-[0.92]
              text-[40px] sm:text-[56px] md:text-[72px] lg:text-[84px]
              tracking-[-0.02em]
            "
          >
            Privacy<br />Policy
          </h1>

          <p className="mt-4 text-[13px] text-[var(--muted)]">
            Last updated: <span className="text-[var(--ink)]">{LAST_UPDATED}</span>
          </p>

          {/* Tiny “badge” line for consistency with your chips */}
          <div className="mt-6">
            <span className="mono inline-flex items-center rounded-md border border-[var(--hud-line)]/45 px-2 py-[2px] text-[10px] tracking-[.22em] text-[var(--muted)]">
              GDPR / EU
            </span>
          </div>
        </aside>

        {/* RIGHT — document body */}
        <article className="space-y-8">
          {/* Intro frame */}
          <section
            className="
              rounded-2xl border border-[color:var(--hud-grid)]
              bg-[color-mix(in_srgb,var(--panel-2)_78%,transparent)]
              p-5 md:p-6
            "
          >
            <p className="text-[15px] leading-[1.7] text-[var(--muted)]">
              This Privacy Policy explains how <strong className="text-[var(--ink)]">BUSEEDO&nbsp;SAS</strong> (“we”, “our”, “us”)
              collects, uses, and protects your personal data when you use Statbase, request demo access,
              or otherwise interact with us.
            </p>
          </section>

          {/* 1 */}
          <Section
            n="01"
            title="Who we are"
          >
            <p>
              Statbase is operated by <strong className="text-[var(--ink)]">BUSEEDO&nbsp;SAS</strong>, a company registered in France,
              with its registered office at 140b rue de Rennes, 75006 Paris.
              You can contact us at{" "}
              <a href="mailto:daily@buseedo.com" className="underline decoration-[var(--hud-bright)] underline-offset-4 hover:text-[var(--hud-bright)]">
                daily@buseedo.com
              </a>.
            </p>
          </Section>

          {/* 2 */}
          <Section n="02" title="What data we collect">
            <ul className="space-y-2">
              {[
                "Contact information (such as your name and email address)",
                "Professional details (role, team, organization, federation)",
                "Information you provide when requesting demo access",
                "Technical information such as IP address and browser user-agent (for security and compliance)",
              ].map((li, i) => (
                <LI key={i}>{li}</LI>
              ))}
            </ul>
          </Section>

          {/* 3 */}
          <Section n="03" title="How we use your data">
            <p>We process your data only for the following purposes:</p>
            <ul className="mt-3 space-y-2">
              {[
                "Providing password-protected demo access",
                "Contacting you about your request for demo access",
                "Improving our services and understanding demand",
                "Ensuring compliance with applicable laws",
              ].map((li, i) => (
                <LI key={i}>{li}</LI>
              ))}
            </ul>
          </Section>

          {/* 4 */}
          <Section n="04" title="Legal basis">
            <p>
              Our processing is based on your <strong className="text-[var(--ink)]">consent</strong> (Article 6(1)(a) GDPR).
              You can withdraw your consent at any time by contacting{" "}
              <a href="mailto:daily@buseedo.com" className="underline decoration-[var(--hud-bright)] underline-offset-4 hover:text-[var(--hud-bright)]">
                daily@buseedo.com
              </a>.
            </p>
          </Section>

          {/* 5 */}
          <Section n="05" title="Data retention">
            <p>
              We keep demo access requests and contact details for up to 12 months after your last interaction with us,
              unless you withdraw consent earlier. Technical logs may be retained for shorter periods for security purposes.
            </p>
          </Section>

          {/* 6 */}
          <Section n="06" title="Your rights">
            <p>
              Under the GDPR, you have the right to access, rectify, erase, restrict processing of, or object to the processing of your
              personal data, as well as the right to data portability. To exercise your rights, please contact{" "}
              <a href="mailto:daily@buseedo.com" className="underline decoration-[var(--hud-bright)] underline-offset-4 hover:text-[var(--hud-bright)]">
                daily@buseedo.com
              </a>.
            </p>
          </Section>

          {/* 7 */}
          <Section n="07" title="Data transfers">
            <p>
              We may store data with trusted third-party providers in the European Union.
              If data is transferred outside the EU, we ensure appropriate safeguards such as Standard Contractual Clauses.
            </p>
          </Section>

          {/* 8 */}
          <Section n="08" title="Contact">
            <p>
              For any privacy questions, requests, or complaints, please contact{" "}
              <a href="mailto:daily@buseedo.com" className="underline decoration-[var(--hud-bright)] underline-offset-4 hover:text-[var(--hud-bright)]">
                daily@buseedo.com
              </a>.
            </p>
          </Section>

          {/* subtle end rule */}
          <div className="h-px w-full bg-[color:var(--hud-grid)]/40" />
          <div className="mono text-[11px] tracking-[.22em] text-[var(--muted)]">
            /STATBASE • BUSEEDO&nbsp;SAS • PARIS
          </div>
        </article>
      </div>
    </main>
  );
}

/* ========== bits ========== */

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-28" id={slugify(title)}>
      <header className="mb-2 flex items-center gap-3">
        <span className="mono text-[11px] tracking-[.22em] text-[var(--muted)]">/{n}</span>
        <h2 className="text-xl md:text-[22px] font-semibold tracking-tight text-[var(--ink)]">
          {title}
        </h2>
      </header>
      <div className="text-[15px] leading-[1.7] text-[var(--muted)]">{children}</div>
    </section>
  );
}

function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-5">
      <span className="absolute left-0 top-[0.65em] block h-[6px] w-[6px] rounded-full bg-[var(--hud-bright)]/80" />
      <span>{children}</span>
    </li>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w]+/g, "-");
}