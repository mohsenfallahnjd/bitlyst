"use client";

import type { FC } from "react";

import { cryptoAddresses } from "@/lib/donations";

export const DonateSection: FC = () => {
  return (
    <div
      className="mt-12 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl py-8 px-4 md:px-12 border border-green-200/50 dark:border-green-800/50"
      id="donate"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Support Bitlyst</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Enjoying the bite-sized tech tips? Your support helps keep Bitlyst running and enables more high-quality
          content creation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">☕ Coffee & Development</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your donations help cover hosting costs, development time, and enable me to create more valuable content for
            the developer community.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">🚀 Future Plans</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Support helps fund new features, better infrastructure, and potentially video content and interactive
            tutorials.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-6 md:px-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">💰 Cryptocurrency Donations</h3>

        <div className="grid gap-4">
          {cryptoAddresses.map((crypto) => (
            <div key={crypto.symbol} className="group relative">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{crypto.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{crypto.symbol}</span>
                  {crypto.recommended && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full sm:inline hidden">
                      Recommended
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(crypto.address)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors opacity-0 group-hover:opacity-100"
                  title="Copy address"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <code className="block text-xs text-gray-700 dark:text-gray-300 break-all font-mono">
                  {crypto.address}
                </code>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">Recommended cryptocurrencies</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                BTC, ETH, and USDC are recommended for broad support and stable value. All donations are greatly
                appreciated, regardless of the cryptocurrency used.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Thank you for supporting Bitlyst! 🙏 <br /> Every contribution helps make better content possible.
        </p>
      </div>
    </div>
  );
};
