"use client";

import { useState } from "react";

export default function QuickFeedback({ postSlug }: { postSlug: string }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const send = async () => {
    if (!message.trim() || state === "sending") { return; }
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), email: email.trim() || undefined, slug: postSlug }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="mt-10 rounded-2xl border border-gray-100 dark:border-gray-800/60 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
        Got feedback? 💬
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Typo, suggestion, question — I read every message.
      </p>

      {state === "done" ? (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-5 text-center">
          <div className="text-2xl mb-1">🙏</div>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Got it — thanks!</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">I&apos;ll read it soon.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); }}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 dark:focus:border-teal-600 resize-none transition"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
            placeholder="Email (optional — only if you want a reply)"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 dark:focus:border-teal-600 transition"
          />
          <div className="flex items-center justify-between gap-3 pt-1">
            {state === "error" && (
              <p className="text-xs text-red-600 dark:text-red-400">Something went wrong. Try again.</p>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={send}
              disabled={!message.trim() || state === "sending"}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {state === "sending" ? "Sending…" : "Send feedback"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
