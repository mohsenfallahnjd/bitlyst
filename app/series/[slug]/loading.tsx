/** Skeleton while a series page streams in (also the Suspense boundary around its `params` read). */
export default function SeriesLoading() {
  const bar = "rounded-md bg-gray-200/70 dark:bg-gray-800/70 animate-pulse";
  return (
    <div aria-busy="true" aria-label="Loading series" className="mx-auto max-w-[42rem] space-y-10">
      <div className="space-y-4 pb-8 border-b border-gray-200/70 dark:border-gray-800/60">
        <div className={`${bar} h-3 w-24`} />
        <div className="flex items-end justify-between gap-4">
          <div className={`${bar} h-10 w-2/3`} />
          <div className={`${bar} size-20 rounded-xl`} />
        </div>
        <div className={`${bar} h-5 w-full`} />
        <div className={`${bar} h-1.5 w-full`} />
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${bar} h-24 w-full rounded-2xl`} />
        ))}
      </div>
    </div>
  );
}
