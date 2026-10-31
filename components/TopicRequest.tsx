"use client";

import { useState } from "react";

type Props = {
  title?: string;
  description?: string;
  placeholder?: string;
  /** tag shown in the email subject so requests are easy to sort */
  kind?: string;
  submitLabel?: string;
};

/** "What should I write next?" — goes to the author's inbox via /api/feedback. */
export default function TopicRequest({
  title = "What should I write next?",
  description = "Stuck on a concept or an interview question? Ask — the best ones become posts.",
  placeholder = "e.g. How does React Server Components streaming work?",
  kind = "topic-request",
  submitLabel = "Ask",
}: Props) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, email, slug: kind }),
    }).catch(() => null);
    setStatus(res?.ok ? "done" : "error");
  }

  return (
    <div className="min-w-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-4 py-5 sm:px-6 sm:py-6">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {description}
      </p>
      {status === "done" ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">Got it — thanks! 🙌 I read every one.</p>
      ) : (
        <form onSubmit={submit} className="space-y-2">
          <textarea
            required
            minLength={3}
            maxLength={2000}
            rows={2}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder={placeholder}
            className="block w-full min-w-0 resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[var(--accent)]"
          />
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email (optional)"
              className="min-w-0 flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-lg bg-gray-900 dark:bg-gray-100 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : submitLabel}
            </button>
          </div>
          {status === "error" && <p className="text-xs text-red-500">Couldn't send. Try again?</p>}
        </form>
      )}
    </div>
  );
}
