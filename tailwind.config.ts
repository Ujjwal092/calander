import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: {
          50: "#f7f5f0",
          100: "#ede8dc",
          200: "#d9cfb8",
          300: "#c2b08f",
          400: "#a8906a",
          500: "#8c7451",
          600: "#705c40",
          700: "#554433",
          800: "#3a2e24",
          900: "#1e1710",
          950: "#100d08",
        },
        parchment: {
          50: "#fdfcf8",
          100: "#faf7ee",
          200: "#f4edd8",
          300: "#ecdfbe",
          400: "#e0c99a",
          500: "#d2b072",
        },
        accent: {
          warm: "#c9622f",
          gold: "#d4a853",
          sage: "#6b7d5a",
          slate: "#4a6270",
          rose: "#b85c6e",
        },
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "ink-sm": "0 1px 3px rgba(16, 13, 8, 0.12), 0 1px 2px rgba(16, 13, 8, 0.08)",
        "ink-md": "0 4px 12px rgba(16, 13, 8, 0.15), 0 2px 6px rgba(16, 13, 8, 0.1)",
        "ink-lg": "0 8px 24px rgba(16, 13, 8, 0.18), 0 4px 10px rgba(16, 13, 8, 0.12)",
        "ink-xl": "0 16px 48px rgba(16, 13, 8, 0.22), 0 8px 20px rgba(16, 13, 8, 0.15)",
        "glow-warm": "0 0 20px rgba(201, 98, 47, 0.35), 0 0 40px rgba(201, 98, 47, 0.15)",
        "glow-gold": "0 0 20px rgba(212, 168, 83, 0.4), 0 0 40px rgba(212, 168, 83, 0.2)",
        "glass": "0 8px 32px rgba(16, 13, 8, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-in-right": "slideInRight 0.35s ease-out forwards",
        "pop": "pop 0.2s ease-out forwards",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.92)" },
          "60%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
