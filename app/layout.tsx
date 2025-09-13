import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sniply-blog.vercel.app/"),
  icons: {
    icon: "/favicon.svg",
  },
  title: {
    default: "Sniply Blog",
    template: "%s · Sniply",
  },
  description: "Bite-sized tech tips—simple, minimal, useful.",
  authors: [{ name: "Mohsen Fallahnejad", url: "https://www.linkedin.com/in/mohsenfallahnjd/" }],
  alternates: { types: { "application/rss+xml": [{ url: "/rss.xml", title: "Sniply RSS" }] } },
  openGraph: {
    title: "Sniply",
    description: "Bite-sized tech tips—simple, minimal, useful.",
    url: "https://sniply-blog.vercel.app/",
    siteName: "Sniply",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sniply",
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
      </body>
    </html>
  );
}
