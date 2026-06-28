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
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Related posts</h3>
      <div className="flex flex-col gap-3">
        {related.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group rounded-lg border border-gray-100 dark:border-gray-800 px-4 py-3 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors"
          >
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {p.title}
            </p>
            {p.summary && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{p.summary}</p>
            )}
            {p.tags && p.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {p.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500 dark:text-gray-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
