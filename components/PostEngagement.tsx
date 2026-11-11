"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/lib/userUtils";

type ReactionType = "like" | "love" | "fire" | "think" | "wow";

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "like", emoji: "👍", label: "Helpful" },
  { type: "love", emoji: "❤️", label: "Love it" },
  { type: "fire", emoji: "🔥", label: "Fire" },
  { type: "think", emoji: "🤔", label: "Hmm" },
  { type: "wow", emoji: "😮", label: "Wow" },
];

const THANKS: Record<ReactionType, string> = {
  like: "Glad it helped! 🙌",
  love: "You made my day! ❤️",
  fire: "You're on fire too! 🔥",
  think: "Good — keep questioning! 🧠",
  wow: "That's the goal 🚀",
};

export default function PostEngagement({ postSlug }: { postSlug: string }) {
  const [counts, setCounts] = useState<Record<ReactionType, number>>({ like: 0, love: 0, fire: 0, think: 0, wow: 0 });
  const [userReacted, setUserReacted] = useState<Set<ReactionType>>(new Set());
  const [justReacted, setJustReacted] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      return;
    }
    fetch(`/api/reactions/${postSlug}?user=${encodeURIComponent(userId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.counts) {
          setCounts(data.counts);
        }
        if (data?.userReactions) {
          setUserReacted(new Set(data.userReactions as ReactionType[]));
        }
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, [postSlug]);

  const toggle = async (type: ReactionType) => {
    if (loading) {
      return;
    }
    const userId = getUserId();
    if (!userId) {
      return;
    }

    const isActive = userReacted.has(type);
    setLoading(true);

    // Optimistic update
    setCounts((prev) => ({ ...prev, [type]: prev[type] + (isActive ? -1 : 1) }));
    setUserReacted((prev) => {
      const next = new Set(prev);
      isActive ? next.delete(type) : next.add(type);
      return next;
    });
    if (!isActive) {
      setJustReacted(type);
      setTimeout(() => {
        setJustReacted(null);
      }, 3000);
    }

    try {
      const res = await fetch(`/api/reactions/${postSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType: type, userId, action: isActive ? "remove" : "add" }),
      });
      if (res.ok) {
        const data = await res.json();
        setCounts(data.reactions);
        setUserReacted(new Set(data.userReactions as ReactionType[]));
      }
    } catch {
      /* keep optimistic */
    }

    setLoading(false);
  };

  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  return (
    <section
      id="reactions"
      className="scroll-mt-24 mt-14 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-surface-light dark:bg-surface-dark px-5 py-6 sm:px-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">Was this worth your time?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
            {justReacted
              ? THANKS[justReacted]
              : total > 0
                ? `${total} reader${total !== 1 ? "s" : ""} reacted — add yours.`
                : "One tap tells me what to write more of."}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {REACTIONS.map(({ type, emoji, label }) => {
            const active = userReacted.has(type);
            const count = counts[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  toggle(type);
                }}
                disabled={!loaded || loading}
                aria-label={`${label} reaction`}
                aria-pressed={active}
                title={label}
                className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-150 active:scale-90 disabled:opacity-50 disabled:cursor-default ${
                  active
                    ? "border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300"
                    : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                <span
                  className={`leading-none transition-transform ${active ? "scale-110" : "group-hover:scale-110"} ${justReacted === type ? "animate-bounce" : ""}`}
                  aria-hidden
                >
                  {emoji}
                </span>
                {count > 0 && <span className="text-xs tabular-nums font-medium">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
