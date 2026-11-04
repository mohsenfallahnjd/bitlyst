// ParallelFlow — waterfall timeline: sequential work stacks end-to-end, concurrent work starts together.
// Usage:
//   <ParallelFlow tracks="fetch /a|fetch /b|fetch /c" label="Sequential" color="orange" />
//   <ParallelFlow tracks="fetch /a|fetch /b|fetch /c" merge="await Promise.all" label="Concurrent" color="green" />
//   durations="3|1|2" (optional, relative units) makes bars different lengths.
// No `merge` = sequential; with `merge` = all tracks run at once and join there.

type ParallelFlowProps = {
  tracks: string;
  merge?: string;
  color?: "cyan" | "green" | "orange" | "red";
  label?: string;
  durations?: string;
};

const colors = {
  cyan: { bar: "bg-brand-500/85 dark:bg-brand-400/80", text: "text-brand-700 dark:text-brand-300" },
  green: { bar: "bg-emerald-500/85 dark:bg-emerald-400/75", text: "text-emerald-700 dark:text-emerald-300" },
  orange: { bar: "bg-amber-500/85 dark:bg-amber-400/75", text: "text-amber-700 dark:text-amber-300" },
  red: { bar: "bg-red-500/85 dark:bg-red-400/75", text: "text-red-700 dark:text-red-300" },
};

export default function ParallelFlow({ tracks, merge, color = "cyan", label, durations }: ParallelFlowProps) {
  const items = tracks
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);
  const lengths = items.map((_, i) => Number(durations?.split("|")[i]) || 1);
  const parallel = !!merge;
  const c = colors[color];

  // start offsets in "time units"
  const starts = lengths.map((_, i) => (parallel ? 0 : lengths.slice(0, i).reduce((s, n) => s + n, 0)));
  const sequentialTotal = lengths.reduce((s, n) => s + n, 0);
  const total = parallel ? Math.max(...lengths) : sequentialTotal;
  // keep both variants on the same scale so two diagrams in a post compare honestly
  const scale = sequentialTotal;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5 sm:p-6 text-sm">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        {label && (
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</p>
        )}
        {!label && (
          <p className={`text-xs font-medium ${c.text}`}>
            {parallel ? "all start together" : "each waits for the previous"}
          </p>
        )}
      </div>

      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="grid grid-cols-1 gap-1 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-center sm:gap-3"
          >
            <span className="truncate font-mono text-[12px] text-gray-600 dark:text-gray-300" title={item}>
              {item}
            </span>
            <div className="relative h-6 rounded-md bg-gray-100 dark:bg-gray-800/70">
              <div
                className={`absolute inset-y-0 rounded-md ${c.bar}`}
                style={{
                  left: `${(starts[i] / scale) * 100}%`,
                  width: `${(lengths[i] / scale) * 100}%`,
                  animation: "fadeIn 0.5s ease-out both",
                  animationDelay: `${parallel ? 0 : i * 180}ms`,
                }}
              />
            </div>
          </div>
        ))}

        {/* time axis + result */}
        <div className="grid grid-cols-1 gap-1 pt-1 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-center sm:gap-3">
          <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">time →</span>
          <div className="relative h-5">
            <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200 dark:bg-gray-700" />
            <div
              className="absolute top-0 flex h-full items-center"
              style={{ left: `${(total / scale) * 100}%`, transform: "translateX(-100%)" }}
            >
              <span className="whitespace-nowrap rounded-full border border-gray-300 dark:border-gray-600 bg-surface-light dark:bg-surface-dark px-2 text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                {merge ? `${merge} ✓` : "done ✓"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 border-t border-gray-200/70 dark:border-gray-800 pt-3 text-[13px] text-gray-500 dark:text-gray-400">
        Total time:{" "}
        <strong className="font-semibold text-gray-800 dark:text-gray-100">
          {parallel ? "the slowest one" : `all ${items.length} added up`}
        </strong>
        {parallel && items.length > 1 && <> — instead of all {items.length} added up.</>}
      </figcaption>
    </figure>
  );
}
