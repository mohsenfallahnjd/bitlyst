import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bitlyst",
    short_name: "Bitlyst",
    description: "Bite-sized JavaScript, React, and Next.js tips",
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#3291ff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
