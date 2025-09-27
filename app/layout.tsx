import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { JsonLd, OrgJsonLd } from "@/components/JsonLD";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bitlyst.vercel.app/"),
  icons: { icon: [{ url: "/icon.svg" }, { url: "/logo.svg" }] },
  title: { default: "Bitlyst — Bite-sized JavaScript, React, and Next.js tips", template: "%s · Bitlyst" },
  description:
    "Bite-sized tutorials and practical tips on JavaScript, React, and Next.js. Clear explanations, diagrams, and code examples you can read in minutes to level up your frontend and web development skills.",
  authors: [{ name: "Mohsen Fallahnejad", url: "https://themohsen.me" }],
  keywords: [
    "bitlyst",
    "blog",
    "tech",
    "javascript",
    "react",
    "next.js",
    "frontend",
    "web development",
    "tips",
    "tutorials",
  ],
  alternates: {
    types: { "application/rss+xml": [{ url: "/rss.xml", title: "Bitlyst RSS" }] },
    canonical: "https://bitlyst.vercel.app/",
  },
  openGraph: {
    title: "Bitlyst — Bite-sized JavaScript, React, and Next.js tips",
    description:
      "Bite-sized tutorials and practical tips on JavaScript, React, and Next.js. Clear explanations, diagrams, and code examples you can read in minutes to level up your frontend and web development skills.",
    url: "https://bitlyst.vercel.app/",
    siteName: "Bitlyst",
    type: "website",
    images: "/logo.svg",
    locale: "en_US",
    countryName: "United States",
  },
  twitter: {
    card: "summary",
    title: "Bitlyst — Bite-sized JavaScript, React, and Next.js tips",
    description:
      "Bite-sized tutorials and practical tips on JavaScript, React, and Next.js. Clear explanations, diagrams, and code examples you can read in minutes to level up your frontend and web development skills.",
    images: "/logo.svg",
    site: "@mohsenfallahnjd",
    creator: "@mohsenfallahnjd",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
	  var ls = localStorage.getItem('theme');
	  var sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
	  var dark = ls ? (ls === 'dark') : sys;
	  var root = document.documentElement.classList;
	  dark ? root.add('dark') : root.remove('dark');
	}catch(e){}})();`,
          }}
        />
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
        <OrgJsonLd />
        <JsonLd />
      </head>
      <body className="font-sans antialiased bg-background-light text-foreground-light dark:bg-background-dark dark:text-foreground-dark transition-colors duration-300">
        <Header />
        <main className="container py-10 min-h-[calc(100dvh-233px)]">{children}</main>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
