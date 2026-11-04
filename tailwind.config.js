/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./mdx-components.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // System stack: no font download (Google Fonts can be unreachable), instant first paint
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        // Cool neutrals — crisp in light mode, deep (not pure black) in dark mode
        gray: {
          50: "#f8f9fb",
          100: "#f1f2f5",
          200: "#e3e5ea",
          300: "#cdd0d8",
          400: "#7e8494",
          500: "#636979",
          600: "#4b5060",
          700: "#373b48",
          800: "#23262f",
          900: "#16181e",
          950: "#0d0e12",
        },
        // Royal blue built around the logo (#0e36e9); 600 in light mode, 400 in dark
        brand: {
          50: "#f0f4ff",
          100: "#e2e9ff",
          200: "#c9d5ff",
          300: "#a3b6ff",
          400: "#7b93ff",
          500: "#5672fa",
          600: "#3a52ee",
          700: "#2b3fd4",
          800: "#2534ab",
          900: "#232f86",
          950: "#161c4f",
        },
        background: {
          light: "#fafbfc",
          dark: "#0b0c10",
        },
        foreground: {
          light: "#16181e",
          dark: "#e8eaf0",
        },
        surface: {
          light: "#ffffff",
          dark: "#12141a",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};
