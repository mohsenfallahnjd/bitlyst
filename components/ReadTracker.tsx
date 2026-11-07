"use client";

import { useEffect } from "react";
import { getPostBody } from "@/lib/postBody";
import { saveProgress } from "@/lib/reader";

/** Remembers how far you got in this post (powers "Continue reading" + Read badges). */
export default function ReadTracker({ slug }: { slug: string }) {
  useEffect(() => {
    let max = 0;
    let frame = 0;
    let lastSave = 0;

    const measure = () => {
      frame = 0;
      // progress through the article body itself, not the comments/related block below it
      const body = getPostBody();
      if (!body) {
        return;
      }
      const rect = body.getBoundingClientRect();
      const p = rect.height > 0 ? (window.innerHeight - rect.top) / rect.height : 1;
      if (p > max) {
        max = p;
        if (Date.now() - lastSave > 1000) {
          lastSave = Date.now();
          saveProgress(slug, max);
        }
      }
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(measure);
    };
    const flush = () => {
      saveProgress(slug, max);
    };

    saveProgress(slug, 0);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", flush);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [slug]);

  return null;
}
