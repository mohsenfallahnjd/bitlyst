"use client";

// FlowDiagram — numbered timeline that can fork into outcomes, with an optional step-through mode.
// String props keep it MDX-friendly:
//   <FlowDiagram
//     title="What happens on a request"
//     nodes="User → CDN Edge"
//     notes="Browser asks for /logo.png|Nearest edge server checks its cache"
//     branch1="[green] Cache HIT → Instant Response"
//     branch2="[orange] Cache MISS → Origin → Cache → Respond"
//     caption="Only the first visitor pays the trip to the origin."
//   />
// Steps are split on "→". A branch is "[color] condition → step → step". Notes are "|"-separated, one per node.

import { useState } from "react";

type Color = "green" | "orange" | "cyan" | "red" | "purple";

type FlowDiagramProps = {
  nodes?: string;
  notes?: string;
  branch1?: string;
  branch2?: string;
  branch3?: string;
  branch4?: string;
  title?: string;
  caption?: string;
};

const palette: Record<Color, { chip: string; dot: string; ring: string }> = {
  green: {
    chip: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
    ring: "ring-emerald-400/60",
  },
  orange: {
    chip: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
    ring: "ring-amber-400/60",
  },
  cyan: {
    chip: "bg-brand-50 text-brand-800 border-brand-300 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800",
    dot: "bg-brand-500",
    ring: "ring-brand-400/60",
  },
  red: {
    chip: "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
    dot: "bg-red-500",
    ring: "ring-red-400/60",
  },
  purple: {
    chip: "bg-violet-50 text-violet-800 border-violet-300 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800",
    dot: "bg-violet-500",
    ring: "ring-violet-400/60",
  },
};

const splitSteps = (s: string) =>
  s
    .split(/\s*→\s*/)
    .map((x) => x.trim())
    .filter(Boolean);

function parseBranch(str: string) {
  const match = str.match(/^\[(green|orange|cyan|red|purple)\]\s*/);
  const color = (match?.[1] ?? "cyan") as Color;
  const [label, ...path] = splitSteps(match ? str.slice(match[0].length) : str);
  return { color, label: label ?? "", path };
}

export default function FlowDiagram({
  nodes,
  notes,
  branch1,
  branch2,
  branch3,
  branch4,
  title,
  caption,
}: FlowDiagramProps) {
  const steps = nodes ? splitSteps(nodes) : [];
  const stepNotes = notes ? notes.split("|").map((n) => n.trim()) : [];
  const branches = [branch1, branch2, branch3, branch4].filter((b): b is string => !!b).map(parseBranch);

  // Step-through: steps first, then each branch counts as one more stop
  const total = steps.length + branches.length;
  const [active, setActive] = useState<number | null>(null);
  const stepping = active !== null;
  const state = (i: number) => (!stepping ? "idle" : i === active ? "current" : i < active ? "done" : "todo");

  return (
    <figure className="not-prose my-8 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-5 sm:p-6 text-sm">
      {(title || total > 2) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title ? (
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>
          ) : (
            <span />
          )}
          {total > 2 && (
            <div className="flex shrink-0 items-center gap-1 text-xs">
              {stepping && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActive((a) => Math.max(0, (a ?? 0) - 1));
                    }}
                    disabled={active === 0}
                    className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
                    aria-label="Previous step"
                  >
                    ◀
                  </button>
                  <span className="tabular-nums text-gray-500 dark:text-gray-400" aria-live="polite">
                    {(active ?? 0) + 1}/{total}
                  </span>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setActive((a) => (a === null ? 0 : a + 1 >= total ? null : a + 1));
                }}
                className="rounded-md border border-gray-200 dark:border-gray-700 px-2.5 py-1 font-medium text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                {!stepping ? "▶ Step through" : (active ?? 0) + 1 >= total ? "Done ✓" : "Next ▶"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main timeline */}
      {steps.length > 0 && (
        <ol className="relative">
          {steps.map((step, i) => {
            const s = state(i);
            const last = i === steps.length - 1 && branches.length === 0;
            return (
              <li
                key={`${step}-${i}`}
                className={`relative flex gap-3 pb-4 transition-opacity duration-300 ${s === "todo" ? "opacity-30" : ""}`}
              >
                {/* connector line to the next step */}
                {!last && (
                  <span className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-200 dark:bg-gray-700" aria-hidden />
                )}
                <span
                  className={`relative z-10 flex size-[27px] shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tabular-nums transition-all ${
                    s === "current"
                      ? "border-brand-500 bg-brand-600 text-white ring-4 ring-brand-500/20"
                      : "border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 pt-[3px]">
                  <p
                    className={`font-semibold leading-snug ${s === "current" ? "text-gray-900 dark:text-gray-50" : "text-gray-800 dark:text-gray-200"}`}
                  >
                    {step}
                  </p>
                  {stepNotes[i] && (
                    <p className="mt-0.5 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
                      {stepNotes[i]}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {/* Fork into outcomes */}
      {branches.length > 0 && (
        <div className={steps.length > 0 ? "relative pl-[13px]" : ""}>
          {steps.length > 0 && (
            <div className="flex items-center gap-2 pb-3" aria-hidden>
              <span className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {branches.length > 1 ? "then it depends" : "then"}
              </span>
            </div>
          )}
          <div className={`grid gap-3 ${branches.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {branches.map((b, bi) => {
              const s = state(steps.length + bi);
              const c = palette[b.color];
              return (
                <div
                  key={`${b.label}-${bi}`}
                  className={`rounded-xl border border-gray-200/80 dark:border-gray-800 p-3.5 transition-all duration-300 ${
                    s === "todo" ? "opacity-30" : ""
                  } ${s === "current" ? `ring-2 ${c.ring}` : ""}`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${c.chip}`}
                  >
                    <span className={`size-1.5 rounded-full ${c.dot}`} aria-hidden />
                    {b.label}
                  </span>
                  {b.path.length > 0 && (
                    <ol className="mt-2.5 space-y-1.5">
                      {b.path.map((p, pi) => (
                        <li
                          key={`${p}-${pi}`}
                          className="flex items-start gap-2 text-[13px] text-gray-700 dark:text-gray-300"
                        >
                          <span className="mt-[1px] text-gray-400 dark:text-gray-600" aria-hidden>
                            {pi === 0 ? "↳" : "→"}
                          </span>
                          <span className="leading-snug">{p}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {caption && (
        <figcaption className="mt-5 border-t border-gray-200/70 dark:border-gray-800 pt-3 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
