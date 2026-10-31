/** Skeleton shown while a not-yet-cached post renders. */
export default function PostLoading() {
  const bar = "rounded-md bg-gray-200/70 dark:bg-gray-800/70 animate-pulse";
  return (
    <div aria-busy="true" aria-label="Loading post" className="space-y-10">
      <div className="space-y-5 pb-8 border-b border-gray-200/70 dark:border-gray-800/60">
        <div className={`${bar} h-3 w-32`} />
        <div className="space-y-3">
          <div className={`${bar} h-9 w-full`} />
          <div className={`${bar} h-9 w-2/3`} />
        </div>
        <div className={`${bar} h-5 w-5/6`} />
        <div className="flex items-center gap-3">
          <div className={`${bar} size-9 rounded-full`} />
          <div className={`${bar} h-3 w-48`} />
        </div>
      </div>
      <div className="space-y-3">
        {[100, 96, 92, 98, 60].map((w) => (
          <div key={w} className={`${bar} h-4`} style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className={`${bar} h-40 w-full rounded-xl`} />
    </div>
  );
}
