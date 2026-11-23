import { getPostBody } from "@/lib/postBody";

/** 0..1 progress through #post-body (same formula as ReadTracker). */
export function articleScrollProgress() {
  const body = getPostBody();
  if (!body) {
    return 0;
  }
  const rect = body.getBoundingClientRect();
  return rect.height > 0 ? (window.innerHeight - rect.top) / rect.height : 1;
}

/** Scroll so the saved article progress lines up with the viewport bottom. */
export function scrollToArticleProgress(progress: number, behavior: ScrollBehavior = "smooth") {
  const body = getPostBody();
  if (!body) {
    return;
  }
  const rect = body.getBoundingClientRect();
  if (rect.height <= 0) {
    return;
  }
  const p = Math.min(1, Math.max(0, progress));
  const targetTop = window.innerHeight - p * rect.height;
  const y = window.scrollY + rect.top - targetTop;
  window.scrollTo({ top: Math.max(0, y), behavior });
}