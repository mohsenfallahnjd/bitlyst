import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Bitlyst — Bite-sized JavaScript, React, and Next.js tips";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Bite-sized JavaScript, React, and Next.js tips",
    tags: ["javascript", "react", "nextjs"],
    neutral: true,
  });
}
