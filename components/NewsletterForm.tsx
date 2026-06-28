"use client";

import { useState } from "react";
import clsx from "clsx";

type State = "idle" | "loading" | "success" | "error";

export type TopicOption = { id: string; label: string };

interface Props {
  className?: string;
  /** Pre-selected topic IDs (e.g. from post tags). Requires topics created in Resend. */
  topics?: TopicOption[];
}

export default function NewsletterForm({ className, topics = [] }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [checkedTopics, setCheckedTopics] = useState<Set<string>>(
    () => new Set(topics.map((t) => t.id)),
  );

  const toggleTopic = (id: string) => {
    setCheckedTopics((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        topicIds: checkedTopics.size > 0 ? [...checkedTopics] : undefined,
        interests:
          checkedTopics.size > 0
            ? topics.filter((t) => checkedTopics.has(t.id)).map((t) => t.label)
            : undefined,
      }),
    });

    if (res.ok) {
      setState("success");
      setEmail("");
    } else {
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error ?? "Something went wrong");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div
        className={clsx(
          "rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-6 py-5 text-center",
          className,
        )}
      >
        <p className="text-emerald-700 dark:text-emerald-400 font-medium">🎉 You're subscribed!</p>
        <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">You'll get new posts in your inbox.</p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-6 py-6",
        className,
      )}
    >
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Get new posts in your inbox</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">No spam. Unsubscribe any time.</p>

      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {topics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTopic(t.id)}
              className={clsx(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                checkedTopics.has(t.id)
                  ? "border-teal-400 dark:border-teal-600 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600",
              )}
            >
              {checkedTopics.has(t.id) ? "✓ " : ""}{t.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
          className="flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 transition-colors disabled:opacity-50 shrink-0"
        >
          {state === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
      {state === "error" && <p className="mt-2 text-xs text-red-500">{errorMsg}</p>}
    </div>
  );
}
