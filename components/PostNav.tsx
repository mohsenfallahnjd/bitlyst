import Link from "next/link";
import { useBlogIndex } from "@/lib/useBlogIndex";

type Post = { slug: string; title: string };

export default async function PostNav({ current }: { current: string }) {
  const { posts } = await useBlogIndex({});
  const index = posts.findIndex((p) => p.slug === current);
  const prev = index >= 0 && index < posts.length - 1 ? posts[index + 1] : (null as Post | null);
  const next = index > 0 ? posts[index - 1] : null;

  if (index === -1 || (!prev && !next)) return null;

  return (
    <nav className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800/60 flex items-start justify-between gap-6 text-sm">
      <div className="min-w-0 flex-1">
        {prev && (
          <Link href={`/blog/${prev.slug}`} rel="prev" className="group block">
            <span className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">← Previous</span>
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors line-clamp-2 leading-snug">
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div className="min-w-0 flex-1 text-right">
        {next && (
          <Link href={`/blog/${next.slug}`} rel="next" className="group block">
            <span className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">Next →</span>
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors line-clamp-2 leading-snug">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
