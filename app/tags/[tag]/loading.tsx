/** Skeleton while a topic page streams in (also the Suspense boundary around its `params` read). */
export default function TopicLoading() {
  const bar = "rounded-md bg-gray-200/70 dark:bg-gray-800/70 animate-pulse";
  return (
    <div aria-busy="true" aria-label="Loading topic" className="space-y-8">
      <div className="space-y-3">
        <div className={`${bar} h-3 w-20`} />
        <div className={`${bar} h-9 w-48`} />
        <div className={`${bar} h-3 w-16`} />
      </div>
      <div className="space-y-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 border-b border-gray-200/70 dark:border-gray-800/60 pb-5">
            <div className={`${bar} h-5 w-3/4`} />
            <div className={`${bar} h-4 w-full`} />
            <div className={`${bar} h-3 w-40`} />
          </div>
        ))}
      </div>
    </div>
  );
}
