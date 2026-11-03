export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/search", "/api/", "/admin"] }],
    sitemap: "https://bitlyst.blog/sitemap.xml",
  };
}
