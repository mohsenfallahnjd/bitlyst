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
    <div className="space-y-8">
      {/* Tag filter */}
      {topTags && topTags.length > 0 && (
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <Link
            href="/"
            className={`text-xs transition-colors ${
              !tag
                ? "text-gray-900 dark:text-gray-100 font-medium"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
                className={`text-xs transition-colors ${
                  isActive
                    ? "text-gray-900 dark:text-gray-100 font-medium"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t.name}
              </Link>
            );
          })}
        </div>
      )}

      {shown.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No posts tagged &ldquo;{tag}&rdquo;.{" "}
          <Link href="/" className="underline underline-offset-2">Clear</Link>
        </p>
      )}

      {/* Featured */}
      {featured && !tag && <FeaturedPostCard post={featured} />}

      {/* List */}
      {(tag ? shown : rest).length > 0 && (
        <div>
          {(tag ? shown : rest).map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
