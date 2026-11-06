"use client";
import Link from "next/link";
import { useState } from "react";
import type { AdminReport, PostRow } from "@/lib/adminReport";

const count = (n: number) => n.toLocaleString("en-US");
const dayLabel = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const headingCls = "text-sm font-semibold text-gray-900 dark:text-gray-100";
const mutedCls = "text-xs text-gray-500 dark:text-gray-400";
// #3a52ee on light and #5672fa on dark pass the dataviz palette checks against their surfaces
const markCls = "bg-brand-600 dark:bg-brand-500";

export default function Overview({ report, pendingCount }: { report: AdminReport; pendingCount: number }) {
  const { totals, rows, daily, tags, statsAvailable } = report;

  return (
    <div className="space-y-10">
      {!statsAvailable && (
        <p className="text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3">
          Redis isn't reachable, so views and reactions read zero. Check <code>REDIS_URL</code>.
        </p>
      )}

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <Stat label="Views, all time" value={count(totals.allTime)} />
        <Stat label="Views, last 7 days" value={count(totals.last7)} note={weekChange(totals.last7, totals.prev7)} />
        <Stat label="Views, last 30 days" value={count(totals.last30)} />
        <Stat label="Posts" value={count(rows.length)} />
        <Stat label="Comments to review" value={count(pendingCount)} />
      </dl>

      <section>
        <h2 className={headingCls}>Views per day</h2>
        <p className={`${mutedCls} mb-4`}>Last 30 days, one read per visitor per post per day (UTC)</p>
        <DailyChart daily={daily} />
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <TopPosts rows={rows} />
        <section className="min-w-0">
          <h2 className={headingCls}>Top tags</h2>
          <p className={`${mutedCls} mb-4`}>All-time views. A post counts toward each of its tags.</p>
          <BarList
            items={tags.map((t) => ({
              key: t.tag,
              label: t.tag,
              value: t.views,
              note: `${t.posts} ${t.posts === 1 ? "post" : "posts"}`,
            }))}
          />
        </section>
      </div>
    </div>
  );
}

/** Blank when there's no earlier week to compare with, since a percentage from zero means nothing. */
function weekChange(current: number, previous: number) {
  if (previous === 0) {
    return undefined;
  }
  const change = Math.round(((current - previous) / previous) * 100);
  return `${change > 0 ? "+" : ""}${change}% vs previous 7 days`;
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <dt className={mutedCls}>{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">{value}</dd>
      {note && <dd className={`${mutedCls} mt-0.5`}>{note}</dd>}
    </div>
  );
}

/** Round whole-number steps from 0, so the axis reads 0, 10, 20, 30 rather than 0, 7, 14, 21, 28. */
function axisTicks(max: number) {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(max / 4, 1)));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((v) => v >= max / 4) as number;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: top / step + 1 }, (_, i) => top - i * step);
}

function DailyChart({ daily }: { daily: AdminReport["daily"] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (daily.every((d) => d.views === 0)) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No views recorded in the last 30 days.</p>;
  }

  const ticks = axisTicks(Math.max(...daily.map((d) => d.views)));
  const top = ticks[0];
  const active = hovered === null ? null : daily[hovered];

  return (
    <div>
      <div className="flex gap-2">
        <div className="h-40 flex flex-col justify-between text-right text-[11px] leading-none tabular-nums text-gray-500 dark:text-gray-400">
          {ticks.map((t) => (
            <span key={t}>{count(t)}</span>
          ))}
        </div>
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-x-0 top-0 h-40 flex flex-col justify-between pointer-events-none" aria-hidden>
            {ticks.map((t) => (
              <div key={t} className="h-px bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
          <div className="relative h-40 flex items-end gap-0.5" onMouseLeave={() => setHovered(null)}>
            {daily.map((d, i) => (
              // the hit target is the whole column, so short bars and empty days are still easy to hover
              <div
                key={d.day}
                className="flex-1 min-w-0 h-full flex items-end justify-center"
                onMouseEnter={() => setHovered(i)}
              >
                {d.views > 0 && (
                  <div
                    className={`${markCls} w-full max-w-6 rounded-t ${hovered !== null && hovered !== i ? "opacity-50" : ""}`}
                    style={{ height: `${(d.views / top) * 100}%`, minHeight: 2 }}
                  />
                )}
              </div>
            ))}
          </div>
          {active && hovered !== null && (
            <div
              className="absolute top-0 z-10 pointer-events-none whitespace-nowrap rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-700 dark:text-gray-200 shadow-sm"
              style={
                hovered < daily.length / 2
                  ? { left: `${((hovered + 1) / daily.length) * 100}%`, marginLeft: 4 }
                  : { right: `${((daily.length - hovered) / daily.length) * 100}%`, marginRight: 4 }
              }
            >
              {dayLabel(active.day)}: <span className="font-medium tabular-nums">{count(active.views)}</span>{" "}
              {active.views === 1 ? "view" : "views"}
            </div>
          )}
          <div className="flex justify-between mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <span>{dayLabel(daily[0].day)}</span>
            <span>{dayLabel(daily[daily.length - 1].day)}</span>
          </div>
        </div>
      </div>

      <details className="mt-3">
        <summary className={`${mutedCls} cursor-pointer`}>Show as table</summary>
        <table className="mt-2 text-xs text-gray-700 dark:text-gray-300">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="font-medium pr-6 py-1">Day</th>
              <th className="font-medium text-right py-1">Views</th>
            </tr>
          </thead>
          <tbody>
            {[...daily].reverse().map((d) => (
              <tr key={d.day}>
                <td className="pr-6 py-0.5">{dayLabel(d.day)}</td>
                <td className="text-right tabular-nums py-0.5">{count(d.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

const WINDOWS = [
  { key: "views7", label: "7 days" },
  { key: "views30", label: "30 days" },
  { key: "views", label: "All time" },
] as const;

function TopPosts({ rows }: { rows: PostRow[] }) {
  const [windowKey, setWindowKey] = useState<(typeof WINDOWS)[number]["key"]>("views7");
  const items = rows
    .filter((r) => r[windowKey] > 0)
    .sort((a, b) => b[windowKey] - a[windowKey])
    .slice(0, 10)
    .map((r) => ({ key: r.slug, label: r.title, href: `/p/${r.slug}`, value: r[windowKey] }));

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <h2 className={headingCls}>Most viewed posts</h2>
        <div className="flex gap-1">
          {WINDOWS.map((w) => (
            <button
              key={w.key}
              type="button"
              onClick={() => setWindowKey(w.key)}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                windowKey === w.key
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>
      <p className={`${mutedCls} mb-4`}>Top 10 by views</p>
      <BarList items={items} />
    </section>
  );
}

function BarList({ items }: { items: { key: string; label: string; value: number; href?: string; note?: string }[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No views in this period.</p>;
  }
  const max = Math.max(...items.map((i) => i.value));
  return (
    <ol className="space-y-3">
      {items.map((item) => (
        <li key={item.key}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            {item.href ? (
              <Link href={item.href} className="truncate text-gray-700 dark:text-gray-300 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="truncate text-gray-700 dark:text-gray-300">
                {item.label}
                {item.note && <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{item.note}</span>}
              </span>
            )}
            <span className="shrink-0 tabular-nums font-medium text-gray-900 dark:text-gray-100">
              {count(item.value)}
            </span>
          </div>
          <div className={`${markCls} mt-1 h-1.5 rounded-r`} style={{ width: `${(item.value / max) * 100}%` }} />
        </li>
      ))}
    </ol>
  );
}
