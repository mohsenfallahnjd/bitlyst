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

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenize(query: string): string[] {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) {
    return 0;
  }
  let count = 0;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    count++;
    idx = haystack.indexOf(needle, idx + needle.length);
  }
  return count;
}

function fuzzySubsequenceScore(text: string, query: string): number {
  // Very light fuzzy: characters of query appear in order within text
  if (!query) {
    return 0;
  }
  let i = 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  for (let j = 0; j < t.length && i < q.length; j++) {
    if (t[j] === q[i]) {
      i++;
    }
  }
  return i === q.length ? Math.min(2, Math.ceil(q.length / 8)) : 0; // small bonus
}

function buildExcerpt(content: string, terms: string[], maxLen = 180): string {
  if (!content) {
    return "";
  }
  const lower = content.toLowerCase();
  let bestIdx = 0;
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx !== -1) {
      bestIdx = idx;
      break;
    }
  }
  const start = Math.max(0, bestIdx - Math.floor(maxLen / 2));
  const end = Math.min(content.length, start + maxLen);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return `${prefix}${content.slice(start, end).trim()}${suffix}`;
}

function highlight(text: string, terms: string[]) {
  if (!terms.length || !text) {
    return <>{text}</>;
  }
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, idx) =>
        terms.some((t) => part.toLowerCase() === t.toLowerCase()) ? (
          <mark key={idx} className="bg-yellow-200 dark:bg-yellow-700/40 px-0.5 rounded">
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
  if (!terms.length) {
    return 0;
  }
  const title = doc.title.toLowerCase();
  const summary = (doc.summary || "").toLowerCase();
  const tags = (doc.tags || []).map((t) => t.toLowerCase());
  const content = (doc.content || "").toLowerCase();

  let score = 0;

  for (const term of terms) {
    score += countOccurrences(title, term) * 7;
    score += countOccurrences(summary, term) * 4;
    score += tags.reduce((acc, t) => acc + (t.includes(term) ? 5 : 0), 0);
    // Cheap content scoring, limited weight
    score += Math.min(3, countOccurrences(content, term));
  }

  // Bonus for full query subsequence in title
  score += fuzzySubsequenceScore(title, rawQuery) * 3;
  // Slight freshness/pinned bonus could be added in future using metadata

  return score;
}

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export default function SearchClient({ docs, initialQuery }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const debouncedQuery = useDebounced(deferredQuery, 200);
  const firstRenderRef = useRef(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    const q = debouncedQuery.trim();
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    router.replace(`/search${qs}`);
  }, [debouncedQuery, router]);

  // Keyboard: focus search with '/'
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
        const isTyping =
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          (e.target as HTMLElement | null)?.isContentEditable;
        if (!isTyping) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const terms = useMemo(() => tokenize(debouncedQuery), [debouncedQuery]);

  const results = useMemo(() => {
    if (!terms.length) {
      return [] as Array<{ doc: SearchDoc; score: number; excerpt: string }>;
    }
    const ranked = docs
      .map((doc) => {
        const score = scoreDoc(doc, terms, debouncedQuery);
        return {
          doc,
          score,
          excerpt: buildExcerpt(doc.summary || doc.content, terms, 180),
        };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    return ranked;
  }, [docs, debouncedQuery, terms]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          className="w-full rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          ref={inputRef}
          autoFocus
        />
        <button
          onClick={() => setQuery("")}
          className="rounded-md border px-3 py-2 text-sm text-gray-600 dark:text-gray-300"
          type="button"
          aria-label="Clear search"
        >
          Clear
        </button>
      </div>

      {debouncedQuery && (
        <p className="text-sm text-gray-500">
          {results.length} result{results.length === 1 ? "" : "s"} for “{debouncedQuery.trim()}”
        </p>
      )}

      {!debouncedQuery && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>Quick suggestions:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from(
              new Set(
                docs
                  .flatMap((d) => d.tags || [])
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            )
              .slice(0, 12)
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="rounded-full border px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
                  type="button"
                  aria-label={`Search for ${tag}`}
                >
                  #{tag}
                </button>
              ))}
          </div>
        </div>
      )}

      <ul className="grid gap-4">
        {results.map(({ doc, excerpt }) => (
          <li key={doc.slug} className="rounded-lg border p-4">
            <a href={`/blog/${doc.slug}`} className="text-lg font-semibold hover:underline">
              {highlight(doc.title, terms)}
            </a>
            {!!doc.tags?.length && (
              <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-500">
                {doc.tags.map((t) => (
                  <span key={t} className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5">
                    {highlight(t, terms)}
                  </span>
                ))}
              </div>
            )}
            {excerpt && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{highlight(excerpt, terms)}</p>}
          </li>
        ))}
      </ul>

      {debouncedQuery && results.length === 0 && (
        <p className="text-sm text-gray-500">No results. Try a different keyword or a broader term.</p>
      )}
    </div>
  );
}
