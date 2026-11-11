/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  cacheComponents: true,
  // links prefetch one shared App Shell per route instead of every linked page
  partialPrefetching: true,
  reactCompiler: true,
  experimental: { turbopackRustReactCompiler: true },
  cacheLife: {
    // read and comment counts behind /api/stats: refresh in the background every 30 minutes.
    // Only that one small route uses it. Pages must not read stats on the server, or every
    // page inherits this lifetime and re-renders on each crawl (Fluid Active CPU).
    stats: { stale: 300, revalidate: 1800, expire: 86_400 },
  },
  // API routes read post slugs from disk at runtime
  outputFileTracingIncludes: {
    "/api/views/[slug]": ["./docs/**/*"],
    "/api/comments/[slug]": ["./docs/**/*"],
    "/api/reactions/[slug]": ["./docs/**/*"],
    "/admin": ["./docs/**/*"],
  },
  // old ?tag= filters moved to static topic pages
  async redirects() {
    return [
      {
        source: "/blog",
        has: [{ type: "query", key: "tag", value: "(?<tag>[a-zA-Z0-9-]+)" }],
        destination: "/tags/:tag",
        permanent: true,
      },
      // posts moved from /blog/<slug> to /p/<slug>, the index from /blog to /posts
      { source: "/blog", destination: "/posts", permanent: true },
      { source: "/blog/:slug+", destination: "/p/:slug+", permanent: true },
      {
        source: "/",
        has: [{ type: "query", key: "tag", value: "(?<tag>[a-zA-Z0-9-]+)" }],
        destination: "/tags/:tag",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

export default nextConfig;
