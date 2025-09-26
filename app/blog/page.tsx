import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import TagsFilter from "@/components/TagsFilter";
import { useBlogIndex } from "@/lib/useBlogIndex";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "https://bitlyst.vercel.app/blog" },
  openGraph: {
    title: "Bitlyst Blog",
    description: "Bite-sized tech tips—simple, minimal, useful.",
    url: "https://bitlyst.vercel.app/blog",
    siteName: "Bitlyst Blog",
    type: "website",
    images: "/logo.svg",
    locale: "en_US",
    countryName: "United States",
  },
};

export default async function BlogIndex({ searchParams }: PageProps<"/blog">) {
  const { posts, tags, tag, author } = await useBlogIndex(searchParams);

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
