"use client";

import { READ_THRESHOLD, useReader } from "@/lib/reader";
import { CheckIcon } from "./StatIcons";

/** "New" for posts published since the previous visit, "Read" / progress for opened ones. */
export default function ReadBadge({ slug, publishedTime }: { slug: string; publishedTime?: string }) {
  const reader = useReader();
  if (!reader) {
    return null;
  }

  const entry = reader.history[slug];
  if (entry && entry.p >= READ_THRESHOLD) {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <CheckIcon className="size-3" />
        Read
      </span>
    );
  }
  if (entry && entry.p >= 0.1) {
    return <span className="text-amber-600 dark:text-amber-400">{Math.round(entry.p * 100)}% read</span>;
  }
  if (publishedTime && reader.prevVisit && new Date(publishedTime).getTime() > reader.prevVisit) {
    return (
      <span className="rounded-full bg-[var(--accent)] px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-white">
        New
      </span>
    );
  }
  return null;
}
