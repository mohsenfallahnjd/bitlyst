"use client";

import { useEffect, useState } from "react";
import { applyRemote, LOCAL_EVENT, readState } from "@/lib/reader";

/**
 * Cross-device reading sync. Devices that share a secret sync code share one copy of the
 * reading state on the server. No account: the code is the only key, so treat it like a password.
 *
 * Each sync sends this device's state and merges back the combined one. It runs on page load,
 * a few seconds after local progress changes, when the tab comes back, and when it's hidden.
 */

const KEY = "bitlyst:sync";
const EVENT = "bitlyst:sync";
const DEBOUNCE_MS = 4000;

export type SyncState = {
  code: string;
  /** last successful sync (ms), 0 if never */
  last: number;
  error?: string;
};

export function normalizeCode(input: string) {
  const code = input
    .trim()
    .replace(/^.*#/, "")
    .toLowerCase()
    .replace(/[^a-f0-9]/g, "");
  return /^[a-f0-9]{32}$/.test(code) ? code : null;
}

export function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** 4-char groups so the code is easier to read out or type. */
export function formatCode(code: string) {
  return code.match(/.{1,4}/g)?.join("-") ?? code;
}

export function syncLink(code: string) {
  return `${window.location.origin}/sync#${code}`;
}

function readSync(): SyncState | null {
  try {
    const raw = localStorage.getItem(KEY);
    const s = raw ? (JSON.parse(raw) as SyncState) : null;
    return s && normalizeCode(s.code) ? s : null;
  } catch {
    return null;
  }
}

function writeSync(next: SyncState | null) {
  try {
    if (next) {
      localStorage.setItem(KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(KEY);
    }
  } catch {
    /* storage blocked — sync just stays off */
  }
  window.dispatchEvent(new Event(EVENT));
}

let inflight: Promise<void> | null = null;

/** Push this device's state and merge the combined state back. No-op when sync is off. */
export function syncNow({ keepalive = false } = {}): Promise<void> {
  const sync = readSync();
  if (!sync) {
    return Promise.resolve();
  }
  if (inflight && !keepalive) {
    return inflight;
  }
  const { history, streak } = readState();
  const run = fetch("/api/reader-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: sync.code, history, streak }),
    keepalive,
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(res.status === 429 ? "Too many syncs, retrying soon" : "Sync failed");
      }
      applyRemote(await res.json());
      // the code may have been changed or removed while the request was in flight
      if (readSync()?.code === sync.code) {
        writeSync({ code: sync.code, last: Date.now() });
      }
    })
    .catch((err: unknown) => {
      if (readSync()?.code === sync.code) {
        writeSync({ ...sync, error: err instanceof Error ? err.message : "Sync failed" });
      }
    })
    .finally(() => {
      if (inflight === run) {
        inflight = null;
      }
    });
  if (!keepalive) {
    inflight = run;
  }
  return run;
}

/** Turn sync on with this code (new or from another device) and merge right away. */
export function enableSync(code: string) {
  writeSync({ code, last: 0 });
  return syncNow();
}

/** Stop syncing on this device. Local history stays; the server copy expires after a year unused. */
export function disableSync() {
  writeSync(null);
}

/** Starts background sync; call once from the root layout. Returns a cleanup function. */
export function startSync() {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => void syncNow(), DEBOUNCE_MS);
  };
  const onVisibility = () => {
    if (document.visibilityState === "visible") {
      void syncNow();
    } else {
      clearTimeout(timer);
      void syncNow({ keepalive: true });
    }
  };

  void syncNow();
  window.addEventListener(LOCAL_EVENT, schedule);
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    clearTimeout(timer);
    window.removeEventListener(LOCAL_EVENT, schedule);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

/** Reactive sync status; undefined until mounted, null when sync is off. */
export function useSync(): SyncState | null | undefined {
  const [state, setState] = useState<SyncState | null | undefined>(undefined);
  useEffect(() => {
    const update = () => {
      setState(readSync());
    };
    update();
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return state;
}
