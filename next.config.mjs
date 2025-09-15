import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: { remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMdxFrontmatter] },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: { mdxRs: true },
  images: { unoptimized: true },
};

export default withMDX(nextConfig);
