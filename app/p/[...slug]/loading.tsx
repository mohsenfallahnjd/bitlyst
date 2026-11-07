/** Skeleton shown while a not-yet-cached post renders. Mirrors the layout of page.tsx so nothing jumps on load. */
export default function PostLoading() {
  const bar = "rounded-md bg-gray-200/70 dark:bg-gray-800/70 animate-pulse";
  return (
    <div aria-busy="true" aria-label="Loading post" className="xl:grid xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-12">
      <div className="mx-auto w-full min-w-0 max-w-[42rem] xl:mx-0">
        <div className="pb-8 mb-10 border-b border-gray-200/70 dark:border-gray-800/60">
          {/* breadcrumb */}
          <div className={`${bar} mb-6 h-3 w-28`} />
          {/* cover */}
          <div className={`${bar} mb-8 aspect-[1200/630] w-full rounded-xl`} />
          {/* level + reading time */}
          <div className="mb-4 flex gap-2">
            <div className={`${bar} h-5 w-20 rounded-full`} />
            <div className={`${bar} h-5 w-20 rounded-full`} />
          </div>
          {/* title */}
          <div className="space-y-2.5">
            <div className={`${bar} h-8 sm:h-10 w-full`} />
            <div className={`${bar} h-8 sm:h-10 w-2/3`} />
          </div>
          {/* summary */}
          <div className="mt-4 space-y-2">
            <div className={`${bar} h-5 w-full`} />
            <div className={`${bar} h-5 w-4/5`} />
          </div>
          {/* author row + share */}
          <div className="mt-7 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`${bar} size-9 rounded-full`} />
              <div className="space-y-1.5">
                <div className={`${bar} h-3.5 w-32`} />
                <div className={`${bar} h-3 w-48`} />
              </div>
            </div>
            <div className={`${bar} size-8 rounded-lg`} />
          </div>
        </div>

        {/* collapsible TOC below xl */}
        <div className={`${bar} xl:hidden mb-8 h-11 w-full rounded-xl`} />

        {/* body */}
        <div className="space-y-3">
          {[100, 96, 92, 98, 60].map((w) => (
            <div key={w} className={`${bar} h-4`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* TOC rail */}
      <div className="hidden xl:block">
        <div className="sticky top-24 space-y-3">
          <div className={`${bar} mb-4 h-3 w-24`} />
          {[90, 75, 85, 70, 80, 65].map((w) => (
            <div key={w} className={`${bar} h-3`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
