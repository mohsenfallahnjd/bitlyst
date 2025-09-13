import Link from "next/link";
import PostCard from "@/components/PostCard";
import type { DocMeta } from "@/lib/mdSource";
import { loadMarkdownDocs } from "@/lib/mdSource";

export const metadata = { title: "Blog" };

export default async function BlogIndex({ searchParams }: PageProps<"/blog">) {
  const all = loadMarkdownDocs();
  const awaitSearchParams = await searchParams;
  const tag = awaitSearchParams?.tag?.toString()?.toLowerCase() || "";
  const author = awaitSearchParams?.author?.toString()?.toLowerCase()?.replaceAll(" ", "-") || "";
  const posts = tag
    ? all.filter((p) => (p.tags || []).some((t: string) => t.toLowerCase() === tag))
    : author
      ? all.filter((p) =>
          p.authors?.some((a: { name: string }) => a.name.toLowerCase().replaceAll(" ", "-") === author)
        )
      : all;

  const uniqueTags = Array.from(new Set(all.flatMap((p: DocMeta) => p.tags || []))).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{tag ? `Posts tagged “${tag}”` : "All posts"}</h1>

        {/* Active filter pill */}
        {tag && (
          <Link
            href="/blog"
            className="text-xs rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1
                       hover:bg-gray-50 dark:hover:bg-gray-900"
            aria-label="Clear tag filter"
            title="Clear tag filter"
          >
            Clear filter ✕
          </Link>
        )}
        {author && (
          <Link
            href="/blog"
            className="text-xs rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1
                       hover:bg-gray-50 dark:hover:bg-gray-900"
            aria-label="Clear author filter"
            title="Clear author filter"
          >
            Clear filter ✕
          </Link>
        )}
      </div>

      {/* Tag cloud */}
      <div className="flex flex-wrap gap-2">
        {uniqueTags.map((t) => (
          <Link
            key={t}
            href={`/blog?tag=${encodeURIComponent(t)}`}
            className={`text-xs rounded-full px-3 py-1 border
                        ${
                          t.toLowerCase() === tag
                            ? "border-cyan-600 text-cyan-700 dark:text-cyan-300 dark:border-cyan-400 bg-cyan-50/60 dark:bg-cyan-950/30"
                            : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                        }`}
          >
            #{t}
          </Link>
        ))}
      </div>

      {/* List */}
      {posts.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No posts for “{tag}”.{" "}
          <Link className="underline" href="/blog">
            See all posts
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
