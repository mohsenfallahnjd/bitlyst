/**
 * `sizes` for the 1200×630 cover on the post page and the home page's featured card. Both use the same
 * value so the browser picks the same srcset entry: the featured cover and a hover preload
 * (components/PreloadCoverLink) are then cache hits when the post page opens, so the cover morph
 * never lands on an empty image.
 */
export const HERO_COVER_SIZES = "(min-width: 768px) 42rem, 100vw";
export const HERO_COVER_WIDTH = 1200;
export const HERO_COVER_HEIGHT = 630;

/** Tint shown behind covers while they load; matches the blue cover template instead of a white flash. */
export const COVER_PLACEHOLDER_BG = "bg-brand-100 dark:bg-brand-950";
