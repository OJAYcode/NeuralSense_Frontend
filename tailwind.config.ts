import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calming color palette for stress detection app
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        calm: {
          50: "#f5f8fa",
          100: "#e8f0f7",
          200: "#d1e1ef",
          300: "#aac9e0",
          400: "#7daece",
          500: "#5a94bd",
          600: "#467aa3",
          700: "#396385",
          800: "#32536f",
          900: "#2d475d",
        },
        stress: {
          low: "#86efac", // Green
          moderate: "#fbbf24", // Amber
          high: "#f87171", // Red
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
