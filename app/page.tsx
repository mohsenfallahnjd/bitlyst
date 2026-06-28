import Link from "next/link";
import HomePosts from "@/app/_components/HomePosts";
import { loadMarkdownDocs } from "@/lib/mdSource";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { tag } = await searchParams;
  const all = loadMarkdownDocs();
  const avgRead = Math.round(all.reduce((s, p) => s + (p.readingTime ?? 0), 0) / all.length);

  // Top 8 tags by frequency
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
    <section className="space-y-10">
      {/* Hero */}
      <div className="space-y-4" style={{ animation: "fadeIn 0.6s ease-out both" }}>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight"
          style={{ animation: "fadeUp 0.55s ease-out both" }}
        >
          Bite-sized{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-500 gradient-pan">
            JavaScript, React & Next.js
          </span>{" "}
          tips.
        </h1>

        <p
          className="text-gray-500 dark:text-gray-400"
          style={{ animation: "fadeUp 0.55s ease-out both", animationDelay: "80ms" }}
        >
          Clear explanations with code and diagrams — readable in minutes.
        </p>

        {/* Stats */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 dark:text-gray-500"
          style={{ animation: "fadeUp 0.55s ease-out both", animationDelay: "150ms" }}
        >
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5 opacity-60">
              <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.062 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Z" />
            </svg>
            {all.length} posts
          </span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5 opacity-60">
              <path d="M1 5.25A2.25 2.25 0 0 1 3.25 3h9.5A2.25 2.25 0 0 1 15 5.25v5.5A2.25 2.25 0 0 1 12.75 13h-9.5A2.25 2.25 0 0 1 1 10.75ZM3.25 4.5a.75.75 0 0 0-.75.75v5.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-5.5a.75.75 0 0 0-.75-.75Zm-.5 4.25a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Zm0-2.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Z" />
            </svg>
            avg {avgRead} min read
          </span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5 opacity-60">
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
            </svg>
            free forever
          </span>
        </div>
      </div>

      <HomePosts
        posts={all}
        tag={(tag as string | undefined) ?? undefined}
        topTags={topTags}
      />

      {/* Footer CTA */}
      <div
        className="flex items-center gap-3 text-sm border-t border-gray-100 dark:border-gray-800/60 pt-6"
        style={{ animation: "fadeIn 0.6s ease-out both", animationDelay: "300ms" }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
          Browse all {all.length} posts <span className="browse-arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
