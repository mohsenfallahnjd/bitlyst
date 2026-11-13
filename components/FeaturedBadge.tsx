type Feature = { name: string; url: string };

type Kind = "podcast" | "newsletter" | "publication";

/** Guess the feature type from its name/URL so it gets a fitting icon and label. */
export function featureKind({ name, url }: Feature): Kind {
  const s = `${name} ${url}`.toLowerCase();
  if (/podcast|spotify|episode|apple\.com\/.*podcast/.test(s)) return "podcast";
  if (/weekly|newsletter|digest|issues?\//.test(s)) return "newsletter";
  return "publication";
}

const KIND_LABEL: Record<Kind, string> = {
  podcast: "Podcast episode",
  newsletter: "Newsletter",
  publication: "Republished",
};

export function FeatureIcon({ kind, className = "size-3.5" }: { kind: Kind; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "podcast")
    return (
      <svg {...common}>
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
      </svg>
    );
  if (kind === "newsletter")
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
    </svg>
  );
}

/** Pill badge shown under a post's cover: icon + "Featured in X" (or "Listen on X" for podcasts). */
export default function FeaturedBadge({ feature }: { feature: Feature }) {
  const kind = featureKind(feature);
  return (
    <a
      href={feature.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${KIND_LABEL[kind]}: ${feature.name}`}
      className="group inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-400/10 dark:to-orange-400/10 py-0.5 pl-1 pr-2 font-semibold text-amber-900 dark:text-amber-200 ring-1 ring-amber-300/70 dark:ring-amber-400/30 hover:ring-amber-500 hover:-translate-y-px transition"
    >
      <span className="grid size-4 place-items-center rounded-full bg-amber-400/90 text-white dark:bg-amber-400 dark:text-gray-900">
        <FeatureIcon kind={kind} className="size-2.5" />
      </span>
      <span>
        <span className="font-medium text-amber-700/80 dark:text-amber-300/70">
          {kind === "podcast" ? "Listen on" : "Featured in"}
        </span>{" "}
        {feature.name}
      </span>
      <span aria-hidden className="text-amber-600/70 transition-transform group-hover:translate-x-0.5 dark:text-amber-300/60">
        ↗
      </span>
    </a>
  );
}

export { KIND_LABEL };
export type { Feature, Kind };
