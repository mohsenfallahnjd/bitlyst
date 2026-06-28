import type { Metadata } from "next";
import Link from "next/link";
import BlogList from "@/app/_components/BlogList";
import TagsFilter from "@/components/TagsFilter";
import { useBlogIndex } from "@/lib/useBlogIndex";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog — JavaScript, React, and Next.js tips",
  description: "Browse bite-sized tutorials and practical tips on JavaScript, React, and Next.js.",
  alternates: { canonical: "https://bitlyst.vercel.app/blog" },
  openGraph: {
    title: "Bitlyst Blog — JavaScript, React, and Next.js tips",
    description: "Browse bite-sized tutorials and practical tips on JavaScript, React, and Next.js.",
    url: "https://bitlyst.vercel.app/blog",
    siteName: "Bitlyst",
    type: "website",
    locale: "en_US",
    countryName: "United States",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitlyst Blog — JavaScript, React, and Next.js tips",
    description: "Browse bite-sized tutorials and practical tips on JavaScript, React, and Next.js.",
  },
};

export default async function BlogIndex() {
  const { posts, tags, tag, author } = await useBlogIndex({});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="md:text-2xl text-xl font-semibold tracking-tight flex-1">
          {tag ? (
            <>Posts tagged <span className="text-cyan-600 dark:text-cyan-400">"{tag}"</span></>
          ) : (
            <>All posts <span className="text-gray-400 dark:text-gray-500 font-normal text-base">({posts.length})</span></>
          )}
        </h1>

        {tag && (
          <Link
            href="/blog"
            className="text-xs rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1.5
                       hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            aria-label="Clear tag filter"
          >
            Clear ✕
          </Link>
        )}
        {author && (
          <Link
            href="/blog"
            className="text-xs rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            aria-label="Clear author filter"
          >
            Clear ✕
          </Link>
        )}
      </div>

      <TagsFilter tags={tags} selectedTag={tag} />

      <BlogList posts={posts} />
    </div>
  );
}
