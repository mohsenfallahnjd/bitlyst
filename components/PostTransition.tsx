import { type ReactNode, ViewTransition } from "react";

// Shared-element morph between a post card (home, lists, related posts) and the post page header.
// Both ends render the same `name`, so the browser animates the cover, title and summary from the card
// into the header. A name must be unique on a page, so render each post at most once per list.
// CSS for the `cover-morph` / `text-morph` classes lives in app/globals.css.

type Part = "cover" | "title" | "summary";

/** view-transition-name must be a CSS identifier; slugs can contain "/" or dots. */
function transitionName(slug: string, part: Part) {
  return `post-${slug.replace(/[^a-zA-Z0-9_-]/g, "-")}-${part}`;
}

export default function PostTransition({ slug, part, children }: { slug: string; part: Part; children: ReactNode }) {
  return (
    <ViewTransition
      name={transitionName(slug, part)}
      share={part === "cover" ? "cover-morph" : "text-morph"}
      // without this every named element would crossfade on unrelated transitions
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
