import type { MDXComponents } from "mdx/types";
import CodeBlock from "@/components/CodeBlock";
import FlowDiagram from "@/components/FlowDiagram";
import ParallelFlow from "@/components/ParallelFlow";

const baseHeading = "font-semibold tracking-tight text-gray-900 dark:text-gray-100 scroll-m-20";
const proseText = "text-gray-700 dark:text-gray-300 leading-relaxed";

const components: MDXComponents = {
  h1: (props) => <h1 {...props} className={`${baseHeading} text-3xl mt-8 mb-4`} />,
  h2: (props) => <h2 {...props} className={`${baseHeading} text-2xl mt-8 mb-3`} />,
  h3: (props) => <h3 {...props} className={`${baseHeading} text-xl mt-6 mb-2`} />,
  p: (props) => <p {...props} className={`${proseText} my-4`} />,
  ul: (props) => (
    <ul {...props} className="list-disc list-inside my-4 pl-2 space-y-2 text-gray-700 dark:text-gray-300" />
  ),
  ol: (props) => (
    <ol {...props} className="list-decimal list-inside my-4 pl-2 space-y-2 text-gray-700 dark:text-gray-300" />
  ),
  a: (props) => {
    const { target, rel, ...rest } = props as any;
    const isExternal = target === "_blank";
    const safeRel = isExternal ? (rel ? `${rel} noopener noreferrer` : "noopener noreferrer") : rel;
    return (
      <a {...rest} target={target} rel={safeRel}
        className="text-cyan-600 hover:underline hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
      />
    );
  },
  blockquote: (props) => (
    <blockquote
      {...props}
      className="border-l-4 border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 pl-4 pr-3 py-2 rounded-r-lg italic my-4 text-gray-600 dark:text-gray-400"
    />
  ),
  code: (props) => <code {...props} />,
  pre: (props) => <CodeBlock {...props} />,
  table: (props) => (
    <div className="my-6 w-full text-sm overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table {...props} className="w-full border-collapse" />
    </div>
  ),
  th: (props) => (
    <th {...props} className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-2.5 text-left font-semibold text-gray-900 dark:text-gray-100" />
  ),
  tr: (props) => (
    <tr {...props} className="border-b border-gray-100 dark:border-gray-800/60 last:border-b-0" />
  ),
  td: (props) => (
    <td {...props} className="px-4 py-2.5" />
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-800" />,
  img: (props) => (
    <span className="my-6 flex bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
      <img {...props} className="rounded-lg" />
    </span>
  ),
  FlowDiagram,
  ParallelFlow,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
