import Link from "next/link";
import { useBlogIndex } from "@/lib/useBlogIndex";

type Post = { slug: string; title: string };

export default async function PostNav({ current }: { current: string }) {
  const { posts } = await useBlogIndex({});
  const index = posts.findIndex((p) => p.slug === current);
  const prev = index >= 0 && index < posts.length - 1 ? posts[index + 1] : (null as Post | null);
  const next = index > 0 ? posts[index - 1] : null;

  if (index === -1) {
    return null;
  }

  return (
    <nav className="mt-12 grid grid-cols-2 items-center gap-4 border-t pt-6 text-sm">
      <div className="min-w-0">
        {prev && (
          <Link
            href={`/blog/${prev.slug}`}
            className="group inline-flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-900 max-w-full min-w-0"
            rel="prev"
            aria-label={`Previous: ${prev.title}`}
          >
            <span className="shrink-0 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
              ←
            </span>
            <span className="min-w-0 max-w-full overflow-hidden">
              <span className="block text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Previous
              </span>
              <span className="block font-medium text-gray-900 dark:text-gray-100 truncate">{prev.title}</span>
            </span>
          </Link>
        )}
      </div>
      <div className="min-w-0 text-right">
        {next && (
          <Link
            href={`/blog/${next.slug}`}
            className="group inline-flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-900 max-w-full min-w-0"
            rel="next"
            aria-label={`Next: ${next.title}`}
          >
            <span className="min-w-0 max-w-full overflow-hidden text-right">
              <span className="block text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Next</span>
              <span className="block font-medium text-gray-900 dark:text-gray-100 truncate">{next.title}</span>
            </span>
            <span className="shrink-0 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
              →
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
