"use client";
import { useState } from "react";

type Comment = {
  id: string;
  slug: string;
  name: string;
  email: string | null;
  body: string;
  approved: boolean;
  createdAt: Date;
};

type Reaction = { slug: string; total: number };

export default function AdminClient({
  pending,
  approved,
  reactions,
  secret,
}: {
  pending: Comment[];
  approved: Comment[];
  reactions: Reaction[];
  secret: string;
}) {
  const [pendingList, setPendingList] = useState(pending);
  const [approvedList, setApprovedList] = useState(approved);
  const [tab, setTab] = useState<"pending" | "approved" | "reactions">("pending");

  async function approve(id: string) {
    const res = await fetch(`/api/comment/${id}`, {
      method: "PATCH",
      headers: { "x-admin-secret": secret },
    });
    if (res.ok) {
      const comment = pendingList.find((c) => c.id === id)!;
      setPendingList((p) => p.filter((c) => c.id !== id));
      setApprovedList((a) => [{ ...comment, approved: true }, ...a]);
    }
  }

  async function remove(id: string, fromApproved = false) {
    const res = await fetch(`/api/comment/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });
    if (res.ok) {
      if (fromApproved) {
        setApprovedList((a) => a.filter((c) => c.id !== id));
      } else {
        setPendingList((p) => p.filter((c) => c.id !== id));
      }
    }
  }

  const tabCls = (t: typeof tab) =>
    `text-xs px-3 py-1.5 rounded-md transition-colors ${
      tab === t
        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
        : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
    }`;

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Admin</h1>
        <div className="flex gap-1">
          <button className={tabCls("pending")} onClick={() => setTab("pending")}>
            Pending {pendingList.length > 0 && <span className="ml-1 text-teal-600 dark:text-teal-400">{pendingList.length}</span>}
          </button>
          <button className={tabCls("approved")} onClick={() => setTab("approved")}>Approved</button>
          <button className={tabCls("reactions")} onClick={() => setTab("reactions")}>Reactions</button>
        </div>
      </div>

      {tab === "pending" && (
        <div className="space-y-4">
          {pendingList.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500">No pending comments.</p>
          )}
          {pendingList.map((c) => (
            <CommentRow key={c.id} comment={c} onApprove={() => approve(c.id)} onDelete={() => remove(c.id)} />
          ))}
        </div>
      )}

      {tab === "approved" && (
        <div className="space-y-4">
          {approvedList.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500">No approved comments.</p>
          )}
          {approvedList.map((c) => (
            <CommentRow key={c.id} comment={c} onDelete={() => remove(c.id, true)} />
          ))}
        </div>
      )}

      {tab === "reactions" && (
        <div className="space-y-2">
          {reactions.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500">No reactions yet.</p>
          )}
          {reactions.map((r) => (
            <div key={r.slug} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800/60">
              <span className="text-sm text-gray-700 dark:text-gray-300">/blog/{r.slug}</span>
              <span className="text-sm font-medium text-teal-600 dark:text-teal-400">{r.total} reactions</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentRow({
  comment,
  onApprove,
  onDelete,
}: {
  comment: Comment;
  onApprove?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="py-4 border-b border-gray-100 dark:border-gray-800/60">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{comment.name}</span>
            {comment.email && <span className="text-xs text-gray-400">{comment.email}</span>}
            <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">/blog/{comment.slug}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{comment.body}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {onApprove && (
            <button
              onClick={onApprove}
              className="text-xs px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
            >
              Approve
            </button>
          )}
          <button
            onClick={onDelete}
            className="text-xs px-3 py-1 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
