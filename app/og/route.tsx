import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { loadMarkdownBySlug } from "@/lib/mdSource";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const post = slug ? loadMarkdownBySlug(slug) : null;
  const title = post?.title ?? "Bitlyst";
  const summary = post?.summary ?? "Bite-sized JavaScript, React, and Next.js tips";
  const tags = post?.tags?.slice(0, 3) ?? [];

  return new ImageResponse(
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
      <div style={{ display: "flex", alignItems: "center" }}>
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
            }}
          >
            {summary.length > 120 ? summary.slice(0, 120) + "…" : summary}
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
    </div>,
    { width: 1200, height: 630 }
  );
}
