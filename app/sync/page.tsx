import type { Metadata } from "next";
import SyncPanel from "./SyncPanel";

export const metadata: Metadata = {
  title: "Sync devices",
  description: "Keep what you've read and where you stopped in sync across your phone, tablet and computer.",
  alternates: { canonical: "/sync" },
  robots: { index: false },
};

export default function SyncPage() {
  return (
    <div className="mx-auto max-w-[42rem] space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sync your reading</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Read on your phone, carry on from your laptop. Posts you&apos;ve read, where you stopped, and your streak
          follow you across devices. No account: one secret link connects them.
        </p>
      </div>
      <SyncPanel />
    </div>
  );
}
