import type { Metadata } from "next";
import Link from "next/link";
import BlogList from "@/app/_components/BlogList";
import TagsFilter from "@/components/TagsFilter";
import { useBlogIndex } from "@/lib/useBlogIndex";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog — JavaScript, React, and Next.js tips",
  alternates: { canonical: "https://bitlyst.vercel.app/blog" },
  openGraph: {
    title: "Bitlyst Blog — JavaScript, React, and Next.js tips",
    description: "Browse bite-sized tutorials and practical tips on JavaScript, React, and Next.js.",
    url: "https://bitlyst.vercel.app/blog",
    siteName: "Bitlyst Blog",
    type: "website",
    images: "/logo.svg",
    locale: "en_US",
    countryName: "United States",
  },
};

export default async function BlogIndex() {
  const { posts, tags, tag, author } = await useBlogIndex({});

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
      <BlogList posts={posts} />
    </div>
  );
}
