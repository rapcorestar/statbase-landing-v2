"use client";

import { useEffect } from "react";

/**
 * Injects runtime-only responsive sizing CSS for HUD layout.
 * Avoids SSR hydration mismatches.
 */
export default function ResponsiveFix() {
  useEffect(() => {
    const css = `
      @media (max-width: 1024px) {
        section[style*="--hero-h"] {
          min-height: 80svh !important;
        }
        section[style*="--hero-h"] .hud-frame {
          width: min(90vw, 580px) !important;
          height: min(90vw, 580px) !important;
        }
      }

      @media (max-width: 640px) {
        section[style*="--hero-h"] {
          min-height: 88svh !important;
        }
        section[style*="--hero-h"] .hud-frame {
          width: min(94vw, 480px) !important;
          height: min(94vw, 480px) !important;
        }
      }

      @media (min-width: 1025px) {
        section[style*="--hero-h"] {
          min-height: clamp(600px, 72vh, 880px) !important;
        }
        section[style*="--hero-h"] .hud-frame {
          width: min(calc(50vw - 48px), 800px) !important;
          height: min(calc(50vw - 48px), 800px) !important;
        }
      }
    `;

    const styleEl = document.createElement("style");
    styleEl.id = "hud-responsive-style";
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    return () => {
      const existing = document.getElementById("hud-responsive-style");
      if (existing) existing.remove();
    };
  }, []);

  return null;
}