import type { Metadata } from "next";
import { Suspense } from "react";
import BlogList from "@/app/_components/BlogList";
import LevelFilter from "@/components/LevelFilter";
import { TotalReads } from "@/components/StatCounts";
import TagsFilter from "@/components/TagsFilter";
import { loadMarkdownDocs, toSummary } from "@/lib/mdSource";
import { getAllTopics } from "@/lib/tags";

export const metadata: Metadata = {
  title: "All posts — JavaScript, React, and Next.js tips",
  description:
    "Every Bitlyst post: bite-sized tutorials on JavaScript, React, and Next.js. Sort by latest, most read or most discussed.",
  alternates: { canonical: "/posts" },
  openGraph: {
    title: "Bitlyst Blog — JavaScript, React, and Next.js tips",
    description: "Browse bite-sized tutorials and practical tips on JavaScript, React, and Next.js.",
    url: "/posts",
    siteName: "Bitlyst",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitlyst Blog — JavaScript, React, and Next.js tips",
    description: "Browse bite-sized tutorials and practical tips on JavaScript, React, and Next.js.",
  },
};

export default async function BlogIndex() {
  const all = loadMarkdownDocs();
  const topics = getAllTopics(all);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">All posts</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {all.length} posts · {topics.length} topics
          <TotalReads prefix=" · " exact />
        </p>
      </div>

      <TagsFilter tags={topics.map((t) => ({ key: t.slug, name: t.name, count: t.count }))} />

      <Suspense>
        <LevelFilter />
        <div className="mt-6">
          <BlogList posts={all.map(toSummary)} />
        </div>
      </Suspense>
    </div>
  );
}
