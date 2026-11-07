"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPostBody } from "@/lib/postBody";

type Item = { id: string; text: string; level: 1 | 2 };

function cleanHeadingText(text: string) {
  return (
    text
      .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}\uFE0F\u200D]/gu, "")
      .replace(/#\s*$/, "") // hover anchor link
      .replace(/\s+/g, " ")
      .trim() || text
  );
}

// scoped to the post on screen: hidden, previously visited posts stay in the DOM with the same heading ids
function visibleHeadings() {
  return Array.from(getPostBody()?.querySelectorAll<HTMLElement>("h2, h3") ?? []);
}

function findHeading(id: string) {
  return visibleHeadings().find((el) => el.id === id);
}

function resolveActiveSectionId(activeId: string, allItems: Item[]) {
  const index = allItems.findIndex((item) => item.id === activeId);
  if (index === -1) {
    return activeId;
  }
  if (allItems[index].level === 1) {
    return activeId;
  }
  for (let i = index; i >= 0; i--) {
    if (allItems[i].level === 1) {
      return allItems[i].id;
    }
  }
  return activeId;
}

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
    <ul className="space-y-0.5 border-l border-gray-200/80 dark:border-gray-800">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={scrollTo(item.id)}
              aria-current={isActive ? "location" : undefined}
              className={[
                "block border-l-2 -ml-px py-1 pl-3 pr-1 text-[13px] leading-snug transition-colors",
                isActive
                  ? "border-brand-600 font-medium text-gray-900 dark:border-brand-400 dark:text-gray-50"
                  : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200",
              ].join(" ")}
            >
              <span className="line-clamp-2">{item.text}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function TOC({ collapsible = false }: { collapsible?: boolean }) {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sectionItems = useMemo(() => allItems.filter((item) => item.level === 1), [allItems]);
  const activeSectionId = useMemo(() => resolveActiveSectionId(activeId, allItems), [activeId, allItems]);

  useEffect(() => {
    const headings = visibleHeadings();
    const parsed: Item[] = headings.map((el) => ({
      id: el.id || "",
      text: cleanHeadingText(el.innerText),
      level: el.tagName === "H2" ? 1 : 2,
    }));
    setAllItems(parsed.filter((item) => item.id));

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId((visible[0].target as HTMLElement).id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((heading) => observer.observe(heading));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = findHeading(id);
    if (!el) {
      return;
    }
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
    if (collapsible) {
      setOpen(false);
    }
  };

  if (!sectionItems.length) {
    return null;
  }

  const activeLabel = sectionItems.find((item) => item.id === activeSectionId)?.text;

  if (collapsible) {
    return (
      <div className="rounded-lg border border-gray-200/80 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
          aria-expanded={open}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              On this page
            </p>
            {!open && activeLabel && (
              <p className="mt-0.5 truncate text-sm text-gray-700 dark:text-gray-200">{activeLabel}</p>
            )}
          </div>
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden
            className={`size-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M4.427 6.427a.75.75 0 0 1 1.06 0L8 8.94l2.513-2.513a.75.75 0 0 1 1.06 1.06l-3.043 3.043a.75.75 0 0 1-1.06 0L4.427 7.487a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>

        {open && (
          <nav className="border-t border-gray-200/80 px-1 py-2 dark:border-gray-800">
            <TOCList items={sectionItems} activeId={activeSectionId} scrollTo={scrollTo} />
          </nav>
        )}
      </div>
    );
  }

  return (
    <nav
      aria-label="Table of contents"
      className="max-h-[calc(100vh-7rem)] overflow-y-auto [mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
    >
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        On this page
      </p>
      <TOCList items={sectionItems} activeId={activeSectionId} scrollTo={scrollTo} />
    </nav>
  );
}
