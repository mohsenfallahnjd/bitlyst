"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useReader } from "@/lib/reader";
import {
  disableSync,
  enableSync,
  formatCode,
  newCode,
  normalizeCode,
  syncLink,
  syncNow,
  useSync,
} from "@/lib/readerSync";

const button =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50";
const primary = `${button} bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900`;
const secondary = `${button} border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300`;
const card = "rounded-xl border border-gray-200/70 dark:border-gray-800/60 p-5 space-y-4";

function timeAgo(ms: number) {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) {
    return "just now";
  }
  if (s < 3600) {
    return `${Math.floor(s / 60)} min ago`;
  }
  return new Date(ms).toLocaleString();
}

export default function SyncPanel() {
  const sync = useSync();
  const reader = useReader();
  const [qr, setQr] = useState("");
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Opened from a sync link (/sync#code): join, then drop the secret from the address bar.
  useEffect(() => {
    const code = normalizeCode(window.location.hash);
    if (code) {
      window.history.replaceState(null, "", window.location.pathname);
      void enableSync(code);
    }
  }, []);

  useEffect(() => {
    if (!sync) {
      setQr("");
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(syncLink(sync.code), { margin: 1, width: 220 })
      .then((url) => {
        if (!cancelled) {
          setQr(url);
        }
      })
      .catch(() => {
        /* QR is optional — the link and code still work */
      });
    return () => {
      cancelled = true;
    };
  }, [sync]);

  if (sync === undefined) {
    return <div className={`${card} h-40 animate-pulse`} />;
  }

  const readCount = reader ? Object.keys(reader.history).length : 0;

  if (!sync) {
    const join = () => {
      const code = normalizeCode(input);
      if (!code) {
        setInputError("That doesn't look like a sync link or code.");
        return;
      }
      setInputError("");
      setInput("");
      void enableSync(code);
    };

    return (
      <div className="space-y-6">
        <div className={card}>
          <h2 className="font-semibold">First device</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Turn sync on here, then open the link it gives you on your other devices.
          </p>
          <button type="button" className={primary} onClick={() => void enableSync(newCode())}>
            Turn on sync
          </button>
        </div>

        <div className={card}>
          <h2 className="font-semibold">Already syncing on another device?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Scan its QR code, open its link, or paste the link or code here. What you&apos;ve read on this device is
            kept and merged in.
          </p>
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              join();
            }}
          >
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              placeholder="Sync link or code"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm font-mono"
            />
            <button type="submit" className={secondary}>
              Connect
            </button>
          </form>
          {inputError && <p className="text-sm text-red-600 dark:text-red-400">{inputError}</p>}
        </div>
      </div>
    );
  }

  const link = syncLink(sync.code);

  return (
    <div className="space-y-6">
      <div className={card}>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${sync.error ? "bg-amber-500" : "bg-emerald-500"}`} aria-hidden />
          <h2 className="font-semibold">Sync is on</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {sync.error
            ? `${sync.error}. Your progress is saved on this device and syncs when it can.`
            : sync.last
              ? `Last synced ${timeAgo(sync.last)} · ${readCount} post${readCount === 1 ? "" : "s"} in your history.`
              : "Syncing…"}
        </p>
        <button type="button" className={secondary} onClick={() => void syncNow()}>
          Sync now
        </button>
      </div>

      <div className={card}>
        <h2 className="font-semibold">Add another device</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Scan this with your phone or tablet camera, or send yourself the link. Anyone with it can see and change your
          reading history, so keep it to yourself.
        </p>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {qr && (
            <img
              src={qr}
              alt="QR code with your sync link"
              width={220}
              height={220}
              className="rounded-lg bg-white p-2 self-center sm:self-start"
            />
          )}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={primary}
                onClick={() => {
                  void navigator.clipboard.writeText(link).then(() => {
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  });
                }}
              >
                {copied ? "Copied" : "Copy link"}
              </button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  type="button"
                  className={secondary}
                  onClick={() => {
                    navigator.share({ title: "Bitlyst sync link", url: link }).catch(() => {
                      /* share sheet dismissed */
                    });
                  }}
                >
                  Share…
                </button>
              )}
            </div>
            <button
              type="button"
              className="text-sm text-gray-500 dark:text-gray-400 underline underline-offset-2"
              onClick={() => {
                setShowCode((v) => !v);
              }}
            >
              {showCode ? "Hide code" : "Show code to type in"}
            </button>
            {showCode && <p className="font-mono text-sm break-all select-all">{formatCode(sync.code)}</p>}
          </div>
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold">Stop syncing on this device</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This device keeps its history but stops sharing it. Other devices keep syncing with each other.
        </p>
        <button type="button" className={secondary} onClick={disableSync}>
          Stop syncing
        </button>
      </div>
    </div>
  );
}
