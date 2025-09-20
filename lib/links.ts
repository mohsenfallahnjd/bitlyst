export type UsefulLink = {
  title: string;
  url: string;

  sharedBy?: {
    name: string;
    email?: string;
  };
};

export const usefulLinks: UsefulLink[] = [
  {
    title: "Vape Server Project",
    url: "https://bogdanthegeek.github.io/blog/projects/vapeserver/",
    sharedBy: {
      name: "Pouria Khakpour",
      email: "pouriakhakpour3@gmail.com",
    },
  },
  {
    title: "Behind the Scenes of Bun Install",
    url: "https://bun.com/blog/behind-the-scenes-of-bun-install",
    sharedBy: {
      name: "Pouria Khakpour",
      email: "pouriakhakpour3@gmail.com",
    },
  },
  {
    title: "SSR Deep Dive for React Developers",
    url: "https://www.developerway.com/posts/ssr-deep-dive-for-react-developers",
  },
];
