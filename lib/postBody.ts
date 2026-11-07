/**
 * The #post-body of the post on screen.
 *
 * Cache Components keeps previously visited routes in the DOM, hidden (display: none), so after a
 * post → post navigation there can be several #post-body elements and `getElementById` may return a
 * hidden one (0×0 rect, duplicate heading ids). Client code should use this instead.
 */
export function getPostBody(): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>("#post-body")) {
    if (el.getClientRects().length > 0) {
      return el;
    }
  }
  return null;
}
