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
          background: "#faf8f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          gap: "24px",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: "#0d9488", letterSpacing: "-0.03em" }}>Bitlyst</div>
        <div
          style={{
            fontSize: 28,
            color: "#78716c",
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
                background: "#ffffff",
                border: "1px solid #e8e2d9",
                color: "#0d9488",
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
