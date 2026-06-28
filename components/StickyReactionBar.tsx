"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/lib/userUtils";

type R = "like" | "love" | "fire";

const QUICK: { type: R; emoji: string }[] = [
  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "fire", emoji: "🔥" },
];

export default function StickyReactionBar({ postSlug }: { postSlug: string }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [reacted, setReacted] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled > 0.55 && !dismissed) { setVisible(true); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); };
  }, [dismissed]);

  const react = async (type: R) => {
    if (loading || reacted) { return; }
    const userId = getUserId();
    if (!userId) { return; }
    setLoading(true);
    setReacted(type);
    try {
      await fetch(`/api/reactions/${postSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType: type, userId, action: "add" }),
      });
    } catch { /* ignore */ }
    setLoading(false);
    setTimeout(() => { setDismissed(true); setVisible(false); }, 2000);
  };

  if (!visible || dismissed) { return null; }

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 xl:hidden"
      style={{ animation: "fadeUp 0.3s ease-out both" }}
    >
      <div className="mx-3 mb-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl px-4 py-3 flex items-center justify-between gap-3">
        {reacted ? (
          <p className="flex-1 text-center text-sm font-medium text-cyan-700 dark:text-cyan-300">
            Thanks for the reaction! 🙌
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-300 shrink-0">
              Was this helpful?
            </p>
            <div className="flex items-center gap-2">
              {QUICK.map(({ type, emoji }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { react(type); }}
                  disabled={loading}
                  className="flex items-center justify-center size-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-90 transition-all"
                  aria-label={type}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => { setDismissed(true); setVisible(false); }}
              className="shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Dismiss"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
