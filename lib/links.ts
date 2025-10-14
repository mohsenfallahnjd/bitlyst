export type UsefulLink = {
  title: string;
  url: string;
  description?: string;
  tags?: string[];

  sharedBy?: {
    name: string;
    email?: string;
  };
};

export const usefulLinks: UsefulLink[] = [
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
      email: "pouriakhakpour3@gmail.com",
    },
  },
  {
    title: "Behind the Scenes of Bun Install",
    url: "https://bun.com/blog/behind-the-scenes-of-bun-install",
    description: "Deep dive into how Bun resolves, fetches, links, and optimizes dependencies in its package manager.",
    tags: ["bun", "package-manager", "performance"],
    sharedBy: {
      name: "Pouria Khakpour",
      email: "pouriakhakpour3@gmail.com",
    },
  },
  {
    title: "SSR Deep Dive for React Developers",
    url: "https://www.developerway.com/posts/ssr-deep-dive-for-react-developers",
    description: "Clear explanation of SSR/SSG/ISR, hydration, and streaming for modern React apps.",
    tags: ["react", "ssr", "hydration"],
  },
];
