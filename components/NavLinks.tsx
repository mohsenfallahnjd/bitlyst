"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Posts", href: "/posts" },
  { label: "Series", href: "/series" },
  { label: "Topics", href: "/tags" },
  // About is in the footer too — drop it from the header on small phones to keep it on one line
  { label: "About", href: "/about", className: "hidden sm:inline" },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`${item.className ?? ""} text-sm transition-colors ${
              active
                ? "font-medium text-gray-900 dark:text-gray-50"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
