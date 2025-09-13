/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./mdx-components.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
      },
      colors: {
        brand: {
          light: "#0070f3", // Next.js blue
          dark: "#3291ff",
        },
        background: {
          light: "#ffffff",
          dark: "#0a0a0a", // near-black like nextjs.org
        },
        foreground: {
          light: "#111111",
          dark: "#fafafa",
        },
      },
    },
  },
  plugins: [],
};
