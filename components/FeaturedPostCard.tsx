import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";
import DifficultyBadge from "./DifficultyBadge";
import PublishTime from "./PublishTime";

export default function FeaturedPostCard({ post }: { post: DocMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-gray-100 dark:border-gray-800/70 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/60 dark:to-gray-950 p-5 hover:border-cyan-200 dark:hover:border-cyan-800/60 hover:shadow-md hover:shadow-cyan-500/5 transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/70 dark:border-cyan-800/50 px-2.5 py-0.5 text-[11px] font-medium text-cyan-700 dark:text-cyan-400">
          <span className="size-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
          Latest
        </span>
        <DifficultyBadge level={post.level} />
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold tracking-tight leading-snug text-gray-900 dark:text-gray-50 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors mb-2">
        {post.title}
      </h2>

      {/* Summary */}
      {post.summary && (
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
          {post.summary}
        </p>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          {post.publishedTime && <PublishTime publishedTime={post.publishedTime} />}
          {post.readingTime && (
            <>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
          {post.tags && post.tags.length > 0 && (
            <>
              <span>·</span>
              <span className="text-gray-400 dark:text-gray-500">#{post.tags[0]}</span>
            </>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 group-hover:gap-2 transition-all">
          Read <span className="text-base leading-none">→</span>
        </span>
      </div>
    </Link>
  );
}
