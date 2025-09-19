import Link from "next/link";
import PostCard from "@/components/PostCard";
import TagsFilter from "@/components/TagsFilter";
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="md:text-2xl text-xl font-semibold tracking-tight flex-1">
          {tag ? `Posts tagged “${tag}”` : "All posts"}
        </h1>

        {/* Active filter pill */}
        {tag && (
          <Link
            style={{ width: 98 }}
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
            style={{ width: 98 }}
            href="/blog"
            className="text-xs rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-900"
            aria-label="Clear author filter"
            title="Clear author filter"
          >
            Clear filter ✕
          </Link>
        )}
      </div>

      {/* Tags filter */}
      <TagsFilter tags={tags} selectedTag={tag} />

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
