"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export default function ShareButton({
  title,
  url,
  className = "",
  variant = "pill",
  showLabel = true,
}: {
  title: string;
  url: string;
  className?: string;
  variant?: "pill" | "icon";
  showLabel?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const canUseWebShare = useMemo(() => typeof navigator !== "undefined" && !!(navigator as any).share, []);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const currentUrl = useMemo(() => {
    if (url) {
      return url;
    }
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  }, [url]);

  const onShare = useCallback(async () => {
    try {
      if (canUseWebShare) {
        await (navigator as any).share({ title, url: currentUrl });
        return;
      }
    } catch (_) {
      // fall through to copy
    }

    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
    } catch (_) {
      // last resort: open native prompt
      window.prompt("Copy this link:", currentUrl);
    }
  }, [canUseWebShare, title, currentUrl]);

  const buttonClasses = useMemo(() => {
    const base =
      "inline-flex items-center gap-2 rounded-full text-xs font-medium transition-colors transition-shadow transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 shadow-sm hover:shadow active:scale-[0.98]";

    if (variant === "icon") {
      const size = "px-2.5 py-1";
      const ring = "ring-1 ring-gray-200 dark:ring-gray-800";
      const palette = copied
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 focus-visible:ring-emerald-500/40"
        : "bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-sky-500/40";
      return `${base} ${size} ${ring} ${palette} ${className}`.trim();
    }

    // pill (default)
    const size = "px-4 py-1.5";
    const extras = "backdrop-blur-sm";
    const palette = copied
      ? "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500/50"
      : "bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-600 hover:to-cyan-600 focus-visible:ring-sky-500/50";

    return `${base} ${size} ${extras} ${palette} ${className}`.trim();
  }, [variant, className, copied]);

  return (
    <button
      type="button"
      onClick={onShare}
      className={buttonClasses}
      aria-label={copied ? "Link copied" : "Share this post"}
      title={copied ? "Link copied" : "Share link"}
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M9 12.75 11.25 15l3.75-3.75a.75.75 0 1 1 1.06 1.06l-4.28 4.28a.75.75 0 0 1-1.06 0l-2.78-2.78a.75.75 0 1 1 1.06-1.06z" />
          <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75-4.365-9.75-9.75-9.75z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M13.5 5.25a.75.75 0 0 0 0 1.5h3.184l-6.22 6.22a.75.75 0 1 0 1.06 1.06l6.22-6.22V11.5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-.75-.75h-5z" />
          <path d="M6.75 4.5A2.25 2.25 0 0 0 4.5 6.75v10.5A2.25 2.25 0 0 0 6.75 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25V13a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75H11a.75.75 0 0 0 0-1.5H6.75z" />
        </svg>
      )}
      {variant !== "icon" &&
        (showLabel ? <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span> : null)}
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </button>
  );
}
