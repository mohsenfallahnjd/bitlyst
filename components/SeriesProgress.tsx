"use client";

import Link from "next/link";
import { READ_THRESHOLD, useReader } from "@/lib/reader";

/** Personal progress through a series + a "start / continue" button. */
export default function SeriesProgress({
  parts,
  compact = false,
}: {
  parts: { slug: string; title: string }[];
  compact?: boolean;
}) {
  const reader = useReader();
  if (parts.length === 0) {
    return null;
  }

  const read = reader ? parts.filter((p) => (reader.history[p.slug]?.p ?? 0) >= READ_THRESHOLD).length : 0;
  const nextPart = reader ? (parts.find((p) => (reader.history[p.slug]?.p ?? 0) < READ_THRESHOLD) ?? null) : parts[0];
  const started = read > 0 || (reader ? parts.some((p) => reader.history[p.slug]) : false);

  const bar = (
    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200/80 dark:bg-gray-800" aria-hidden>
        <span
          className="block h-full rounded-full bg-emerald-500 transition-[width] duration-500"
          style={{ width: `${(read / parts.length) * 100}%` }}
        />
      </span>
      <span className="tabular-nums">
        {read}/{parts.length} read
      </span>
    </div>
  );

  if (compact) {
    return bar;
  }

  return (
    <div className="space-y-3">
      {bar}
      {nextPart ? (
        <Link
          href={`/p/${nextPart.slug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-gray-100 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:opacity-90 transition-opacity"
        >
          {started ? "Continue" : "Start reading"}: Part {parts.indexOf(nextPart) + 1} →
        </Link>
      ) : (
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          You&apos;ve read every part so far 🎉 New ones are on the way.
        </p>
      )}
    </div>
  );
}
