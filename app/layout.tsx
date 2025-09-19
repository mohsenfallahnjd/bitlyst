import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bitlyst.vercel.app/"),
  icons: {
    icon: "/favicon.svg",
  },
  title: {
    default: "Bitlyst Blog",
    template: "%s · Bitlyst",
  },
  description: "Bite-sized tech tips—simple, minimal, useful.",
  authors: [{ name: "Mohsen Fallahnejad", url: "https://themohsen.me" }],
  alternates: { types: { "application/rss+xml": [{ url: "/rss.xml", title: "Bitlyst RSS" }] } },
  openGraph: {
    title: "Bitlyst",
    description: "Bite-sized tech tips—simple, minimal, useful.",
    url: "https://bitlyst.vercel.app/",
    siteName: "Bitlyst",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Bitlyst",
    description: "Bite-sized tech tips—simple, minimal, useful.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      </head>
      <body className="font-sans antialiased bg-background-light text-foreground-light dark:bg-background-dark dark:text-foreground-dark transition-colors duration-300">
        <Header />
        <main className="container py-10">{children}</main>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
