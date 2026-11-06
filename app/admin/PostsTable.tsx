"use client";
import Link from "next/link";
import { useState } from "react";
import type { PostRow } from "@/lib/adminReport";

const COLUMNS = [
  { key: "views", label: "Views" },
  { key: "views7", label: "7 days" },
  { key: "views30", label: "30 days" },
  { key: "reactions", label: "Reactions" },
  { key: "comments", label: "Comments" },
] as const;

type SortKey = (typeof COLUMNS)[number]["key"] | "publishedTime";

export default function PostsTable({ rows }: { rows: PostRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const sorted = [...rows].sort((a, b) =>
    sortKey === "publishedTime" ? b.publishedTime.localeCompare(a.publishedTime) : b[sortKey] - a[sortKey]
  );

  const header = (key: SortKey, label: string, align: string) => (
    <th key={key} aria-sort={sortKey === key ? "descending" : undefined} className={`py-2 px-2 font-medium ${align}`}>
      <button
        type="button"
        onClick={() => setSortKey(key)}
        className={
          sortKey === key ? "text-gray-900 dark:text-gray-100" : "hover:text-gray-800 dark:hover:text-gray-200"
        }
      >
        {label}
        {sortKey === key ? " ↓" : ""}
      </button>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
            <th className="py-2 pr-4 text-left font-medium">Post ({rows.length})</th>
            {header("publishedTime", "Published", "text-left")}
            {COLUMNS.map((c) => header(c.key, c.label, "text-right"))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.slug} className="border-b border-gray-100 dark:border-gray-800/60">
              <td className="py-2 pr-4 max-w-xs truncate">
                <Link href={`/p/${r.slug}`} className="text-gray-700 dark:text-gray-300 hover:underline">
                  {r.title}
                </Link>
              </td>
              <td className="py-2 px-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                {r.publishedTime}
              </td>
              {COLUMNS.map((c) => (
                <td key={c.key} className="py-2 px-2 text-right tabular-nums text-gray-700 dark:text-gray-300">
                  {r[c.key].toLocaleString("en-US")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
