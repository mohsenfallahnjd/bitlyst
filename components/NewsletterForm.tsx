"use client";

import { useState } from "react";
import clsx from "clsx";

type State = "idle" | "loading" | "success" | "error";

export default function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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
      <div className={clsx("rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-6 py-5 text-center", className)}>
        <p className="text-emerald-700 dark:text-emerald-400 font-medium">🎉 You're subscribed!</p>
        <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">You'll get new posts in your inbox.</p>
      </div>
    );
  }

  return (
    <div className={clsx("rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-6 py-6", className)}>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Get new posts in your inbox</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">No spam. Unsubscribe any time.</p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
          className="flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 transition-colors disabled:opacity-50 shrink-0"
        >
          {state === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
      {state === "error" && (
        <p className="mt-2 text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
