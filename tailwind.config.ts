import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#090D16",
        chalk: "#F8FAFC",
        brand: {
          emerald: "#10B981",
          violet: "#8B5CF6",
          crimson: "#EF4444",
          blue: "#3B82F6",
        },
      },
      fontFamily: {
        sans: [
          '"Instrument Sans Variable"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          '"Bricolage Grotesque Variable"',
          '"Instrument Sans Variable"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      keyframes: {
        "gradient-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "ping-soft": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "80%, 100%": { transform: "scale(2.6)", opacity: "0" },
        },
      },
      animation: {
        "gradient-pan": "gradient-pan 9s linear infinite",
        "ping-soft": "ping-soft 2.4s cubic-bezier(0,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
