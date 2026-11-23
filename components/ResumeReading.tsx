"use client";

import { useEffect, useState } from "react";
import { scrollToArticleProgress } from "@/lib/articleScroll";
import { resumeProgress, useReader } from "@/lib/reader";

function sessionKey(slug: string) {
  return `bitlyst:resume-dismiss:${slug}`;
}

/** Offers to jump to your saved bookmark when you reopen the post (no auto-scroll). */
export default function ResumeReading({ slug }: { slug: string }) {
  const reader = useReader();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!reader) {
      return;
    }
    try {
      if (sessionStorage.getItem(sessionKey(slug))) {
        return;
      }
    } catch {
      /* ignore */
    }
    if (window.location.hash.length > 1) {
      return;
    }
    const p = resumeProgress(reader.history[slug]);
    if (p === null) {
      return;
    }
    const t = window.setTimeout(() => {
      if (window.scrollY < 120) {
        setProgress(p);
        setOpen(true);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [reader, slug]);

  if (!open || progress === null) {
    return null;
  }

  const pct = Math.round(progress * 100);

  const dismiss = () => {
    try {
      sessionStorage.setItem(sessionKey(slug), "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const resume = () => {
    scrollToArticleProgress(progress);
    dismiss();
  };

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-40 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex max-w-md flex-wrap items-center justify-center gap-2 rounded-full border border-gray-200/80 bg-white/95 px-4 py-2 text-sm shadow-lg shadow-black/10 backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-900/95">
        <span className="text-gray-700 dark:text-gray-200">
          Bookmark at <span className="font-medium tabular-nums">{pct}%</span>
        </span>
        <button
          type="button"
          onClick={resume}
          className="rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Jump there
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full px-2 py-1 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Start from top
        </button>
      </div>
    </div>
  );
}