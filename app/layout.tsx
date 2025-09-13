import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://sniply.blog"),
  icons: {
    icon: "/favicon.svg",
  },
  title: {
    default: "Sniply Blog",
    template: "%s · Sniply",
  },
  description: "Bite-sized tech tips—simple, minimal, useful.",
  authors: [{ name: "Sniply" }],
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "Sniply RSS" }],
    },
  },
  openGraph: {
    title: "Sniply",
    description: "Bite-sized tech tips—simple, minimal, useful.",
    url: "https://sniply.blog",
    siteName: "Sniply",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sniply",
    description: "Bite-sized tech tips—simple, minimal, useful.",
  },
};

function ThemeScript() {
  // Runs before React hydration; sets .dark from localStorage or system
  const code = `(function(){try{
	  var ls = localStorage.getItem('theme');
	  var sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
	  var dark = ls ? (ls === 'dark') : sys;
	  var root = document.documentElement.classList;
	  dark ? root.add('dark') : root.remove('dark');
	}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className="font-sans antialiased bg-background-light text-foreground-light 
                 dark:bg-background-dark dark:text-foreground-dark transition-colors duration-300"
      >
        <Header />
        <main className="container py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
