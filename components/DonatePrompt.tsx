"use client";

import { useEffect, useMemo, useState } from "react";
import { cryptoAddresses } from "@/lib/donations";

type DonatePromptProps = {
  className?: string;
};

const ctaTemplates: string[] = [
  "I need an AI sub to dig deeper — can you gift 1 month of GPT? 🤖✨",
  "I want to relax and write the next post — can you get me Spotify? 🎧💆‍♂️",
  "I need a bubble lamp so I can write in cozy light 🫧💡",
  "Enjoyed this read? Buy me a coffee and I'll brew more ☕️📚",
  "This helped you? A tiny tip keeps the servers happy 🖥️🔧",
  "Power my keystrokes with a slice of pizza? 🍕⌨️",
  "One more coffee and I promise more diagrams ☕️📈",
  "GPT credits = faster answers, better posts 🤝🚀",
  "Spotify beats + typing = next article sooner 🎶✍️",
  "Help me keep the lights on (literally) 💡😅",
  "Tip me a coin, I’ll turn it into docs 🪙➡️📘",
  "Small donation, big motivation 🙏⚡️",
];

export default function DonatePrompt({ className = "" }: DonatePromptProps) {
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);
  const [cta, setCta] = useState<string | null>(null);
  useEffect(() => {
    const index = Math.floor(Math.random() * ctaTemplates.length);
    setCta(ctaTemplates[index]);
  }, []);

  const topOptions = useMemo(() => {
    return cryptoAddresses.filter((c) => c.recommended).slice(0, 3);
  }, []);

  const handleCopy = async (symbol: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedSymbol(symbol);
      setTimeout(() => setCopiedSymbol(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <aside
      className={`mt-12 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-5 ${className}`}
      aria-label="Support the author"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 text-amber-600 dark:text-amber-400">💛</div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Support this blog</h3>
          {cta && <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{cta}</p>}

          <div className="flex flex-wrap gap-2">
            {topOptions.map((opt) => (
              <button
                key={opt.symbol}
                onClick={() => handleCopy(opt.symbol, opt.address)}
                className="group relative inline-flex items-center gap-2 rounded-full border border-amber-300/70 dark:border-amber-700/70 bg-white/80 dark:bg-gray-900/40 px-3 py-1.5 text-sm text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-gray-900"
                title={`Copy ${opt.symbol} address`}
              >
                <span className="font-medium">{opt.symbol}</span>
                <span className="text-[11px] text-amber-700/80 dark:text-amber-300/80">Copy</span>
                {copiedSymbol === opt.symbol && (
                  <span className="ml-1 text-[11px] text-green-700 dark:text-green-300">Copied!</span>
                )}
              </button>
            ))}
          </div>

          <details className="mt-3 group">
            <summary className="cursor-pointer text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
              More wallets
            </summary>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {cryptoAddresses.map((c) => (
                <div
                  key={c.symbol}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {c.name} <span className="text-xs text-gray-500">{c.symbol}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(c.symbol, c.address)}
                      className="text-xs text-blue-700 dark:text-blue-300 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                  <code className="mt-2 block break-all text-[11px] text-gray-700 dark:text-gray-300">{c.address}</code>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </aside>
  );
}
