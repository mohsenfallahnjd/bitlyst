import type { Metadata } from "next";
import BlogList from "@/app/_components/BlogList";
import LevelFilter from "@/components/LevelFilter";
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
  const { posts, tags, all } = await useBlogIndex({});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">All posts</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {all.length} posts · {tags.length} topics
        </p>
      </div>

      {/* Level filter — client component reads ?level= itself */}
      <LevelFilter />

      {/* Tag filter — client component reads ?tag= itself */}
      <TagsFilter tags={tags} />

      {/* Post list — client component reads ?tag= / ?level= itself */}
      <BlogList posts={posts} />
    </div>
  );
}
