import Link from "next/link";
import { loadMarkdownDocs } from "@/lib/mdSource";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const all = loadMarkdownDocs();
  const awaitSearchParams = await searchParams;
  const tag = awaitSearchParams?.tag?.toString()?.toLowerCase() || "";
  const _posts = tag ? all.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === tag)) : all;

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Bite-sized JavaScript, React, and Next.js tips.</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Clear, minimal explanations with code and diagrams you can read in minutes.
        </p>
      </div>

      <div className="pt-2 flex items-center gap-3 text-sm">
        <Link href="/blog" className="underline">
          Browse all posts →
        </Link>
        {tag && (
          <Link
            href="/"
            className="rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Clear “{tag}”
          </Link>
        )}
      </div>
    </section>
  );
}
