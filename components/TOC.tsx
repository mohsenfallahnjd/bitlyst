"use client";
import { useEffect, useRef, useState } from "react";

type Item = { id: string; text: string; level: number };

function TOCList({
  items,
  activeId,
  scrollTo,
}: {
  items: Item[];
  activeId: string;
  scrollTo: (id: string) => (e: React.MouseEvent) => void;
}) {
  return (
    <ul className="space-y-1">
      {items.map((i) => {
        const isActive = i.id === activeId;
        return (
          <li key={i.id} style={{ paddingLeft: (i.level - 1) * 12 }}>
            <a
              href={`#${i.id}`}
              onClick={scrollTo(i.id)}
              className={`block rounded px-2 py-1 text-sm transition-colors hover:underline ${
                isActive
                  ? "text-cyan-700 dark:text-cyan-300 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              {i.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function TOC({ collapsible = false }: { collapsible?: boolean }) {
  const [items, setItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3")) as HTMLElement[];
    const parsed = headings.map((el) => ({
      id: el.id || "",
      text: el.innerText,
      level: el.tagName === "H1" ? 1 : el.tagName === "H2" ? 2 : 3,
    }));
    setItems(parsed.filter((i) => i.id));

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]) { setActiveId((visible[0].target as HTMLElement).id); }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1.0] },
    );

    headings.forEach((h) => observer.observe(h));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) { return; }
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: y, behavior: "smooth" });
    if (collapsible) { setOpen(false); }
  };

  if (!items.length) { return null; }

  if (collapsible) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
          aria-expanded={open}
        >
          <span>On this page</span>
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`size-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M4.427 6.427a.75.75 0 0 1 1.06 0L8 8.94l2.513-2.513a.75.75 0 0 1 1.06 1.06l-3.043 3.043a.75.75 0 0 1-1.06 0L4.427 7.487a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
        {open && (
          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
            <TOCList items={items} activeId={activeId} scrollTo={scrollTo} />
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="md:sticky md:top-20 md:max-h-[70vh] overflow-auto rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-neutral-900/40">
      <p className="mb-2 font-semibold text-gray-900 dark:text-gray-100">On this page</p>
      <TOCList items={items} activeId={activeId} scrollTo={scrollTo} />
    </aside>
  );
}
