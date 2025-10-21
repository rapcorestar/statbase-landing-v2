import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace','SFMono-Regular','Menlo','Monaco','"Courier New"', 'monospace'],
      }
    },
  },
  plugins: [],
} satisfies Config;