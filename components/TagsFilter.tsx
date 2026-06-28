"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export type TagItem = {
  key: string;
  name: string;
  count: number;
};

type TagsFilterProps = {
  tags: TagItem[];
  selectedTag?: string;
};

export default function TagsFilter({ tags }: TagsFilterProps) {
  const sp = useSearchParams();
  const selectedTag = sp.get("tag")?.toLowerCase() ?? "";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    [tags],
  );

  const topTen = useMemo(() => sortedTags.slice(0, 10), [sortedTags]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) { return sortedTags; }
    return sortedTags.filter((t) => t.name.toLowerCase().includes(q));
  }, [sortedTags, query]);

  useEffect(() => {
    if (!open) { return; }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); }
    }
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); };
  }, [open]);

  const pillBase = "inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1 border transition-colors";
  const pillActive = "border-teal-600 dark:border-teal-400 bg-teal-50/60 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 font-medium";
  const pillIdle = "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {/* All pill */}
        <Link
          href="/blog"
          className={`${pillBase} ${!selectedTag ? pillActive : pillIdle}`}
        >
          All
          <span className={`rounded-full px-1.5 py-px text-[10px] leading-none ${!selectedTag ? "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
            {tags.reduce((s, t) => s + t.count, 0)}
          </span>
        </Link>

        {topTen.map((t) => {
          const isSelected = t.key === (selectedTag || "");
          return (
            <Link
              key={t.key}
              href={isSelected ? "/blog" : `/blog?tag=${encodeURIComponent(t.name)}`}
              className={`${pillBase} ${isSelected ? pillActive : pillIdle}`}
              title={`${t.count} post${t.count !== 1 ? "s" : ""}`}
            >
              #{t.name}
              <span className={`rounded-full px-1.5 py-px text-[10px] leading-none ${isSelected ? "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                {t.count}
              </span>
            </Link>
          );
        })}

        {sortedTags.length > 10 && (
          <button
            type="button"
            onClick={() => { setOpen(true); }}
            className={`${pillBase} ${pillIdle}`}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            +{sortedTags.length - 10} more
          </button>
        )}
      </div>

      {/* All-tags modal */}
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="All tags">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setOpen(false); }} />
          <div className="absolute inset-x-4 bottom-0 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-24 md:w-[480px] bg-white dark:bg-gray-950 rounded-t-2xl md:rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-semibold">All topics</h2>
              <button
                type="button"
                onClick={() => { setOpen(false); }}
                className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="size-4 text-gray-400">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}
                placeholder="Search topics…"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 placeholder:text-gray-400"
              />

              <div className="max-h-[55vh] overflow-y-auto -mx-1 px-1">
                <ul className="space-y-px">
                  {filtered.map((t) => {
                    const isSelected = t.key === (selectedTag || "");
                    return (
                      <li key={t.key}>
                        <Link
                          href={`/blog?tag=${encodeURIComponent(t.name)}`}
                          onClick={() => { setOpen(false); }}
                          className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors ${
                            isSelected
                              ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300"
                              : "hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span className="text-sm">#{t.name}</span>
                          <span className="text-[11px] rounded-full px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400">
                            {t.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                  {filtered.length === 0 && (
                    <li className="py-6 text-center text-sm text-gray-400">No topics match &ldquo;{query}&rdquo;</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
