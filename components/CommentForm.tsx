"use client";
import { useState } from "react";

export default function CommentForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch(`/api/comments/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, body }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
        Comment submitted — visible after review.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 mt-4">
      <div className="flex gap-3">
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 text-sm bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 text-sm bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400"
        />
      </div>
      <textarea
        required
        rows={4}
        placeholder="Your comment…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full text-sm bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 resize-none"
      />
      {status === "error" && (
        <p className="text-xs text-red-500">Something went wrong. Try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="text-sm px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg transition-colors"
      >
        {status === "loading" ? "Sending…" : "Post comment"}
      </button>
    </form>
  );
}
