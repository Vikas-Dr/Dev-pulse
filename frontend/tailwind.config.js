/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0F1117",
          card: "#1A1D28",
          border: "#2D3148",
        },
        pulse: {
          green: "#4ADE80",
          amber: "#F59E0B",
          red: "#EF4444",
        },
        text: {
          primary: "#E2E8F0",
          secondary: "#94A3B8",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse-ring 3s ease-in-out infinite",
        "pulse-medium": "pulse-ring 1.5s ease-in-out infinite",
        "pulse-fast": "pulse-ring 0.75s ease-in-out infinite",
      },
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.3)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
