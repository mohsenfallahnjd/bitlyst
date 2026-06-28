import Link from "next/link";
import type { DocMeta } from "@/lib/mdSource";
import PublishTime from "./PublishTime";

export default function FeaturedPostCard({ post }: { post: DocMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block pb-8 border-b border-gray-200/60 dark:border-gray-800/60"
    >
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug text-gray-900 dark:text-gray-50 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mb-2">
        {post.title}
      </h2>

      {post.summary && (
        <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
          {post.summary}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          {post.publishedTime && <PublishTime publishedTime={post.publishedTime} />}
          {post.readingTime && <><span aria-hidden>·</span><span>{post.readingTime} min</span></>}
          {post.tags?.[0] && <><span aria-hidden>·</span><span>#{post.tags[0]}</span></>}
        </div>
        <span className="text-xs text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
          Read →
        </span>
      </div>
    </Link>
  );
}
