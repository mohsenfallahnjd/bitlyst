"use client";

import { useState } from "react";

export default function ShareFAB({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({ title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share this post"
      className="xl:hidden fixed bottom-6 right-4 z-40 flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg px-4 py-3 text-sm font-medium transition-all"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
            <path d="M11.553 1.106a.75.75 0 0 0-.838.343L9.44 3.39 7.535 2.18a.75.75 0 0 0-.942.126l-4.5 5a.75.75 0 0 0 .093 1.087l1.92 1.44-1.263 2.525A.75.75 0 0 0 3.5 13.5h9a.75.75 0 0 0 .67-1.086L11.553 1.106ZM4.752 11 5.6 9.307l3.1 2.325-3.948-.632ZM10.5 11H8.333l-3.6-2.7 3.474-3.86 1.688 1.126a.75.75 0 0 0 .93-.111L11.88 4.3 10.5 11Z" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
