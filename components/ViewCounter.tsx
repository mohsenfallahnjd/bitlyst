"use client";

import { useEffect, useState } from "react";
import { formatCount } from "@/lib/format";
import { EyeIcon } from "./StatIcons";

/** Counts this read (server dedupes per visitor/day) and shows the live total. */
export default function ViewCounter({ slug, initial }: { slug: string; initial: number }) {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/views/${slug}`, { method: "POST", signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (typeof data?.views === "number" && data.views > 0) {
          setViews(data.views);
        }
      })
      .catch(() => {});
    return () => {
      ctrl.abort();
    };
  }, [slug]);

  if (views < 1) {
    return null;
  }
  return (
    <span className="inline-flex items-center gap-1" title={`${views.toLocaleString("en-US")} reads`}>
      <EyeIcon className="size-3" />
      {formatCount(views)} reads
    </span>
  );
}
