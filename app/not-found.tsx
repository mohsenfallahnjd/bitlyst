import Link from "next/link";
import { loadMarkdownDocs } from "@/lib/mdSource";

export default function NotFound() {
  const latest = loadMarkdownDocs().slice(0, 4);

  return (
    <div className="mx-auto max-w-[36rem] space-y-10 py-12">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">404</p>
        <h1 className="text-3xl font-extrabold tracking-tight">This page took a different code path.</h1>
        <p className="text-gray-500 dark:text-gray-400">
          It may have been moved or renamed. Search for it, or pick up one of the latest posts.
        </p>
      </div>

      <form action="/search" method="GET" className="flex gap-2">
        <input
          name="q"
          type="search"
          required
          placeholder="Search posts…"
          aria-label="Search posts"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          className="rounded-lg bg-gray-900 dark:bg-gray-100 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:opacity-90"
        >
          Search
        </button>
      </form>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Latest posts</p>
        <ul>
          {latest.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block border-b border-gray-200/70 dark:border-gray-800/60 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="mt-4 inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
