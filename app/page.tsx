import Link from "next/link";
import HomePosts from "@/app/_components/HomePosts";
import { loadMarkdownDocs } from "@/lib/mdSource";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { tag } = await searchParams;
  const all = loadMarkdownDocs();

  const tagCount: Record<string, number> = {};
  for (const post of all) {
    for (const t of post.tags ?? []) {
      tagCount[t] = (tagCount[t] ?? 0) + 1;
    }
  }
  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => ({ name, key: name.toLowerCase() }));

  return (
    <section className="space-y-12">
      {/* Hero */}
      <div className="space-y-3 pt-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-gray-900 dark:text-gray-50">
          Bite-sized JavaScript,{" "}
          <span className="text-gray-400 dark:text-gray-500">React & Next.js</span>{" "}
          tips.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Short posts with code and diagrams. Readable in minutes.
        </p>
      </div>

      <HomePosts
        posts={all}
        tag={(tag as string | undefined) ?? undefined}
        topTags={topTags}
      />

      <div className="pt-2 border-t border-gray-100 dark:border-gray-800/50">
        <Link
          href="/blog"
          className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          All {all.length} posts →
        </Link>
      </div>
    </section>
  );
}
