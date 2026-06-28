"use client";

import clsx from "clsx";
import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";
import DifficultyBadge from "./DifficultyBadge";
import PublishTime from "./PublishTime";

export default function PostCard({ post, className }: { post: DocMeta; className?: string }) {
  const isNew = post.publishedTime && new Date(post.publishedTime) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);

  return (
    <article className="post-card group/card relative -mx-3 rounded-xl px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/60">
      <Link href={`/blog/${post.slug}`} className={clsx("block", className)} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-semibold tracking-tight group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-400 transition-colors flex items-center gap-2 flex-wrap">
          {post.title}
          {isNew && (
            <span className="badge-new inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              ✨ New
            </span>
          )}
          <DifficultyBadge level={post.level} />
        </h2>

        {post.summary && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{post.summary}</p>
        )}
      </Link>

      <div className="mt-2 text-xs flex md:items-center gap-x-3 gap-y-1 text-gray-400 dark:text-gray-500 md:flex-row flex-col flex-wrap">
        {post.publishedTime && <PublishTime publishedTime={post.publishedTime} />}

        {post.readingTime && (
          <>
            <span className="hidden md:inline">·</span>
            <span>{post.readingTime} min read</span>
          </>
        )}

        {post.tags && post.tags.length > 0 && (
          <>
            <span className="hidden md:inline">·</span>
            <span className="flex flex-wrap gap-1.5">
              {post.tags.map((t: string) => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="tag-pill rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  #{t}
                </Link>
              ))}
            </span>
          </>
        )}
      </div>
    </article>
  );
}
