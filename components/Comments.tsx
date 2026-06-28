import CommentForm from "./CommentForm";
import { prisma } from "@/lib/prisma";

export default async function Comments({ slug }: { slug: string }) {
  const comments = await prisma.comment.findMany({
    where: { slug, approved: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, body: true, createdAt: true },
  });

  return (
    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800/60">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
        {comments.length > 0 ? `${comments.length} comment${comments.length > 1 ? "s" : ""}` : "Comments"}
      </p>

      {comments.length > 0 && (
        <div className="space-y-6 mb-8">
          {comments.map((c: { id: string; name: string; body: string; createdAt: Date }) => (
            <div key={c.id}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.name}</span>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      <CommentForm slug={slug} />
    </div>
  );
}
