// ParallelFlow — shows tracks running in parallel, optionally merging
// Usage:
//   <ParallelFlow tracks="fetch /a|fetch /b|fetch /c" merge="await Promise.all" color="cyan" />
//   <ParallelFlow tracks="A|B|C" />  (no merge = sequential visual)

type ParallelFlowProps = {
  tracks: string;       // pipe-separated track labels
  merge?: string;       // label at the merge point (if concurrent)
  color?: "cyan" | "green" | "orange" | "red";
  label?: string;       // optional top label
};

const colors = {
  cyan:   { track: "bg-cyan-50 dark:bg-cyan-950/20 border-cyan-300 dark:border-cyan-700 text-cyan-900 dark:text-cyan-200", merge: "bg-cyan-100 dark:bg-cyan-900/40 border-cyan-400 dark:border-cyan-600 text-cyan-800 dark:text-cyan-200", line: "border-cyan-200 dark:border-cyan-800" },
  green:  { track: "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700 text-green-900 dark:text-green-200", merge: "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200", line: "border-green-200 dark:border-green-800" },
  orange: { track: "bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200", merge: "bg-orange-100 dark:bg-orange-900/40 border-orange-400 dark:border-orange-600 text-orange-800 dark:text-orange-200", line: "border-orange-200 dark:border-orange-800" },
  red:    { track: "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700 text-red-900 dark:text-red-200", merge: "bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600 text-red-800 dark:text-red-200", line: "border-red-200 dark:border-red-800" },
};

export default function ParallelFlow({ tracks, merge, color = "cyan", label }: ParallelFlowProps) {
  const items = tracks.split("|").map((t) => t.trim()).filter(Boolean);
  const c = colors[color];
  const isParallel = !!merge;

  return (
    <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5 text-sm not-prose">
      {label && (
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">{label}</p>
      )}

      {isParallel ? (
        /* Parallel layout: tracks stacked, all connecting to merge point */
        <div className="flex items-center gap-3">
          {/* Left: stacked tracks */}
          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <span
                key={i}
                className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-semibold whitespace-nowrap ${c.track}`}
                style={{ animation: "fadeUp 0.4s ease-out both", animationDelay: `${i * 60}ms` }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Bracket lines */}
          <div className="flex flex-col items-end self-stretch justify-center" style={{ minWidth: 20 }}>
            <div className={`border-t-2 border-r-2 rounded-tr-md ${c.line}`} style={{ height: "50%", width: 16 }} />
            <div className={`border-b-2 border-r-2 rounded-br-md ${c.line}`} style={{ height: "50%", width: 16 }} />
          </div>

          {/* Arrow */}
          <span className="text-gray-400 dark:text-gray-600 text-sm select-none">→</span>

          {/* Merge node */}
          <span
            className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-semibold whitespace-nowrap ${c.merge}`}
            style={{ animation: "fadeUp 0.4s ease-out both", animationDelay: `${items.length * 60}ms` }}
          >
            {merge}
          </span>
        </div>
      ) : (
        /* Sequential layout: A → B → C */
        <div className="flex items-center gap-2 flex-wrap">
          {items.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2"
              style={{ animation: "fadeUp 0.4s ease-out both", animationDelay: `${i * 70}ms` }}
            >
              <span className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-semibold whitespace-nowrap ${c.track}`}>
                {item}
              </span>
              {i < items.length - 1 && (
                <span className="text-gray-400 dark:text-gray-600 text-sm select-none">→</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
