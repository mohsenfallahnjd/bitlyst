import Link from "next/link";
import PublishTime from "./PublishTime";

export default function PostMeta({
  publishedTime,
  tags = [],
  className = "",
}: {
  publishedTime?: string;
  tags?: string[];
  className?: string;
}) {
  if (!publishedTime && !tags.length) {
    return null;
  }

  return (
    <div className={`my-3 flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {publishedTime && <PublishTime publishedTime={publishedTime} />}

      {tags.map((t) => (
        <Link
          key={t}
          href={`/blog?tag=${encodeURIComponent(t)}`}
          className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
        >
          #{t}
        </Link>
      ))}
    </div>
  );
}
