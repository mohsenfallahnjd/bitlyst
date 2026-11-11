import type { DocMeta } from "@/lib/mdSource";
import { loadMarkdownDocs, toSummary } from "@/lib/mdSource";
import PostCard from "./PostCard";

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
  const related = getRelated(current, loadMarkdownDocs());
  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-14">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Read next</h2>
      <div>
        {related.map((p) => (
          <PostCard key={p.slug} post={toSummary(p)} />
        ))}
      </div>
    </section>
  );
}
