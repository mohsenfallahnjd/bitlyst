import type { MDXComponents } from "mdx/types";
import SyntaxHighlighter from "react-syntax-highlighter";

/**
 * Reusable Tailwind classes for consistent MDX styling.
 * Adjust colors/sizes here to match your brand.
 */
const baseHeading = "font-semibold tracking-tight text-gray-900 dark:text-gray-100 scroll-m-20";
const proseText = "text-gray-700 dark:text-gray-300 leading-relaxed";
const _CustomSyntaxHighlighter: any = SyntaxHighlighter;

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
  a: (props) => (
    <a
      {...props}
      className="text-cyan-600 hover:underline hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
  blockquote: (props) => (
    <blockquote {...props} className="border-l-4 border-cyan-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400" />
  ),
  code: (props) => <code {...props} />,
  pre: (props) => (
    <pre
      {...props}
      style={{ backgroundColor: "#282c34" }}
      className={"my-4 overflow-x-auto rounded-lg p-4 text-gray-100 text-sm leading-snug ".concat(
        props.className || ""
      )}
    />
  ),
  table: (props) => (
    <div className="my-6 w-full border-collapse border border-gray-200 dark:border-gray-700 text-sm overflow-x-auto">
      <table {...props} className="w-full" />
    </div>
  ),
  th: (props) => (
    <th
      {...props}
      className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-left font-semibold"
    />
  ),
  td: (props) => <td {...props} className="border border-gray-200 dark:border-gray-700 px-3 py-2" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
