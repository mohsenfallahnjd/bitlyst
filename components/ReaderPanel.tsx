"use client";

import Link from "next/link";
import { READ_THRESHOLD, useReader } from "@/lib/reader";

type Item = { slug: string; title: string; publishedTime?: string };

/** Personal "your reading" strip on the home page. Hidden for first-time visitors. */
export default function ReaderPanel({ posts }: { posts: Item[] }) {
  const reader = useReader();
  if (!reader) {
    return null;
  }

  const history = reader.history;
  const readCount = posts.filter((p) => (history[p.slug]?.p ?? 0) >= READ_THRESHOLD).length;
  const fresh = reader.prevVisit
    ? posts.filter((p) => p.publishedTime && new Date(p.publishedTime).getTime() > reader.prevVisit && !history[p.slug])
    : [];
  const resume = posts
    .filter((p) => {
      const h = history[p.slug];
      return h && h.p >= 0.1 && h.p < READ_THRESHOLD && Date.now() - h.t < 30 * 86_400_000;
    })
    .sort((a, b) => history[b.slug].t - history[a.slug].t)[0];

  const streak = reader.streak.count;
  const returning = Object.keys(history).length > 0;
  if (!returning) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200/80 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {streak >= 2 ? (
          <span className="font-medium text-orange-600 dark:text-orange-400" title={`Best: ${reader.streak.best} days`}>
            🔥 {streak}-day reading streak
          </span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">👋 Welcome back — visit tomorrow to start a streak</span>
        )}
        {fresh.length > 0 && (
          <Link href={`/p/${fresh[0].slug}`} className="text-[var(--accent)] hover:underline underline-offset-2">
            {fresh.length} new post{fresh.length > 1 ? "s" : ""} since your last visit →
          </Link>
        )}
      </div>

      {resume && (
        <Link
          href={`/p/${resume.slug}`}
          className="group flex items-center justify-between gap-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-2.5"
        >
          <span className="min-w-0">
            <span className="block text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Continue reading
            </span>
            <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[var(--accent)]">
              {resume.title}
            </span>
          </span>
          <span className="shrink-0 text-xs tabular-nums text-amber-600 dark:text-amber-400">
            {Math.round(history[resume.slug].p * 100)}%
          </span>
        </Link>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
        <span className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden" aria-hidden>
          <span
            className="block h-full rounded-full bg-emerald-500"
            style={{ width: `${(readCount / Math.max(posts.length, 1)) * 100}%` }}
          />
        </span>
        <span className="tabular-nums">
          {readCount} / {posts.length} posts read
        </span>
      </div>
    </div>
  );
}
