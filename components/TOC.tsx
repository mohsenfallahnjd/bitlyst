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
    <ul className="space-y-0.5">
      {items.map((i) => {
        const isActive = i.id === activeId;
        return (
          <li key={i.id} style={{ paddingLeft: (i.level - 1) * 10 }}>
            <a
              href={`#${i.id}`}
              onClick={scrollTo(i.id)}
              className={`block py-1 text-[13px] transition-colors leading-snug ${
                isActive
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
    const headings = Array.from(document.querySelectorAll("h2, h3")) as HTMLElement[];
    const parsed = headings.map((el) => ({
      id: el.id || "",
      text: el.innerText,
      level: el.tagName === "H2" ? 1 : 2,
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
      { rootMargin: "-10% 0px -75% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) { return; }
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
    if (collapsible) { setOpen(false); }
  };

  if (!items.length) { return null; }

  if (collapsible) {
    return (
      <div className="border-b border-gray-100 dark:border-gray-800/60 pb-4 mb-8">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-between w-full text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-1"
          aria-expanded={open}
        >
          <span>Contents</span>
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`size-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          >
            <path d="M4.427 6.427a.75.75 0 0 1 1.06 0L8 8.94l2.513-2.513a.75.75 0 0 1 1.06 1.06l-3.043 3.043a.75.75 0 0 1-1.06 0L4.427 7.487a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
        {open && (
          <nav className="mt-3">
            <TOCList items={items} activeId={activeId} scrollTo={scrollTo} />
          </nav>
        )}
      </div>
    );
  }

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-auto">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Contents</p>
      <TOCList items={items} activeId={activeId} scrollTo={scrollTo} />
    </nav>
  );
}
