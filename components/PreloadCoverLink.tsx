"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { preload } from "react-dom";
import { HERO_COVER_HEIGHT, HERO_COVER_SIZES, HERO_COVER_WIDTH } from "@/lib/cover";

/**
 * Link to a post that starts loading the post page's full-size cover as soon as the reader shows
 * intent (hover, focus, touch). The card only has the small thumbnail; without this the cover morph
 * into the post header animates toward an image that hasn't arrived yet and flickers.
 */
export default function PreloadCoverLink({ cover, ...props }: ComponentProps<typeof Link> & { cover?: string }) {
  const warm = () => {
    if (!cover) {
      return;
    }
    const { props: img } = getImageProps({
      src: cover,
      alt: "",
      width: HERO_COVER_WIDTH,
      height: HERO_COVER_HEIGHT,
      sizes: HERO_COVER_SIZES,
    });
    preload(img.src, { as: "image", imageSrcSet: img.srcSet, imageSizes: img.sizes, fetchPriority: "high" });
  };

  return (
    <Link
      {...props}
      onPointerEnter={(e) => {
        warm();
        props.onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        warm();
        props.onFocus?.(e);
      }}
      onTouchStart={(e) => {
        warm();
        props.onTouchStart?.(e);
      }}
    />
  );
}
