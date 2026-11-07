import { BRAND, BRAND_LIGHT, topicColor } from "@/lib/topics";

/**
 * Stand-in cover for posts without a `cover` image: the logo's two list rows on brand blue,
 * with the top row in the post's topic colour (same scheme as the generated share card).
 * `hero` tops the post header (1200×630, shows the main tag); `thumb` fills a post card thumbnail.
 */
export default function CoverArt({
  tags = [],
  variant,
  className,
}: {
  tags?: string[];
  variant: "hero" | "thumb";
  className?: string;
}) {
  const { bar } = topicColor(tags);

  if (variant === "thumb") {
    return (
      <svg viewBox="0 0 240 160" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="160" fill={BRAND} />
        <circle cx="62" cy="58" r="20" fill={bar} />
        <rect x="96" y="38" width="180" height="40" rx="20" fill={bar} />
        <circle cx="62" cy="106" r="20" fill={BRAND_LIGHT} />
        <rect x="96" y="86" width="110" height="40" rx="20" fill={BRAND_LIGHT} />
      </svg>
    );
  }

  const [tag] = tags;

  return (
    <svg viewBox="0 0 1200 630" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="1200" height="630" fill={BRAND} />
      <circle cx="470" cy="215" r="70" fill={bar} />
      <rect x="590" y="145" width="680" height="140" rx="70" fill={bar} />
      <circle cx="470" cy="385" r="70" fill={BRAND_LIGHT} />
      <rect x="590" y="315" width="420" height="140" rx="70" fill={BRAND_LIGHT} />
      {tag && (
        <text x="72" y="566" fill="#ffffff" fontSize="34" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
          #{tag.replace(/\s+/g, "-")}
        </text>
      )}
    </svg>
  );
}
