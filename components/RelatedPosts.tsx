import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";
import { loadMarkdownDocs } from "@/lib/mdSource";

function getRelated(current: DocMeta, all: DocMeta[], limit = 3): DocMeta[] {
  const currentTags = new Set((current.tags ?? []).map((t) => t.toLowerCase()));
  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      post: p,
      score: (p.tags ?? []).filter((t) => currentTags.has(t.toLowerCase())).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export default function RelatedPosts({ current }: { current: DocMeta }) {
  const all = loadMarkdownDocs();
  const related = getRelated(current, all);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800/60">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Related</p>
      <div className="space-y-3">
        {related.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group flex items-start justify-between gap-4"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors leading-snug">
              {p.title}
            </p>
            <span className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors shrink-0 text-sm">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
