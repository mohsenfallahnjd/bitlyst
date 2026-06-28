"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => { setVisible(window.scrollY > 400); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); };
  }, []);

  if (!visible) { return null; }

  return (
    <button
      type="button"
      onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}
      aria-label="Scroll to top"
      className="fixed bottom-6 left-4 z-40 flex items-center justify-center size-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 transition-all xl:left-auto xl:right-4"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
        <path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.751.751 0 0 1-1.042 1.06L9 4.81V13a.75.75 0 0 1-1.5 0V4.81L5.53 7.78a.75.75 0 0 1-1.06 0Z" />
      </svg>
    </button>
  );
}
