import type { MDXComponents } from "mdx/types";
import CodeBlock from "@/components/CodeBlock";
import DeepDive from "@/components/DeepDive";
import FadeImage from "@/components/FadeImage";
import FlowDiagram from "@/components/FlowDiagram";
import ParallelFlow from "@/components/ParallelFlow";

const baseHeading = "font-bold tracking-tight text-gray-900 dark:text-gray-50 scroll-mt-24";

/** h2/h3 with a hover "#" link so readers can share a section. */
function Heading({ as: Tag, className, children, id, ...props }: React.ComponentProps<"h2"> & { as: "h2" | "h3" }) {
  return (
    <Tag id={id} {...props} className={className}>
      {children}
      {id && (
        <a href={`#${id}`} className="heading-anchor" aria-label="Link to this section">
          #
        </a>
      )}
    </Tag>
  );
}

const components: MDXComponents = {
  h1: (props) => <h2 {...props} className={`${baseHeading} text-[1.6rem] leading-tight mt-14 mb-4`} />,
  h2: (props) => <Heading as="h2" {...props} className={`${baseHeading} text-[1.45rem] leading-snug mt-14 mb-4`} />,
  h3: (props) => <Heading as="h3" {...props} className={`${baseHeading} text-[1.15rem] leading-snug mt-10 mb-3`} />,
  h4: (props) => <h4 {...props} className={`${baseHeading} text-base mt-8 mb-2`} />,
  p: (props) => <p {...props} className="my-5" />,
  ul: (props) => <ul {...props} className="list-disc my-5 pl-6 space-y-2" />,
  ol: (props) => <ol {...props} className="list-decimal my-5 pl-6 space-y-2" />,
  a: (props) => {
    const { target, rel, ...rest } = props as React.ComponentProps<"a">;
    const isExternal = target === "_blank" || /^https?:\/\//.test(rest.href ?? "");
    const safeRel = isExternal ? (rel ? `${rel} noopener noreferrer` : "noopener noreferrer") : rel;
    return (
      <a
        {...rest}
        target={isExternal ? "_blank" : target}
        rel={safeRel}
        className="font-medium text-brand-600 dark:text-brand-400 underline decoration-brand-600/30 dark:decoration-brand-400/30 underline-offset-[3px] hover:decoration-current transition-colors"
      />
    );
  },
  blockquote: (props) => (
    <blockquote
      {...props}
      className="my-6 rounded-r-xl border-l-[3px] border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 px-5 py-1 text-gray-700 dark:text-gray-300 [&>p]:my-3"
    />
  ),
  code: (props) => <code {...props} />,
  pre: (props) => <CodeBlock {...props} />,
  table: (props) => (
    <div className="my-7 w-full text-[0.9rem] leading-relaxed overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table {...props} className="w-full border-collapse" />
    </div>
  ),
  th: (props) => (
    <th
      {...props}
      className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-2.5 text-left font-semibold text-gray-900 dark:text-gray-100"
    />
  ),
  tr: (props) => <tr {...props} className="border-b border-gray-100 dark:border-gray-800/60 last:border-b-0" />,
  td: (props) => <td {...props} className="px-4 py-2.5" />,
  hr: () => <hr className="my-12 border-gray-200 dark:border-gray-800" />,
  // width/height come from lib/rehypeImageSize (local files only). Sized raster images go through
  // next/image (AVIF/WebP, responsive srcset) and reserve their box so text doesn't jump on load.
  img: ({ src, alt, width, height, ...props }) => {
    const w = Number(width);
    const h = Number(height);
    const optimizable = typeof src === "string" && w > 0 && h > 0 && !/\.svg($|[?#])/i.test(src);
    return (
      <span className="my-8 flex flex-col gap-2 rounded-xl border border-gray-200/70 dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-3">
        <FadeImage
          {...(optimizable ? {} : props)}
          optimized={optimizable}
          src={src}
          alt={alt ?? ""}
          width={width}
          height={height}
          sizes={optimizable ? "(min-width: 768px) 41rem, calc(100vw - 3.5rem)" : undefined}
          className="rounded-lg w-full h-auto"
        />
        {alt && <span className="text-center text-xs text-gray-500 dark:text-gray-400">{alt}</span>}
      </span>
    );
  },
  DeepDive,
  FlowDiagram,
  ParallelFlow,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
