"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Item = { id: string; text: string; level: number };

export default function TOC() {
  const [items, setItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3")) as HTMLElement[];
    const parsed = headings.map((el) => ({
      id: el.id || "",
      text: el.innerText,
      level: el.tagName === "H1" ? 1 : el.tagName === "H2" ? 2 : 3,
    }));
    setItems(parsed.filter((i) => i.id));

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]) {
          setActiveId((visible[0].target as HTMLElement).id);
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 1.0],
      }
    );

    headings.forEach((h) => observer.observe(h));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) {
      return;
    }
    const y = el.getBoundingClientRect().top + window.scrollY - 80; // account for header
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const grouped = useMemo(() => items, [items]);

  if (!grouped.length) {
    return null;
  }

  return (
    <aside className="md:sticky md:top-20 md:max-h-[70vh] overflow-auto rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-neutral-900/40">
      <p className="mb-2 font-semibold text-gray-900 dark:text-gray-100">On this page</p>
      <ul className="space-y-1">
        {grouped.map((i) => {
          const isActive = i.id === activeId;
          return (
            <li key={i.id} style={{ paddingLeft: (i.level - 1) * 12 }}>
              <a
                href={`#${i.id}`}
                onClick={scrollTo(i.id)}
                className={`block rounded px-2 py-1 hover:underline ${
                  isActive ? "text-cyan-700 dark:text-cyan-300" : "text-gray-700 dark:text-gray-300"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {i.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
