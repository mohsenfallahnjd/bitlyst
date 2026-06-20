"use client";

import { useRef, useState } from "react";

export default function CodeBlock({ children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  // Only extract lang if className actually starts with "language-"
  const codeClassName = (children as any)?.props?.className || "";
  const lang = codeClassName.startsWith("language-")
    ? codeClassName.replace("language-", "").split(" ")[0]
    : "";

  const handleCopy = async () => {
    const text = preRef.current?.textContent?.trim() || "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="relative my-5 rounded-xl overflow-hidden shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e2227] border-b border-white/5">
        <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 hover:text-gray-200 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5 text-emerald-400">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
              </svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <pre
        ref={preRef}
        style={{ backgroundColor: "#282c34" }}
        className="overflow-x-auto p-5 text-gray-100 text-sm leading-relaxed"
      >
        {children}
      </pre>
    </div>
  );
}
