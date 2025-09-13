"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  // sync state with current DOM/class on mount
  useEffect(() => {
    const ls = typeof window !== "undefined" ? (localStorage.getItem("theme") as Mode | null) : null;
    if (ls === "light" || ls === "dark") {
      setMode(ls);
    } else {
      setMode("system");
    }
  }, []);

  function apply(mode: Mode) {
    const root = document.documentElement.classList;
    if (mode === "system") {
      localStorage.removeItem("theme");
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches;
      sys ? root.add("dark") : root.remove("dark");
    } else {
      localStorage.setItem("theme", mode);
      mode === "dark" ? root.add("dark") : root.remove("dark");
    }
    setMode(mode);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => apply(mode === "dark" ? "light" : "dark")}
        className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        <span className="hidden sm:inline">{mode === "dark" ? "Dark" : mode === "light" ? "Light" : "System"}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="opacity-80">
          <path
            className="dark:hidden"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="
							M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8
							M12 3v2
							M12 19v2
							M3 12h2
							M19 12h2
							M5.636 5.636l1.414 1.414
							M16.95 16.95l1.414 1.414
							M5.636 18.364l1.414-1.414
							M16.95 7.05l1.414-1.414
						"
          />

          <path
            className="hidden dark:inline"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 1 0 21 12.79Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
