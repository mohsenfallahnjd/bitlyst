import "server-only";

import type { DocMeta } from "@/lib/mdSource";
import { loadMarkdownDocs } from "@/lib/mdSource";

export type TagItem = {
  key: string;
  name: string;
  count: number;
};

export type BlogIndexResult = {
  all: DocMeta[];
  posts: DocMeta[];
  tags: TagItem[];
  tag: string;
  author: string;
};

/**
 * Server-only hook to build Blog index data from markdown sources and URL params.
 * Accepts either an object of searchParams or a promise resolving to it (as passed by Next.js).
 */
export async function useBlogIndex(
  searchParams: Record<string, unknown> | Promise<Record<string, unknown>>
): Promise<BlogIndexResult> {
  const all = loadMarkdownDocs();
  const awaited = (await searchParams) as Record<string, unknown> | undefined;

  const rawTag = (awaited?.["tag"] ?? "") as string | string[];
  const rawAuthor = (awaited?.["author"] ?? "") as string | string[];

  const tag = Array.isArray(rawTag) ? rawTag[0] || "" : String(rawTag || "");
  const author = Array.isArray(rawAuthor) ? rawAuthor[0] || "" : String(rawAuthor || "");

  const normalizedTag = tag.toLowerCase();
  const normalizedAuthor = author.toLowerCase().replaceAll(" ", "-");

  const posts = normalizedTag
    ? all.filter((p) => (p.tags || []).some((t: string) => t.toLowerCase() === normalizedTag))
    : normalizedAuthor
      ? all.filter((p) =>
          p.authors?.some((a: { name: string }) => a.name.toLowerCase().replaceAll(" ", "-") === normalizedAuthor)
        )
      : all;

  const tagDisplayByKey: Record<string, string> = {};
  const tagCounts = all
    .flatMap((p: DocMeta) => p.tags || [])
    .reduce<Record<string, number>>((acc, raw) => {
      const display = String(raw || "");
      const key = display.toLowerCase();
      if (!key) {
        return acc;
      }
      if (!(key in tagDisplayByKey)) {
        tagDisplayByKey[key] = display;
      }
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const tags = Object.entries(tagCounts)
    .map(([key, count]) => ({ key, name: tagDisplayByKey[key] || key, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    all,
    posts,
    tags,
    tag: normalizedTag,
    author: normalizedAuthor,
  };
}
