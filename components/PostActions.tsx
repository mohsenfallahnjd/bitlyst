"use client";

import { useEffect, useRef, useState } from "react";
import { formatCount } from "@/lib/format";
import ShareButton from "./ShareButton";
import { CommentIcon } from "./StatIcons";

/** 0..1 progress through #post-body (not the whole page). */
export function useArticleProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const body = document.getElementById("post-body");
      if (!body) {
        return;
      }
      const rect = body.getBoundingClientRect();
      const p = rect.height > 0 ? (window.innerHeight * 0.5 - rect.top) / rect.height : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}

function minutesLeft(progress: number, readingTime: number) {
  if (progress >= 0.98) {
    return "Finished 🎉";
  }
  const left = Math.max(1, Math.ceil(readingTime * (1 - progress)));
  return `${left} min left`;
}

function ProgressRing({ value }: { value: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 24 24" className="size-5 -rotate-90" aria-hidden>
      <circle cx="12" cy="12" r={r} fill="none" strokeWidth="2.5" className="stroke-gray-200 dark:stroke-gray-800" />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        className="stroke-brand-600 dark:stroke-brand-400 transition-[stroke-dashoffset] duration-150"
      />
    </svg>
  );
}

const iconBtn =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

type Props = { title: string; url: string; readingTime: number; comments: number };

/** Mobile: bottom bar that slides in while reading and hides when scrolling down fast. */
export function PostActionBar({ title, url, readingTime, comments }: Props) {
  const progress = useArticleProgress();
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const [show, setShow] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // reveal when scrolling up or near the end, hide while skimming down
      setShow(y > 500 && (y < lastY - 4 || progressRef.current > 0.92));
      if (Math.abs(y - lastY) > 4) {
        lastY = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 xl:hidden pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-[120%]"
      }`}
    >
      <div className="mx-3 mb-3 flex items-center justify-between gap-1 rounded-full border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg shadow-black/5 px-2 py-1">
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={iconBtn}
          aria-label="Back to top"
        >
          <ProgressRing value={progress} />
          <span className="tabular-nums">{minutesLeft(progress, readingTime)}</span>
        </button>
        <div className="flex items-center">
          <a href="#reactions" className={iconBtn} aria-label="React to this post">
            <span aria-hidden>👍</span>
          </a>
          <a href="#comments" className={iconBtn} aria-label="Comments">
            <CommentIcon />
            {comments > 0 && formatCount(comments)}
          </a>
          <ShareButton title={title} url={url} variant="icon" className="!shadow-none !ring-0 !bg-transparent" />
        </div>
      </div>
    </div>
  );
}

/** Desktop: progress + actions under the sticky table of contents. */
export function PostRailActions({ title, url, readingTime, comments }: Props) {
  const progress = useArticleProgress();
  return (
    <div className="mt-6 space-y-3 border-t border-gray-200/70 dark:border-gray-800/60 pt-5">
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <ProgressRing value={progress} />
        <span className="tabular-nums">{minutesLeft(progress, readingTime)}</span>
      </div>
      <div className="flex flex-col items-start gap-0.5 -ml-3">
        <a href="#comments" className={iconBtn}>
          <CommentIcon />
          {comments > 0 ? `${comments} comment${comments > 1 ? "s" : ""}` : "Discuss"}
        </a>
        <a href="#reactions" className={iconBtn}>
          <span aria-hidden>👍</span> React
        </a>
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={iconBtn}
        >
          <span aria-hidden>↑</span> Back to top
        </button>
      </div>
      <ShareButton title={title} url={url} />
    </div>
  );
}
