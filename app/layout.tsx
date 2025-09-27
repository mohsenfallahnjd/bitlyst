import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://themohsen.me/"),
  title: "Mohsen Fallahnejad | Front‑End Developer",
  authors: [{ name: "Mohsen Fallahnejad", url: "https://themohsen.me/" }],
  description: "Hi, I'm Mohsen, a front-end developer and usually code on #JS for creating beautiful things 🤠",
  alternates: { canonical: "https://themohsen.me/" },
  openGraph: {
    locale: "en",
    siteName: "themohsen.me",
    title: "Mohsen Fallahnejad | Front‑End Developer",
    description: "Hi, I'm Mohsen, a front-end developer and usually code on #JS for creating beautiful things 🤠",
    images: "/logo.svg",
    url: "https://themohsen.me/",
    type: "website",
  },
  twitter: {
    title: "Mohsen Fallahnejad | Front‑End Developer",
    description: "Hi, I'm Mohsen, a front-end developer and usually code on #JS for creating beautiful things 🤠",
    creator: "@mohsenfallahnjd",
    images: "/logo.svg",
    card: "summary_large_image",
    site: "https://themohsen.me/",
  },
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
