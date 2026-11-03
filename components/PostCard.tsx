import Link from "next/link";
import { formatCount } from "@/lib/format";
import type { PostSummary } from "@/lib/mdSource";
import ReadBadge from "./ReadBadge";
import { CommentIcon, EyeIcon } from "./StatIcons";

export function shortDate(iso?: string) {
  if (!iso) {
    return "";
  }
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function PostStatsLine({
  post,
  views,
  comments,
}: {
  post: PostSummary;
  views?: number;
  comments?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
      {post.publishedTime && <time dateTime={post.publishedTime}>{shortDate(post.publishedTime)}</time>}
      {post.readingTime && <span>{post.readingTime} min read</span>}
      {!!views && (
        <span className="inline-flex items-center gap-1" title={`${views.toLocaleString("en-US")} reads`}>
          <EyeIcon className="size-3" />
          {formatCount(views)}
        </span>
      )}
      {!!comments && (
        <span className="inline-flex items-center gap-1" title={`${comments} comments`}>
          <CommentIcon className="size-3" />
          {comments}
        </span>
      )}
      <ReadBadge slug={post.slug} publishedTime={post.publishedTime} />
    </div>
  );
}

export default function PostCard({
  post,
  views,
  comments,
}: {
  post: PostSummary;
  views?: number;
  comments?: number;
}) {
  return (
    <article className="post-card group/card border-b border-gray-200/70 dark:border-gray-800/60 last:border-b-0">
      <Link href={`/p/${post.slug}`} className="block py-5">
        <h3 className="text-[15px] sm:text-base font-semibold tracking-tight leading-snug text-gray-900 dark:text-gray-100 group-hover/card:text-[var(--accent)] transition-colors">
          {post.title}
        </h3>
        {post.summary && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{post.summary}</p>
        )}
        <div className="mt-2.5">
          <PostStatsLine post={post} views={views} comments={comments} />
        </div>
      </Link>
    </article>
  );
}
