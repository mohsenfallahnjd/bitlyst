export type UsefulLink = {
  title: string;
  url: string;
  source?: string;
  tags?: string[];
};

export const usefulLinks: UsefulLink[] = [
  {
    title: "Behind the Scenes of Bun Install",
    url: "https://bun.com/blog/behind-the-scenes-of-bun-install",
    source: "Bun",
    tags: ["bun", "install", "cli"],
  },
  {
    title: "SSR Deep Dive for React Developers",
    url: "https://www.developerway.com/posts/ssr-deep-dive-for-react-developers",
    source: "Developer Way",
    tags: ["ssr", "react", "next.js"],
  },
];
