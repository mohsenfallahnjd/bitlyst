import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND, BRAND_LIGHT, DEFAULT_TOPIC, topicColor, WHITE } from "./topics";

export const OG_SIZE = { width: 1200, height: 630 };

// next/og's default font has a single weight, so bold text needs its own font files
const [interBold, monoMedium] = await Promise.all([
  readFile(join(process.cwd(), "lib/og-fonts/inter-latin-700-normal.woff")),
  readFile(join(process.cwd(), "lib/og-fonts/jetbrains-mono-latin-500-normal.woff")),
]);

/** Long titles step down so every post fits in three lines. */
const titleSize = (title: string) => {
  if (title.length <= 32) {
    return 88;
  }
  return title.length <= 60 ? 76 : 62;
};

/** Non-breaking spaces that prevent awkward wraps: a line ending on "A", starting with "—", or a lone "0" at the end. */
const tidyLineBreaks = (title: string) =>
  title
    .replace(/ (a|an|the) /gi, " $1 ")
    .replace(/ — /g, " — ")
    .replace(/ (\S{1,3})$/, " $1");

/** The logo's two list rows, enlarged and running off the right edge. The top row carries the topic colour. */
function Motif({ bar }: { bar: string }) {
  return (
    <svg
      width="620"
      height="180"
      viewBox="0 0 620 180"
      style={{ position: "absolute", top: 44, right: 0 }}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="40" fill={bar} />
      <rect x="112" y="0" width="620" height="80" rx="40" fill={bar} />
      <circle cx="40" cy="140" r="40" fill={BRAND_LIGHT} />
      <rect x="112" y="100" width="620" height="80" rx="40" fill={BRAND_LIGHT} />
    </svg>
  );
}

function Logo() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill={WHITE} />
      <circle cx="18" cy="26" r="4.5" fill={BRAND} />
      <rect x="28" y="21.5" width="22" height="9" rx="4.5" fill={BRAND} />
      <circle cx="18" cy="42" r="4.5" fill={BRAND} />
      <rect x="28" y="37.5" width="15" height="9" rx="4.5" fill={BRAND} />
    </svg>
  );
}

type OgImageOptions = {
  title: string;
  tags?: string[];
  /** Minutes, shown inside the coloured bar. */
  readingTime?: number;
  /** Use the default colour whatever the tags are, for pages that cover every topic. */
  neutral?: boolean;
};

export function renderOgImage({ title, tags = [], readingTime, neutral = false }: OgImageOptions) {
  const { bar, ink } = neutral ? DEFAULT_TOPIC : topicColor(tags);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 72px",
        background: BRAND,
        color: WHITE,
        fontFamily: "Inter",
      }}
    >
      <Motif bar={bar} />

      {readingTime ? (
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 728,
            height: 80,
            display: "flex",
            alignItems: "center",
            color: ink,
            fontSize: 38,
            letterSpacing: "-0.02em",
          }}
        >
          {readingTime} min read
        </div>
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Logo />
        <span style={{ fontSize: 38, letterSpacing: "-0.02em" }}>Bitlyst</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div
          style={{
            display: "block",
            lineClamp: 3,
            fontSize: titleSize(title),
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
          }}
        >
          {tidyLineBreaks(title)}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            {tags.slice(0, 3).map((tag) => (
              <span key={tag}>#{tag.replace(/\s+/g, "-")}</span>
            ))}
          </div>
          <span>bitlyst.blog</span>
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: monoMedium, weight: 500, style: "normal" },
      ],
    }
  );
}
