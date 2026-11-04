export type UsefulLink = {
  title: string;
  url: string;
  description?: string;
  tags?: string[];

  sharedBy?: {
    name: string;
  };
};

export const usefulLinks: UsefulLink[] = [
  {
    title: "How Turbopack Chunks Your JavaScript",
    url: "https://nextjs.org/blog/turbopack-chunking",
    description:
      "How Turbopack splits code into chunks to speed up page loads and share code across pages, plus the new chunking features in Next.js 16.3.",
    tags: ["nextjs", "turbopack", "bundling", "performance"],
  },
  {
    title: "How We Closed 1,500 GitHub Issues in One Month",
    url: "https://nextjs.org/blog/how-we-closed-1500-github-issues",
    description: "How the Next.js team used an agent to research old reports and work through the issue backlog.",
    tags: ["nextjs", "ai-agents", "open-source"],
  },
  {
    title: "Liquid Glass in the Browser",
    url: "https://kube.io/blog/liquid-glass-css-svg/",
    description: "Liquid Glass in the Browser: Refraction with CSS and SVG",
    tags: ["css", "svg", "refraction", "liquid-glass", "apple"],
  },
  {
    title: "Vape Server Project",
    url: "https://bogdanthegeek.github.io/blog/projects/vapeserver/",
    description: "Lightweight reverse proxy / tunneling server suited for demos and edge/IoT scenarios.",
    tags: ["networking", "reverse-proxy", "self-hosted"],
    sharedBy: {
      name: "Pouria Khakpour",
    },
  },
  {
    title: "Behind the Scenes of Bun Install",
    url: "https://bun.com/blog/behind-the-scenes-of-bun-install",
    description: "Deep dive into how Bun resolves, fetches, links, and optimizes dependencies in its package manager.",
    tags: ["bun", "package-manager", "performance"],
    sharedBy: {
      name: "Pouria Khakpour",
    },
  },
  {
    title: "SSR Deep Dive for React Developers",
    url: "https://www.developerway.com/posts/ssr-deep-dive-for-react-developers",
    description: "Clear explanation of SSR/SSG/ISR, hydration, and streaming for modern React apps.",
    tags: ["react", "ssr", "hydration"],
  },
  {
    title: "Claude Code from Source",
    url: "https://claude-code-from-source.com/",
    description: "How Anthropic built the most widely used AI coding agent",
    tags: ["claude", "code", "source", "tool"],
  },
];
