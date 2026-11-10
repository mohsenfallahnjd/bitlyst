"use client";

import Image from "next/image";
import { type ComponentProps, useCallback, useState } from "react";

const FADE = "transition-opacity duration-300 ease-out motion-reduce:transition-none";

/**
 * Post-body image that fades in once loaded instead of popping in. Only for images inside the post:
 * covers take part in the card → header view-transition morph, and fading them would read as a flash.
 * Images already loaded before hydration (cache hits) are shown immediately via the `complete` check.
 */
export default function FadeImage({
  optimized,
  className = "",
  ...props
}: { optimized: boolean; className?: string } & ComponentProps<"img">) {
  const [loaded, setLoaded] = useState(false);
  const onLoad = () => setLoaded(true);
  // plain <img>: catch images that finished loading before React attached onLoad
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);
  const cls = `${className} ${FADE} ${loaded ? "opacity-100" : "opacity-0"}`;

  if (optimized) {
    // next/image handles the already-complete case itself and still calls onLoad
    const { src, alt, width, height, sizes } = props;
    return (
      <Image
        src={src as string}
        alt={alt ?? ""}
        width={Number(width)}
        height={Number(height)}
        sizes={sizes}
        onLoad={onLoad}
        className={cls}
      />
    );
  }

  return (
    <img {...props} alt={props.alt ?? ""} ref={ref} onLoad={onLoad} loading="lazy" decoding="async" className={cls} />
  );
}
