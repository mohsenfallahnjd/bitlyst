"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const LEVELS = [
  { key: "beginner", label: "Beginner", active: "text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20" },
  { key: "intermediate", label: "Intermediate", active: "text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20" },
  { key: "advanced", label: "Advanced", active: "text-red-700 dark:text-red-400 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20" },
];

const idle = "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900";

export default function LevelFilter() {
  const sp = useSearchParams();
  const level = sp.get("level")?.toLowerCase() ?? "";

  return (
    <div className="flex flex-wrap gap-2">
      {LEVELS.map((l) => {
        const isActive = level === l.key;
        return (
          <Link
            key={l.key}
            href={isActive ? "/blog" : `/blog?level=${l.key}`}
            className={`text-xs rounded-full px-3 py-1 border font-medium transition-colors ${isActive ? l.active : idle}`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
