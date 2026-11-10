import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[] };

const cache = new Map<string, { width: number; height: number } | null>();

/** Width/height of a file under public/, read from its header. null when missing or unreadable. */
function sizeOf(src: string) {
  if (!cache.has(src)) {
    let size: { width: number; height: number } | null = null;
    try {
      const file = path.join(process.cwd(), "public", decodeURIComponent(src.split(/[?#]/)[0]));
      const { width, height } = imageSize(readFileSync(file));
      if (width && height) {
        size = { width, height };
      }
    } catch {
      // missing file or unknown format: leave the <img> without dimensions
    }
    cache.set(src, size);
  }
  return cache.get(src) ?? null;
}

/**
 * Adds intrinsic width/height to local markdown images (`![alt](/assets/x.jpg)`), so the browser
 * reserves their box before they load (no layout jump) and the MDX `img` component can hand them
 * to next/image.
 */
export default function rehypeImageSize() {
  const visit = (node: HastNode) => {
    if (node.type === "element" && node.tagName === "img" && node.properties) {
      const src = node.properties.src;
      if (typeof src === "string" && src.startsWith("/") && !node.properties.width) {
        const size = sizeOf(src);
        if (size) {
          node.properties.width = size.width;
          node.properties.height = size.height;
        }
      }
    }
    node.children?.forEach(visit);
  };
  return (tree: HastNode) => visit(tree);
}
