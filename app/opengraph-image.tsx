import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          gap: "24px",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: "#3291ff", letterSpacing: "-0.03em" }}>Bitlyst</div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Bite-sized JavaScript, React, and Next.js tips
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          {["JavaScript", "React", "Next.js"].map((tag) => (
            <span
              key={tag}
              style={{
                background: "#1a1a2e",
                border: "1px solid #27272a",
                color: "#3291ff",
                padding: "8px 20px",
                borderRadius: "999px",
                fontSize: 20,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
