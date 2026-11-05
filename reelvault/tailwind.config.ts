import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090a0d",
        foreground: "#f4f4f5",
        surface: {
          DEFAULT: "#111216",
          elevated: "#18191f",
          card: "#14151a",
          border: "#23262f",
          hover: "#1f222b",
        },
        brand: {
          DEFAULT: "#ff5a1f",
          hover: "#e04b15",
          light: "#ff7a45",
          muted: "rgba(255, 90, 31, 0.12)",
        },
        emerald: {
          DEFAULT: "#10b981",
          hover: "#059669",
          muted: "rgba(16, 185, 129, 0.12)",
        },
        muted: {
          DEFAULT: "#71717a",
          foreground: "#a1a1aa",
          border: "#27272a",
        },
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        glow: "0 0 24px -4px rgba(255, 90, 31, 0.25)",
        emeraldGlow: "0 0 24px -4px rgba(16, 185, 129, 0.25)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out forwards",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
