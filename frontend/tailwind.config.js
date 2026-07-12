/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "rgb(var(--bg-primary-rgb) / <alpha-value>)",
          card: "rgb(var(--bg-card-rgb) / <alpha-value>)",
          border: "rgb(var(--border-color-rgb) / <alpha-value>)",
        },
        pulse: {
          green: "rgb(var(--pulse-green-rgb) / <alpha-value>)",
          amber: "rgb(var(--pulse-amber-rgb) / <alpha-value>)",
          red: "rgb(var(--pulse-red-rgb) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--text-primary-rgb) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary-rgb) / <alpha-value>)",
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
