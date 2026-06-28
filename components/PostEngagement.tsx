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
    if (!userId) { return; }
    Promise.all([
      fetch(`/api/reactions/${postSlug}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/reactions/${postSlug}/user/${userId}`).then((r) => r.ok ? r.json() : null),
    ]).then(([reactionData, userData]) => {
      if (reactionData) { setCounts(reactionData); }
      if (userData?.userReactions) {
        setUserReacted(new Set(userData.userReactions as ReactionType[]));
      }
      setLoaded(true);
    }).catch(() => { setLoaded(true); });
  }, [postSlug]);

  const toggle = async (type: ReactionType) => {
    if (loading) { return; }
    const userId = getUserId();
    if (!userId) { return; }

    const isActive = userReacted.has(type);
    setLoading(true);

    // Optimistic update
    setCounts((prev) => ({ ...prev, [type]: prev[type] + (isActive ? -1 : 1) }));
    setUserReacted((prev) => {
      const next = new Set(prev);
      isActive ? next.delete(type) : next.add(type);
      return next;
    });
    if (!isActive) { setJustReacted(type); setTimeout(() => { setJustReacted(null); }, 3000); }

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
    } catch { /* keep optimistic */ }

    setLoading(false);
  };

  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  return (
    <div className="mt-14 rounded-2xl border border-gray-100 dark:border-gray-800/60 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950 px-6 py-8 text-center">
      {/* Header */}
      <div className="mb-1 text-2xl" aria-hidden>🎉</div>
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
        You made it to the end!
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Did this help? Leave a reaction — it takes one second.
      </p>

      {/* Reaction buttons */}
      <div className="flex justify-center gap-2 flex-wrap">
        {REACTIONS.map(({ type, emoji, label }) => {
          const active = userReacted.has(type);
          const count = counts[type];
          return (
            <button
              key={type}
              type="button"
              onClick={() => { toggle(type); }}
              disabled={!loaded || loading}
              aria-label={`${label} reaction`}
              aria-pressed={active}
              className={`group flex flex-col items-center gap-1 rounded-2xl border px-4 py-3 min-w-[64px] transition-all duration-150 active:scale-90 ${
                active
                  ? "border-teal-400 dark:border-teal-600 bg-teal-50 dark:bg-teal-950/40 shadow-sm shadow-teal-200 dark:shadow-teal-900"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
              } disabled:opacity-50 disabled:cursor-default`}
            >
              <span
                className={`text-2xl leading-none transition-transform duration-150 ${
                  active ? "scale-110" : "group-hover:scale-110"
                } ${justReacted === type ? "animate-bounce" : ""}`}
              >
                {emoji}
              </span>
              <span className={`text-[11px] font-medium leading-none ${active ? "text-teal-700 dark:text-teal-300" : "text-gray-400 dark:text-gray-500"}`}>
                {count > 0 ? count : label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Thank-you message */}
      <div className={`mt-5 text-sm font-medium text-teal-700 dark:text-teal-300 transition-all duration-300 ${justReacted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
        {justReacted ? THANKS[justReacted] : " "}
      </div>

      {total > 0 && !justReacted && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          {total} reaction{total !== 1 ? "s" : ""} so far
        </p>
      )}
    </div>
  );
}
