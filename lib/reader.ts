"use client";

import { useEffect, useState } from "react";

/**
 * Per-browser reading state kept in localStorage: what you've read, where you
 * stopped, your daily streak and when you last visited. Stays on the device unless
 * you turn on cross-device sync (see lib/readerSync.ts).
 */
export type ReaderState = {
  /** slug → p: max scroll progress, b: manual bookmark, t: last updated (ms) */
  history: Record<string, { p: number; b?: number; t: number }>;
  streak: { day: string; count: number; best: number };
  /** start of the current session (ms) */
  lastVisit: number;
  /** start of the previous session (ms) — drives "new since last visit" */
  prevVisit: number;
};

const KEY = "bitlyst:reader";
const EVENT = "bitlyst:reader";
/** Fired only for changes made on this device — what sync pushes. */
export const LOCAL_EVENT = "bitlyst:reader-local";
export const READ_THRESHOLD = 0.85;
/** Show "pick up where you left off" between these bounds. */
export const RESUME_MIN = 0.08;

export function resumeProgress(entry: { b?: number } | undefined) {
  if (entry?.b === undefined) {
    return null;
  }
  const p = entry.b;
  return p >= RESUME_MIN && p < 1 ? p : null;
}

export function setBookmark(slug: string, progress: number) {
  const state = readState();
  const prev = state.history[slug];
  const b = Math.min(1, Math.max(0, progress));
  const p = prev?.p ?? 0;
  writeState({
    ...state,
    history: { ...state.history, [slug]: { p, b, t: Date.now() } },
  });
}

export function clearBookmark(slug: string) {
  const state = readState();
  const prev = state.history[slug];
  if (prev?.b === undefined) {
    return;
  }
  writeState({
    ...state,
    history: { ...state.history, [slug]: { p: prev.p, t: prev.t } },
  });
}

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

function writeState(next: ReaderState, { remote = false } = {}) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked — features just stay hidden */
  }
  window.dispatchEvent(new Event(EVENT));
  if (!remote) {
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }
}

function dayNum(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return y && m && d ? y * 10_000 + m * 100 + d : 0;
}

/** Merges state synced from other devices: highest progress and latest open per post, latest streak day. */
export function applyRemote(remote: Pick<ReaderState, "history" | "streak">) {
  const state = readState();
  const history = { ...state.history };
  let changed = false;
  for (const [slug, r] of Object.entries(remote.history)) {
    const local = history[slug];
    const p = Math.max(local?.p ?? 0, r.p);
    const t = Math.max(local?.t ?? 0, r.t);
    const b = local?.b ?? r.b;
    const next = b !== undefined ? { p, b, t } : { p, t };
    if (!local || local.p !== p || local.t !== t || local.b !== b) {
      history[slug] = next;
      changed = true;
    }
  }

  let streak = state.streak;
  const ln = dayNum(streak.day);
  const rn = dayNum(remote.streak.day);
  if (rn > ln || (rn === ln && remote.streak.count > streak.count)) {
    streak = { ...remote.streak, best: Math.max(streak.best, remote.streak.best) };
    changed = true;
  } else if (remote.streak.best > streak.best) {
    streak = { ...streak, best: remote.streak.best };
    changed = true;
  }

  if (changed) {
    writeState({ ...state, history, streak }, { remote: true });
  }
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
  const last = Math.min(1, Math.max(0, progress));
  const p = Math.max(prev?.p ?? 0, last);
  if (prev && prev.p === p && Date.now() - prev.t < 60_000) {
    return;
  }
  const entry = prev?.b !== undefined ? { p, b: prev.b, t: Date.now() } : { p, t: Date.now() };
  writeState({ ...state, history: { ...state.history, [slug]: entry } });
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
