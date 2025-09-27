import Link from "next/link";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Bite-sized JavaScript, React, and Next.js tips.</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Clear, minimal explanations with code and diagrams you can read in minutes.
        </p>
      </div>

      <div className="pt-2 flex items-center gap-3 text-sm">
        <Link href="/blog" className="underline">
          Browse all posts →
        </Link>
      </div>
    </section>
  );
}
