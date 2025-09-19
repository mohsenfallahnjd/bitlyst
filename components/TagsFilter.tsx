"use client";

import Link from "next/link";
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

export default function TagsFilter({ tags, selectedTag }: TagsFilterProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });
  }, [tags]);

  const topTen = useMemo(() => sortedTags.slice(0, 10), [sortedTags]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return sortedTags;
    }
    return sortedTags.filter((t) => t.name.toLowerCase().includes(q));
  }, [sortedTags, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {topTen.map((t) => {
          const isSelected = t.key === (selectedTag || "");
          return (
            <Link
              key={t.key}
              href={`/blog?tag=${encodeURIComponent(t.name)}`}
              className={`text-xs rounded-full px-3 py-1 border ${
                isSelected
                  ? "border-cyan-600 text-cyan-700 dark:text-cyan-300 dark:border-cyan-400 bg-cyan-50/60 dark:bg-cyan-950/30"
                  : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
              title={`#${t.name} (${t.count})`}
            >
              #{t.name}
            </Link>
          );
        })}

        {sortedTags.length > 10 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs rounded-full px-3 py-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            View all tags ({sortedTags.length})
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-20 md:w-[520px] bottom-0 md:bottom-auto bg-white dark:bg-neutral-900 rounded-t-2xl md:rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-sm font-medium">All tags</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs rounded-md px-2 py-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Close
              </button>
            </div>

            <div className="p-4 space-y-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tags..."
                className="w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30"
              />

              <div className="max-h-[60vh] overflow-auto">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.map((t) => {
                    const isSelected = t.key === (selectedTag || "");
                    return (
                      <li key={t.key}>
                        <Link
                          href={`/blog?tag=${encodeURIComponent(t.name)}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between gap-3 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md"
                        >
                          <span className={`text-sm ${isSelected ? "text-cyan-700 dark:text-cyan-300" : ""}`}>
                            #{t.name}
                          </span>
                          <span className="text-[11px] rounded-full px-2 py-0.5 border border-gray-200 dark:border-gray-800">
                            {t.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
