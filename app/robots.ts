export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://sniply-blog.vercel.app/sitemap.xml",
  };
}
