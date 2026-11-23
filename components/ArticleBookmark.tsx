"use client";

import { articleScrollProgress, scrollToArticleProgress } from "@/lib/articleScroll";
import { clearBookmark, setBookmark, useReader } from "@/lib/reader";

const iconBtn =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

/** Save / jump / clear a manual reading bookmark (stored in localStorage). */
export default function ArticleBookmark({
  slug,
  layout,
}: {
  slug: string;
  layout: "rail" | "bar";
}) {
  const reader = useReader();
  const b = reader?.history[slug]?.b;
  const pct = b !== undefined ? Math.round(b * 100) : null;

  const save = () => {
    setBookmark(slug, articleScrollProgress());
  };

  if (layout === "bar") {
    return (
      <>
        {pct !== null && (
          <button
            type="button"
            onClick={() => scrollToArticleProgress(b!)}
            className={iconBtn}
            aria-label={`Jump to bookmark at ${pct}%`}
            title={`Bookmark at ${pct}%`}
          >
            <BookmarkIcon filled />
            <span className="tabular-nums">{pct}%</span>
          </button>
        )}
        <button
          type="button"
          onClick={save}
          className={iconBtn}
          aria-label={pct !== null ? "Update bookmark to here" : "Bookmark this spot"}
          title={pct !== null ? "Update bookmark" : "Bookmark here"}
        >
          <BookmarkIcon filled={pct !== null} />
        </button>
      </>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0.5 -ml-3">
      <button type="button" onClick={save} className={iconBtn} aria-label="Bookmark this spot in the article">
        <BookmarkIcon filled={pct !== null} />
        {pct !== null ? `Update bookmark (${pct}%)` : "Bookmark here"}
      </button>
      {pct !== null && (
        <>
          <button
            type="button"
            onClick={() => scrollToArticleProgress(b!)}
            className={iconBtn}
            aria-label={`Jump to bookmark at ${pct}%`}
          >
            Jump to bookmark
          </button>
          <button type="button" onClick={() => clearBookmark(slug)} className={iconBtn} aria-label="Remove bookmark">
            Clear bookmark
          </button>
        </>
      )}
    </div>
  );
}