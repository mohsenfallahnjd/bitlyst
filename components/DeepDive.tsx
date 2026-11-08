// DeepDive — the optional "Going deeper" section at the end of a post, set apart in its own panel.
// Usage (blank lines around the content keep it Markdown):
//   <DeepDive>
//
//   ### Full measurements
//   ...
//
//   </DeepDive>
// It renders its own "Going deeper" h2 (id="going-deeper") so the TOC and anchor links keep working.
// Use ### for subsections inside it.

export default function DeepDive({ children }: { children: React.ReactNode }) {
  return (
    <section
      aria-labelledby="going-deeper"
      className="mt-16 mb-8 rounded-2xl border border-dashed border-brand-300/70 dark:border-brand-800/70 bg-surface-light dark:bg-surface-dark px-5 py-6 sm:px-8 sm:py-8 [&>h3:first-child]:mt-6"
    >
      <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
        <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 3 2 8l10 5 10-5-10-5Z" strokeLinejoin="round" />
          <path d="m2 13 10 5 10-5M2 17.5 12 22.5l10-5" strokeLinejoin="round" opacity={0.55} />
        </svg>
        Advanced · optional
      </p>
      <h2
        id="going-deeper"
        className="mt-3 mb-2 scroll-mt-24 text-[1.45rem] font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-50"
      >
        Going deeper
        <a href="#going-deeper" className="heading-anchor" aria-label="Link to this section">
          #
        </a>
      </h2>
      <p className="my-0 text-sm text-gray-500 dark:text-gray-400">
        Everything above is enough to explain this in an interview. This part is for the curious: full numbers, edge
        cases and what's still unproven.
      </p>
      {children}
    </section>
  );
}
