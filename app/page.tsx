import Link from "next/link";
import HomePosts from "@/app/_components/HomePosts";
import { loadMarkdownDocs } from "@/lib/mdSource";

export const dynamic = "force-static";

export default async function HomePage() {
  const all = loadMarkdownDocs();

  return (
    <section className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bite-sized{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-500">
            JavaScript, React, and Next.js
          </span>{" "}
          tips.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Clear, minimal explanations with code and diagrams you can read in minutes.
        </p>
      </div>

      <HomePosts posts={all} />

      <div className="pt-1 flex items-center gap-3 text-sm">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
        >
          Browse all {all.length} posts →
        </Link>
      </div>
    </section>
  );
}
