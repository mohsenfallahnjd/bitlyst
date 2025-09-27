import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FunctionComponent } from "react";
import PostCard from "@/components/PostCard";
import { loadMarkdownDocs } from "@/lib/mdSource";

interface ListProps {}

const List: FunctionComponent<ListProps> = () => {
  const searchParams = useSearchParams();
  const all = loadMarkdownDocs();
  const tag = searchParams?.get("tag")?.toString()?.toLowerCase() || "";
  const posts = tag ? all.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === tag)) : all;

  return (
    <>
      <div className="grid gap-6">
        {posts.slice(0, 6).map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>

      <div className="pt-2 flex items-center gap-3 text-sm">
        <Link href="/blog" className="underline">
          Browse all posts →
        </Link>
        {tag && (
          <Link
            href="/"
            className="rounded-full border border-gray-200 dark:border-gray-800 px-2 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            Clear “{tag}”
          </Link>
        )}
      </div>
    </>
  );
};

export default List;
