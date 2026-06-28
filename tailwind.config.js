const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./mdx-components.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        // Stone neutrals — warm, pairs with cream background
        gray: colors.stone,
        brand: {
          light: "#0d9488", // teal-600
          dark:  "#2dd4bf", // teal-300
        },
        background: {
          light: "#faf8f5", // warm cream
          dark:  "#141210", // warm near-black
        },
        foreground: {
          light: "#1c1917", // stone-900
          dark:  "#faf8f5",
        },
        surface: {
          light: "#ffffff",
          dark:  "#1c1917", // stone-900
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};
