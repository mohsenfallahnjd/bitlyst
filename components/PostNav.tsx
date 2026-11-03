import Link from "next/link";
import { loadMarkdownDocs } from "@/lib/mdSource";

export default function PostNav({ current }: { current: string }) {
  const posts = loadMarkdownDocs();
  const index = posts.findIndex((p) => p.slug === current);
  if (index === -1) {
    return null;
  }
  // posts are newest-first: "previous" is older, "next" is newer
  const prev = posts[index + 1];
  const next = index > 0 ? posts[index - 1] : undefined;
  if (!prev && !next) {
    return null;
  }

  const card =
    "group flex min-w-0 flex-col gap-1 rounded-xl border border-gray-200/80 dark:border-gray-800 p-4 hover:border-brand-300 dark:hover:border-brand-800 transition-colors";

  return (
    <nav aria-label="More posts" className="mt-10 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link href={`/p/${prev.slug}`} rel="prev" className={card}>
          <span className="text-xs text-gray-400 dark:text-gray-500">← Older</span>
          <span className="text-sm font-medium leading-snug text-gray-800 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2 transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link href={`/p/${next.slug}`} rel="next" className={`${card} sm:text-right sm:items-end`}>
          <span className="text-xs text-gray-400 dark:text-gray-500">Newer →</span>
          <span className="text-sm font-medium leading-snug text-gray-800 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2 transition-colors">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
