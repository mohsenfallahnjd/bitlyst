import TOC from "@/components/TOC";

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Floating TOC on wide screens so it doesn't shrink content width */}
      <div
        className="hidden xl:block fixed top-24 right-4 xl:right-[calc((100vw-1300px)/2+16px)] 2xl:right-[calc((100vw-1500px)/2+16px)] w-[300px]"
        aria-hidden="true"
      >
        <TOC />
      </div>
    </>
  );
}
