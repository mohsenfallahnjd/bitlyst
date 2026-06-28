"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

export type SearchDoc = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
};

type Props = {
  docs: SearchDoc[];
  initialQuery: string;
};

// ── helpers ────────────────────────────────────────────────────

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenize(query: string): string[] {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) { return 0; }
  let count = 0;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) { count++; idx = haystack.indexOf(needle, idx + needle.length); }
  return count;
}

function fuzzySubsequenceScore(text: string, query: string): number {
  if (!query) { return 0; }
  let i = 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  for (let j = 0; j < t.length && i < q.length; j++) { if (t[j] === q[i]) { i++; } }
  return i === q.length ? Math.min(2, Math.ceil(q.length / 8)) : 0;
}

function buildExcerpt(content: string, terms: string[], maxLen = 160): string {
  if (!content) { return ""; }
  const lower = content.toLowerCase();
  let bestIdx = 0;
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx !== -1) { bestIdx = idx; break; }
  }
  const start = Math.max(0, bestIdx - Math.floor(maxLen / 2));
  const end = Math.min(content.length, start + maxLen);
  return `${start > 0 ? "…" : ""}${content.slice(start, end).trim()}${end < content.length ? "…" : ""}`;
}

function highlight(text: string, terms: string[]) {
  if (!terms.length || !text) { return <>{text}</>; }
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, idx) =>
        terms.some((t) => part.toLowerCase() === t.toLowerCase()) ? (
          <mark key={idx} className="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-900 dark:text-cyan-100 rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
}

function scoreDoc(doc: SearchDoc, terms: string[], rawQuery: string): number {
  if (!terms.length) { return 0; }
  const title = doc.title.toLowerCase();
  const summary = (doc.summary || "").toLowerCase();
  const tags = (doc.tags || []).map((t) => t.toLowerCase());
  const content = (doc.content || "").toLowerCase();
  let score = 0;
  for (const term of terms) {
    score += countOccurrences(title, term) * 7;
    score += countOccurrences(summary, term) * 4;
    score += tags.reduce((acc, t) => acc + (t.includes(term) ? 5 : 0), 0);
    score += Math.min(3, countOccurrences(content, term));
  }
  score += fuzzySubsequenceScore(title, rawQuery) * 3;
  return score;
}

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => { setDebounced(value); }, delayMs);
    return () => { clearTimeout(id); };
  }, [value, delayMs]);
  return debounced;
}

// ── component ──────────────────────────────────────────────────

export default function SearchClient({ docs, initialQuery }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const debouncedQuery = useDebounced(deferredQuery, 180);
  const firstRenderRef = useRef(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (firstRenderRef.current) { firstRenderRef.current = false; return; }
    const q = debouncedQuery.trim();
    router.replace(`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }, [debouncedQuery, router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) { return; }
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || tag === "select" || (e.target as HTMLElement | null)?.isContentEditable;
      if (!isTyping) { e.preventDefault(); inputRef.current?.focus(); }
    }
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); };
  }, []);

  const terms = useMemo(() => tokenize(debouncedQuery), [debouncedQuery]);

  const results = useMemo(() => {
    if (!terms.length) { return [] as Array<{ doc: SearchDoc; score: number; excerpt: string }>; }
    return docs
      .map((doc) => ({ doc, score: scoreDoc(doc, terms, debouncedQuery), excerpt: buildExcerpt(doc.summary || doc.content, terms) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }, [docs, debouncedQuery, terms]);

  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const doc of docs) { for (const t of doc.tags ?? []) { counts[t] = (counts[t] ?? 0) + 1; } }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([t]) => t);
  }, [docs]);

  const isEmpty = !debouncedQuery.trim();

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="relative">
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-gray-500 pointer-events-none"
        >
          <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
        </svg>

        <input
          ref={inputRef}
          name="q"
          value={query}
          onChange={(e) => { setQuery(e.target.value); }}
          placeholder="Search posts, tags, or topics…"
          autoFocus
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-10 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 dark:focus:border-cyan-600 transition"
        />

        {query ? (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Clear search"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        ) : (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 leading-none pointer-events-none">
            /
          </kbd>
        )}
      </div>

      {/* Results count */}
      {!isEmpty && results.length > 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300">&ldquo;{debouncedQuery.trim()}&rdquo;</span>
        </p>
      )}

      {/* Empty state — popular topics */}
      {isEmpty && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Popular topics
          </p>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => { setQuery(tag); }}
                className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <ul className="space-y-0.5">
          {results.map(({ doc, excerpt }) => (
            <li key={doc.slug}>
              <a
                href={`/blog/${doc.slug}`}
                className="group block -mx-3 rounded-xl px-3 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900/60 border border-transparent hover:border-gray-100 dark:hover:border-gray-800/60 transition-all"
              >
                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {doc.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] text-gray-400 dark:text-gray-500">
                        {highlight(`#${t}`, terms)}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors leading-snug">
                  {highlight(doc.title, terms)}
                </p>
                {excerpt && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {highlight(excerpt, terms)}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {!isEmpty && results.length === 0 && (
        <div className="py-14 text-center space-y-2">
          <div className="text-3xl opacity-30">🔍</div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            No results for &ldquo;{debouncedQuery.trim()}&rdquo;
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Try a shorter keyword or browse by topic</p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {topTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => { setQuery(tag); }}
                className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
