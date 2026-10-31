"use client";

import { useEffect, useState } from "react";

/**
 * Per-browser reading state kept in localStorage: what you've read, where you
 * stopped, your daily streak and when you last visited. Never leaves the device.
 */
export type ReaderState = {
  /** slug → { p: max scroll progress 0..1, t: last opened (ms) } */
  history: Record<string, { p: number; t: number }>;
  streak: { day: string; count: number; best: number };
  /** start of the current session (ms) */
  lastVisit: number;
  /** start of the previous session (ms) — drives "new since last visit" */
  prevVisit: number;
};

const KEY = "bitlyst:reader";
const EVENT = "bitlyst:reader";
export const READ_THRESHOLD = 0.85;

const EMPTY: ReaderState = { history: {}, streak: { day: "", count: 0, best: 0 }, lastVisit: 0, prevVisit: 0 };

function localDay(offsetDays = 0) {
  const d = new Date(Date.now() - offsetDays * 86_400_000);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function readState(): ReaderState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeState(next: ReaderState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked — features just stay hidden */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Called once per page load from the root layout. */
export function registerVisit() {
  const state = readState();
  const now = Date.now();

  let { lastVisit, prevVisit } = state;
  try {
    if (!sessionStorage.getItem(KEY)) {
      sessionStorage.setItem(KEY, "1");
      prevVisit = lastVisit;
      lastVisit = now;
    }
  } catch {
    /* ignore */
  }

  const day = localDay();
  let streak = state.streak;
  if (streak.day !== day) {
    const count = streak.day === localDay(1) ? streak.count + 1 : 1;
    streak = { day, count, best: Math.max(streak.best, count) };
  }

  writeState({ ...state, lastVisit, prevVisit, streak });
}

export function saveProgress(slug: string, progress: number) {
  const state = readState();
  const prev = state.history[slug];
  const p = Math.max(prev?.p ?? 0, Math.min(1, progress));
  if (prev && prev.p === p && Date.now() - prev.t < 60_000) {
    return;
  }
  writeState({ ...state, history: { ...state.history, [slug]: { p, t: Date.now() } } });
}

/** Reactive view of the reader state; null until mounted (avoids hydration mismatch). */
export function useReader(): ReaderState | null {
  const [state, setState] = useState<ReaderState | null>(null);
  useEffect(() => {
    const sync = () => {
      setState(readState());
    };
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return state;
}
