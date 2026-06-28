"use client";

import clsx from "clsx";
import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";
import DifficultyBadge from "./DifficultyBadge";
import PublishTime from "./PublishTime";

export default function PostCard({ post, className }: { post: DocMeta; className?: string }) {
  const isNew = post.publishedTime && new Date(post.publishedTime) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);

  return (
    <article className="post-card group/card relative -mx-3 rounded-xl px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/60 border border-transparent hover:border-gray-100 dark:hover:border-gray-800/60">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/blog/${post.slug}`} className={clsx("block flex-1 min-w-0", className)} onClick={(e) => e.stopPropagation()}>
          <h2 className="text-[15px] font-semibold tracking-tight leading-snug group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-400 transition-colors flex items-center gap-2 flex-wrap">
            {post.title}
            {isNew && (
              <span className="badge-new inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 shrink-0">
                New
              </span>
            )}
          </h2>

          {post.summary && (
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{post.summary}</p>
          )}
        </Link>

        <DifficultyBadge level={post.level} />
      </div>

      <div className="mt-3 flex items-center gap-x-3 gap-y-1 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          {post.publishedTime && <PublishTime publishedTime={post.publishedTime} />}
          {post.readingTime && (
            <>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t: string) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className="tag-pill rounded-full border border-gray-100 dark:border-gray-800 px-2 py-0.5 text-[11px] text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
