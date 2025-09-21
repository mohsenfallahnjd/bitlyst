import "server-only";

import type { DocMeta } from "@/lib/mdSource";

export type SearchResult = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  score: number;
  excerpt: string;
};

export function tokenize(query: string): string[] {
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
  return i === q.length ? Math.min(2, Math.ceil(q.length / 8)) : 0;
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

function scoreDoc(doc: DocMeta, terms: string[], rawQuery: string): number {
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
    score += Math.min(3, countOccurrences(content, term));
  }

  score += fuzzySubsequenceScore(title, rawQuery) * 3;
  return score;
}

export function searchDocs(query: string, docs: DocMeta[], limit = 50): SearchResult[] {
  const terms = tokenize(query);
  if (!terms.length) {
    return [];
  }
  const ranked = docs
    .map((doc) => {
      const score = scoreDoc(doc, terms, query);
      return {
        slug: doc.slug,
        title: doc.title,
        summary: doc.summary || "",
        tags: doc.tags || [],
        score,
        excerpt: buildExcerpt(doc.summary || doc.content, terms, 180),
      } satisfies SearchResult;
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return ranked;
}
