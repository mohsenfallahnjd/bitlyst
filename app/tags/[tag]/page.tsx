import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import { loadMarkdownDocs, toSummary } from "@/lib/mdSource";
import { getPostStats } from "@/lib/stats";
import { getAllTopics, getPostsByTopic, MIN_INDEXABLE_POSTS } from "@/lib/tags";


export function generateStaticParams() {
  return getAllTopics().map((t) => ({ tag: t.slug }));
}

function findTopic(slug: string) {
  return getAllTopics().find((t) => t.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/tags/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const topic = findTopic(tag);
  if (!topic) {
    return {};
  }
  const title = `${topic.name} — ${topic.count} post${topic.count > 1 ? "s" : ""}`;
  const description = `Bite-sized ${topic.name} articles on Bitlyst: ${getPostsByTopic(tag)
    .slice(0, 3)
    .map((p) => p.title)
    .join(", ")}.`;
  return {
    title,
    description,
    alternates: { canonical: `/tags/${topic.slug}` },
    // single-post topics are thin pages — keep them out of the index, still crawlable
    robots: topic.count < MIN_INDEXABLE_POSTS ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: `/tags/${topic.slug}`, type: "website", siteName: "Bitlyst" },
  };
}

export default async function TopicPage({ params }: PageProps<"/tags/[tag]">) {
  const { tag } = await params;
  const all = loadMarkdownDocs();
  const topic = findTopic(tag);
  if (!topic) {
    notFound();
  }
  const posts = getPostsByTopic(tag, all);
  const stats = await getPostStats();
  const related = getAllTopics(posts)
    .filter((t) => t.slug !== tag)
    .slice(0, 8);

  const url = `https://bitlyst.vercel.app/tags/${topic.slug}`;

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${topic.name} posts`,
            url,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: posts.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://bitlyst.vercel.app/blog/${p.slug}`,
                name: p.title,
              })),
            },
          }),
        }}
      />

      <div className="space-y-2">
        <Link href="/tags" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          ← All topics
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">#{topic.name}</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {topic.count} post{topic.count > 1 ? "s" : ""}
        </p>
      </div>

      <div>
        {posts.map((p) => (
          <PostCard key={p.slug} post={toSummary(p)} views={stats.views[p.slug]} comments={stats.comments[p.slug]} />
        ))}
      </div>

      {related.length > 0 && (
        <div className="pt-6 border-t border-gray-200/70 dark:border-gray-800/60">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            Related topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/tags/${t.slug}`}
                className="rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
