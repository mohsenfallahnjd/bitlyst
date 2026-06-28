import Link from "next/link";
import FeaturedPostCard from "@/components/FeaturedPostCard";
import PostCard from "@/components/PostCard";
import type { DocMeta } from "@/lib/mdSource";

export default function HomePosts({
  posts,
  tag,
  topTags,
}: {
  posts: DocMeta[];
  tag?: string;
  topTags?: { name: string; key: string }[];
}) {
  const filtered = tag
    ? posts.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase()))
    : posts;

  const shown = filtered.slice(0, tag ? 8 : 7);
  const [featured, ...rest] = shown;

  return (
    <div className="space-y-6">
      {/* Tag chips */}
      {topTags && topTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className={`text-xs rounded-full px-3 py-1 border transition-colors ${
              !tag
                ? "border-cyan-600 bg-cyan-50/60 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 dark:border-cyan-400"
                : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            All
          </Link>
          {topTags.map((t) => {
            const isActive = tag?.toLowerCase() === t.key;
            return (
              <Link
                key={t.key}
                href={`/?tag=${encodeURIComponent(t.name)}`}
                className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                  isActive
                    ? "border-cyan-600 bg-cyan-50/60 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 dark:border-cyan-400"
                    : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                #{t.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* No results */}
      {shown.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No posts tagged &ldquo;{tag}&rdquo;.{" "}
          <Link href="/" className="underline">
            Clear filter
          </Link>
        </p>
      )}

      {/* Featured post */}
      {featured && !tag && (
        <div style={{ animation: "fadeUp 0.5s ease-out both" }}>
          <FeaturedPostCard post={featured} />
        </div>
      )}

      {/* Remaining posts */}
      {(tag ? shown : rest).length > 0 && (
        <div>
          {!tag && (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              More posts
            </p>
          )}
          <div className="grid gap-1">
            {(tag ? shown : rest).map((p, i) => (
              <div
                key={p.slug}
                style={{ animation: "fadeUp 0.5s ease-out both", animationDelay: `${(i + 1) * 55}ms` }}
              >
                <PostCard post={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
