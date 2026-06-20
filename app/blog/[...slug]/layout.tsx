import TOC from "@/components/TOC";

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return (
    // Break out of the narrow .container applied by the root layout
    <div className="-mx-4 px-4 sm:px-0" style={{ maxWidth: "56rem", margin: "0 auto" }}>
      {children}
      {/* Floating TOC on wide screens */}
      <div
        className="hidden xl:block fixed top-24 right-4 xl:right-[calc((100vw-1300px)/2+16px)] 2xl:right-[calc((100vw-1500px)/2+16px)] w-[260px]"
        aria-hidden="true"
      >
        <TOC />
      </div>
    </div>
  );
}
