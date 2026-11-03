/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  cacheComponents: true,
  // links prefetch one shared App Shell per route instead of every linked page
  partialPrefetching: true,
  cacheLife: {
    // read counts, trending, comments: refresh in the background every 5 minutes
    stats: { stale: 300, revalidate: 300, expire: 86_400 },
  },
  // API routes read post slugs from disk at runtime
  outputFileTracingIncludes: {
    "/api/views/[slug]": ["./docs/**/*"],
  },
  // old ?tag= filters moved to static topic pages
  async redirects() {
    return [
      // old Vercel subdomain → custom domain (keeps path and query)
      { source: "/:path*", has: [{ type: "host", value: "bitlyst.vercel.app" }], destination: "https://bitlyst.blog/:path*", permanent: true },
      { source: "/:path*", has: [{ type: "host", value: "www.bitlyst.blog" }], destination: "https://bitlyst.blog/:path*", permanent: true },
      { source: "/blog", has: [{ type: "query", key: "tag", value: "(?<tag>[a-zA-Z0-9-]+)" }], destination: "/tags/:tag", permanent: true },
      // posts moved from /blog/<slug> to /p/<slug>, the index from /blog to /posts
      { source: "/blog", destination: "/posts", permanent: true },
      { source: "/blog/:slug+", destination: "/p/:slug+", permanent: true },
      { source: "/", has: [{ type: "query", key: "tag", value: "(?<tag>[a-zA-Z0-9-]+)" }], destination: "/tags/:tag", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

export default nextConfig;
