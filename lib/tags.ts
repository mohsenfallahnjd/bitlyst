import "server-only";

import { tagSlug } from "@/lib/format";
import { type DocMeta, loadMarkdownDocs } from "@/lib/mdSource";

export type Topic = { slug: string; name: string; count: number };

/** Topics with at least this many posts get an indexable page + sitemap entry. */
export const MIN_INDEXABLE_POSTS = 2;

export function getAllTopics(posts: DocMeta[] = loadMarkdownDocs()): Topic[] {
  const bySlug = new Map<string, Topic>();
  for (const post of posts) {
    // a post tagged both "event loop" and "event-loop" counts once
    for (const slug of new Set((post.tags ?? []).map(tagSlug))) {
      if (!slug) {
        continue;
      }
      const name = post.tags?.find((t) => tagSlug(t) === slug) ?? slug;
      const topic = bySlug.get(slug);
      if (topic) {
        topic.count++;
      } else {
        bySlug.set(slug, { slug, name, count: 1 });
      }
    }
  }
  return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getPostsByTopic(slug: string, posts: DocMeta[] = loadMarkdownDocs()): DocMeta[] {
  return posts.filter((p) => (p.tags ?? []).some((t) => tagSlug(t) === slug));
}
