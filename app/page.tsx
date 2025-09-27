import List from "./_sections";

export default async function HomePage({}: PageProps<"/">) {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Bite-sized JavaScript, React, and Next.js tips.</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Clear, minimal explanations with code and diagrams you can read in minutes.
        </p>
      </div>

      <List />
    </section>
  );
}
