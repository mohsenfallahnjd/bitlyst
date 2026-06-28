import Link from "next/link";
import PostCard from "@/components/PostCard";
import type { DocMeta } from "@/lib/mdSource";

export default function HomePosts({ posts, tag }: { posts: DocMeta[]; tag?: string }) {
  const filtered = tag
    ? posts.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase()))
    : posts;

  return (
    <>
      <div className="grid gap-6">
        {filtered.slice(0, 6).map((p, i) => (
          <div key={p.slug} style={{ animation: "fadeUp 0.5s ease-out both", animationDelay: `${i * 65}ms` }}>
            <PostCard post={p} />
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center gap-3 text-sm">
        {tag && (
          <Link
            href="/"
            className="rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Clear "{tag}"
          </Link>
        )}
      </div>
    </>
  );
}
