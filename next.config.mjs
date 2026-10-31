/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  // API routes read post slugs from disk at runtime
  outputFileTracingIncludes: {
    "/api/views/[slug]": ["./docs/**/*"],
  },
  // old ?tag= filters moved to static topic pages
  async redirects() {
    return [
      { source: "/blog", has: [{ type: "query", key: "tag", value: "(?<tag>[a-zA-Z0-9-]+)" }], destination: "/tags/:tag", permanent: true },
      { source: "/", has: [{ type: "query", key: "tag", value: "(?<tag>[a-zA-Z0-9-]+)" }], destination: "/tags/:tag", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

export default nextConfig;
