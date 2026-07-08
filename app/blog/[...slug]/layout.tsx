import TOC from "@/components/TOC";

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full xl:grid xl:max-w-[68rem] xl:grid-cols-[minmax(0,1fr)_11.5rem] xl:items-start xl:gap-10 2xl:grid-cols-[minmax(0,1fr)_12.5rem] 2xl:gap-12">
      <div className="-mx-4 min-w-0 px-4 sm:mx-0 sm:px-0">{children}</div>
      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <TOC />
        </div>
      </aside>
    </div>
  );
}
