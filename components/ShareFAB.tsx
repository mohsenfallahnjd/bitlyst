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
            <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354ZM11.189 6.25 9.75 4.81l-6.286 6.287a.25.25 0 0 0-.064.108l-.558 1.953 1.953-.558a.249.249 0 0 0 .108-.064Z" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
