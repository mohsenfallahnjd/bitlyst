export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/search"] }],
    sitemap: "https://bitlyst.vercel.app/sitemap.xml",
  };
}
