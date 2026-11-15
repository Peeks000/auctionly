import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: "#111111",       // Main background
          dark: "#242424",        // Secondary dark surfaces & cards
          charcoal: "#1A1A1A",    // Deep container backdrop
          elevated: "#2D2D2D",    // Hover & elevated modals
          champagne: "#E8DCC4",   // Soft borders & secondary text
          gold: "#C6A66A",        // Muted gold accent
          goldLight: "#DFBF82",   // Highlight gold
          goldDark: "#9E824A",    // Deep burnished gold
          ivory: "#F5F0E7",       // Primary high-contrast text
          muted: "#8C857B",       // Neutral label text
          subtle: "#3A3835",      // Delicate outlines
        },
        status: {
          live: "#E53935",        // Pulsing auction live indicator
          reserveMet: "#43A047",  // Reserve met badge
          pending: "#D4AF37",     // Pending review badge
          outbid: "#E65100",      // Outbid alert
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-geist)", "Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      letterSpacing: {
        luxury: "0.2em",
        regal: "0.3em",
      },
      animation: {
        "shimmer-gold": "shimmerGold 3s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gavel-strike": "gavelStrike 0.6s ease-out",
      },
      keyframes: {
        shimmerGold: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        gavelStrike: {
          "0%": { transform: "rotate(-25deg)" },
          "40%": { transform: "rotate(15deg)" },
          "70%": { transform: "rotate(-5deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E8DCC4 0%, #C6A66A 50%, #9E824A 100%)",
        "dark-radial": "radial-gradient(circle at 50% 30%, #242424 0%, #111111 80%)",
      },
    },
  },
  plugins: [],
};

export default config;
