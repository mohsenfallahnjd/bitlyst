import type { DocMeta } from "@/lib/mdSource";

const config = {
  beginner: { label: "Beginner", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  intermediate: { label: "Intermediate", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  advanced: { label: "Advanced", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800" },
};

export default function DifficultyBadge({ level }: { level?: DocMeta["level"] }) {
  if (!level) return null;
  const { label, color } = config[level];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${color}`}>
      {label}
    </span>
  );
}
