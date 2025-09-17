"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { getUserId } from "@/lib/userUtils";

type ReactionType = "like" | "love" | "fire" | "think" | "wow";

interface ReactionData {
  like: number;
  love: number;
  fire: number;
  think: number;
  wow: number;
}

type UserReactions = {
  [key in ReactionType]?: boolean;
};

const reactionEmojis: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  fire: "🔥",
  think: "🤔",
  wow: "😮",
};

const reactionLabels: Record<ReactionType, string> = {
  like: "Like",
  love: "Love",
  fire: "Fire",
  think: "Think",
  wow: "Wow",
};

interface PostReactionsProps {
  postSlug: string;
  className?: string;
  showLabels?: boolean;
}

export default function PostReactions({ postSlug, className = "", showLabels = true }: PostReactionsProps) {
  const [reactions, setReactions] = useState<ReactionData>({
    like: 0,
    love: 0,
    fire: 0,
    think: 0,
    wow: 0,
  });

  const [userReactions, setUserReactions] = useState<UserReactions>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load reactions from API on mount
  useEffect(() => {
    const loadReactions = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          return;
        }

        // Load reaction counts
        const reactionsResponse = await fetch(`/api/reactions/${postSlug}`);
        if (reactionsResponse.ok) {
          const reactionsData = await reactionsResponse.json();
          setReactions(reactionsData);
        }

        // Load user reactions
        const userReactionsResponse = await fetch(`/api/reactions/${postSlug}/user/${userId}`);
        if (userReactionsResponse.ok) {
          const userData = await userReactionsResponse.json();
          const userReactionMap: UserReactions = {};
          userData.userReactions.forEach((reaction: string) => {
            userReactionMap[reaction as ReactionType] = true;
          });
          setUserReactions(userReactionMap);
        }
      } catch (error) {
        console.warn("Failed to load reactions from API:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadReactions();
  }, [postSlug]);

  const toggleReaction = async (reactionType: ReactionType) => {
    if (typeof window === "undefined" || isLoading) {
      return;
    }

    const userId = getUserId();
    if (!userId) {
      return;
    }

    const currentUserReaction = userReactions[reactionType] || false;
    const action = currentUserReaction ? "remove" : "add";

    setIsLoading(true);

    try {
      const response = await fetch(`/api/reactions/${postSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reactionType,
          userId,
          action,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReactions(data.reactions);

        // Update user reactions
        const userReactionMap: UserReactions = {};
        data.userReactions.forEach((reaction: string) => {
          userReactionMap[reaction as ReactionType] = true;
        });
        setUserReactions(userReactionMap);
      } else {
        console.error("Failed to update reaction:", await response.text());
      }
    } catch (error) {
      console.error("Failed to update reaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className={clsx("flex items-center gap-2", className)}>
        <div className="flex gap-1">
          {Object.keys(reactionEmojis).map((reaction) => (
            <div
              key={reaction}
              className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            >
              <span className="text-sm opacity-50">{reactionEmojis[reaction as ReactionType]}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <div className="flex gap-1 flex-wrap">
        {(Object.keys(reactionEmojis) as ReactionType[]).map((reactionType) => {
          const count = reactions[reactionType];
          const isUserReacted = userReactions[reactionType] || false;

          return (
            <button
              key={reactionType}
              onClick={() => toggleReaction(reactionType)}
              disabled={isLoading}
              className={clsx(
                "flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200",
                "border hover:scale-105 active:scale-95",
                isUserReacted
                  ? "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              title={`${reactionLabels[reactionType]} this post`}
            >
              <span className={clsx("text-sm transition-transform duration-200", isUserReacted && "animate-bounce")}>
                {reactionEmojis[reactionType]}
              </span>
              {count > 0 && (
                <span
                  className={clsx(
                    "text-xs font-medium",
                    isUserReacted ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {count}
                </span>
              )}
              {showLabels && count === 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{reactionLabels[reactionType]}</span>
              )}
            </button>
          );
        })}
      </div>

      {totalReactions > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          {totalReactions} reaction{totalReactions !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
