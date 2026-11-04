import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import CommentForm from "./CommentForm";

/** Approved comments for a post — cached, and invalidated when a comment is approved or deleted. */
async function getApprovedComments(slug: string) {
  "use cache";
  cacheLife("stats");
  cacheTag("comments");
  try {
    return await prisma.comment.findMany({
      where: { slug, approved: true },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, body: true, createdAt: true },
    });
  } catch (err) {
    console.error("getApprovedComments failed:", err);
    return [];
  }
}

export default async function Comments({ slug }: { slug: string }) {
  const comments = await getApprovedComments(slug);

  return (
    <section id="comments" className="scroll-mt-24 mt-12 pt-8 border-t border-gray-100 dark:border-gray-800/60">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {comments.length > 0 ? `${comments.length} comment${comments.length > 1 ? "s" : ""}` : "Start the discussion"}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Questions, corrections, a better approach? I read and reply to every comment.
      </p>

      {comments.length > 0 && (
        <div className="space-y-6 mb-8">
          {comments.map((c: { id: string; name: string; body: string; createdAt: Date }) => (
            <div key={c.id}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.name}</span>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      <CommentForm slug={slug} />
    </section>
  );
}
