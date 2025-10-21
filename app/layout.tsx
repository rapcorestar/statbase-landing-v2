// app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next"

import { Newsreader, IBM_Plex_Mono } from "next/font/google";

import CookieConsent from "../components/CookieConsent";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const siteUrl = "https://www.statbase.eu"
const ogImage = "/og.jpg"

const display = Newsreader({ subsets: ["latin"], weight: ["600","700"], variable: "--font-display" });
const mono    = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400","600"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.statbase.eu"),
  title: {
    default: "Statbase — European Baseball Analytics (PVI, TPM, AI Scout Insights)",
    template: "%s | Statbase"
  },
  description:
    "Statbase is the most comprehensive European pre-analyzed insights database — powering verified stats, Player Value Index (PVI), Team Power Metric (TPM), and AI Scout Insights for Serie A, DBL, and beyond.",
  manifest: "/manifest.json", // ✅ add this line
    openGraph: {
    type: "website",
    url: "https://www.statbase.eu",
    siteName: "Statbase",
    title: "Statbase — The European Baseball Analytics Platform",
    description:
      "The most comprehensive European pre-analyzed insights database. Verified stats, league benchmarks, and AI-powered scouting metrics (PVI & TPM).",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Statbase — European Baseball Analytics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Statbase — European Baseball Analytics Platform",
    description:
      "The most comprehensive European pre-analyzed insights database — verified stats, Player Value Index, Team Power Metric, and AI Scout Insights.",
    images: ["/og.jpg"],
  },
  keywords: [
    "France baseball stats",
    "Division 1 baseball stats",
    "Netherlands baseball stats",
    "Italy baseball stats",
    "Germany baseball stats",
    "Spain baseball stats",
    "baseball statistics Europe",
    "baseball analytics",
    "European baseball stats",
    "Serie A baseball analytics",
    "DBL baseball stats",
    "Player Value Index",
    "Team Power Metric",
    "AI scouting",
    "baseball benchmarks Europe",
    "EU baseball analytics",
    "baseball leaderboards Europe",
    "team power metric",
    "player value index",
    "advanced baseball stats Europe",
    "baseball performance metrics Europe",
    "European baseball data",
    "baseball analytics platform Europe",
    "scouting baseball Europe",
    "baseball player rankings Europe",
    "baseball team rankings Europe",
    "baseball stats comparison Europe",
    "baseball data analysis Europe",
    "baseball insights Europe",
    "baseball trends Europe",
    "baseball metrics Europe",
    "baseball evaluation Europe",
    "baseball performance analysis Europe",
    "france baseball",
    "netherlands baseball",
    "italy baseball",
    "germany baseball",
    "spain baseball",
    "baseball europe",
    "european baseball leagues",
    "baseball scouting Europe",
    "baseball player stats Europe",
    "baseball team stats Europe",
    "baseball analytics tools Europe",
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Organization + Website JSON-LD (inline, zero deps)
  const org = {
    "@context":"https://schema.org",
    "@type":"Organization",
    "name":"Statbase",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.svg`,
    "sameAs":[
      "https://www.instagram.com/statbaseapp/",
      "https://www.linkedin.com/company/statbase-sports/",
    ]
  }
  const website = {
    "@context":"https://schema.org",
    "@type":"WebSite",
    "name":"Statbase",
    "url": siteUrl,
    "potentialAction":{
      "@type":"SearchAction",
      "target":`${siteUrl}/search?q={query}`,
      "query-input":"required name=query"
    }
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnects help Safari/iOS grab the font reliably */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Doto (variable wght axis) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Doto:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${display.variable} ${mono.variable} font-sans`}>
        {children}
        <CookieConsent /> {/* 👈 appears site-wide */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}