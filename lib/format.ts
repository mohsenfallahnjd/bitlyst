const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

/** 1234 → "1.2K" */
export function formatCount(n: number): string {
  return n < 1000 ? String(n) : compact.format(n);
}

/** "Event Loop" → "event-loop" — one URL-safe key per topic, merging spelling variants. */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
