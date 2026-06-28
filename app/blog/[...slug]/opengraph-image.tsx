import { ImageResponse } from "next/og";
import { loadMarkdownBySlug, loadMarkdownDocs } from "@/lib/mdSource";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string[] } }) {
  const slugPath = params.slug.join("/");
  const post = loadMarkdownBySlug(slugPath);

  const title = post?.title ?? "Bitlyst";
  const summary = post?.summary ?? "Bite-sized JavaScript, React, and Next.js tips";
  const tags = post?.tags?.slice(0, 3) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ color: "#3291ff", fontSize: 28, fontWeight: 700 }}>Bitlyst</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: title.length > 60 ? 44 : 56,
              fontWeight: 800,
              color: "#fafafa",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: 950,
            }}
          >
            {title}
          </div>

          {summary && (
            <div
              style={{
                fontSize: 22,
                color: "#a1a1aa",
                maxWidth: 850,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {summary}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: "#1a1a2e",
                  border: "1px solid #27272a",
                  color: "#3291ff",
                  padding: "6px 16px",
                  borderRadius: "999px",
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span style={{ color: "#52525b", fontSize: 18 }}>bitlyst.vercel.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

export async function generateStaticParams() {
  const all = loadMarkdownDocs();
  return all.map((p) => ({ slug: p.slug.split("/") }));
}
