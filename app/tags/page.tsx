import type { Metadata } from "next";
import Link from "next/link";
import { getAllTopics } from "@/lib/tags";

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse Bitlyst posts by topic: JavaScript, React, Next.js, performance, async, TypeScript and more.",
  alternates: { canonical: "/tags" },
};

export default function TopicsPage() {
  const topics = getAllTopics();
  const max = topics[0]?.count ?? 1;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Topics</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">{topics.length} topics</p>
      </div>

      <ul className="grid gap-x-8 sm:grid-cols-2">
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/tags/${t.slug}`}
              className="group flex items-center gap-3 border-b border-gray-200/70 dark:border-gray-800/60 py-3"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[var(--accent)] transition-colors">
                #{t.name}
              </span>
              <span className="flex-1 h-1 rounded-full bg-gray-100 dark:bg-gray-800/70 overflow-hidden" aria-hidden>
                <span
                  className="block h-full rounded-full bg-gray-300 dark:bg-gray-600"
                  style={{ width: `${(t.count / max) * 100}%` }}
                />
              </span>
              <span className="text-xs tabular-nums text-gray-400 dark:text-gray-500">{t.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
