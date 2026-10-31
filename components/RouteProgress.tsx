"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Thin top bar shown while a client-side navigation is in flight. App Router has
 * no router events, so it starts on internal link clicks / back-forward and
 * finishes when the pathname or search params actually change.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const active = useRef(false);
  const trickle = useRef<ReturnType<typeof setInterval>>(undefined);
  const safety = useRef<ReturnType<typeof setTimeout>>(undefined);

  const done = useCallback(() => {
    if (!active.current) {
      return;
    }
    active.current = false;
    clearInterval(trickle.current);
    clearTimeout(safety.current);
    setWidth(100);
    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setWidth(0);
      }, 300);
    }, 200);
  }, []);

  const start = useCallback(() => {
    if (active.current) {
      return;
    }
    active.current = true;
    setVisible(true);
    setWidth(12);
    // ease towards 90% until the route resolves
    trickle.current = setInterval(() => {
      setWidth((w) => w + (90 - w) * 0.12);
    }, 200);
    safety.current = setTimeout(done, 10_000);
  }, [done]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) {
        return;
      }
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) {
        return;
      }
      // same page (or hash-only jump) — no navigation to wait for
      if (url.pathname === location.pathname && url.search === location.search) {
        return;
      }
      start();
    };
    const onPop = () => {
      start();
    };
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, [start]);

  // finish whenever the URL changes
  useEffect(() => {
    done();
  }, [pathname, searchParams, done]);

  return (
    <div
      className="route-progress"
      style={{ width: `${width}%`, opacity: visible ? 1 : 0 }}
      role="progressbar"
      aria-hidden={!visible}
      aria-label="Loading page"
    />
  );
}
