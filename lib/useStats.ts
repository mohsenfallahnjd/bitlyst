"use client";

import { useEffect, useState } from "react";
import type { PostStats } from "@/lib/stats";

// One request per page load, shared by every component that shows counts.
let cached: PostStats | null = null;
let pending: Promise<PostStats | null> | null = null;

function loadStats() {
  pending ??= fetch("/api/stats")
    .then((r) => (r.ok ? (r.json() as Promise<PostStats>) : null))
    .then((data) => {
      cached = data;
      return data;
    })
    .catch(() => null);
  return pending;
}

/** Read and comment counts, or null until they arrive (the static HTML renders without them). */
export function useStats(): PostStats | null {
  const [stats, setStats] = useState(cached);
  useEffect(() => {
    if (!cached) {
      loadStats().then(setStats);
    }
  }, []);
  return stats;
}

export function sumCounts(counts: Record<string, number> | undefined) {
  return Object.values(counts ?? {}).reduce((s, n) => s + n, 0);
}
