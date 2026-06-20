// FlowDiagram — uses simple string props for MDX compatibility
// Usage:
//   <FlowDiagram
//     nodes="User → CDN Edge"
//     branch1="[green] Cache HIT → Instant Response"
//     branch2="[orange] Cache MISS → Origin → Cache → Respond"
//   />

type FlowDiagramProps = {
  nodes?: string;
  branch1?: string;
  branch2?: string;
  branch3?: string;
  branch4?: string;
};

const colorMap: Record<string, { badge: string; node: string }> = {
  green:  { badge: "bg-green-100 dark:bg-green-950/40 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300", node: "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700 text-green-900 dark:text-green-200" },
  orange: { badge: "bg-orange-100 dark:bg-orange-950/40 border-orange-400 dark:border-orange-600 text-orange-800 dark:text-orange-300", node: "bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200" },
  cyan:   { badge: "bg-cyan-100 dark:bg-cyan-950/40 border-cyan-400 dark:border-cyan-600 text-cyan-800 dark:text-cyan-300", node: "bg-cyan-50 dark:bg-cyan-950/20 border-cyan-300 dark:border-cyan-700 text-cyan-900 dark:text-cyan-200" },
  red:    { badge: "bg-red-100 dark:bg-red-950/40 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300", node: "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700 text-red-900 dark:text-red-200" },
};

function parseBranch(str: string) {
  const match = str.match(/^\[(green|orange|cyan|red)\]\s*/);
  const color = match ? match[1] : "cyan";
  const rest = match ? str.slice(match[0].length) : str;
  const parts = rest.split(/\s*→\s*/);
  return { color, label: parts[0], path: parts.slice(1) };
}

function Arrow() {
  return <span className="text-gray-400 dark:text-gray-600 text-sm select-none">→</span>;
}

function Node({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-semibold whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}

export default function FlowDiagram({ nodes, branch1, branch2, branch3, branch4 }: FlowDiagramProps) {
  const nodeList = nodes ? nodes.split(/\s*→\s*/) : [];
  const branches = [branch1, branch2, branch3, branch4]
    .filter(Boolean)
    .map((s) => parseBranch(s!));

  const defaultNodeCls = "bg-cyan-50 dark:bg-cyan-950/20 border-cyan-300 dark:border-cyan-700 text-cyan-900 dark:text-cyan-200";

  return (
    <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5 flex flex-col gap-3 text-sm overflow-x-auto not-prose">
      {/* Shared nodes */}
      {nodeList.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {nodeList.map((node, i) => (
            <span key={i} className="flex items-center gap-2">
              <Node label={node} cls={defaultNodeCls} />
              {i < nodeList.length - 1 && <Arrow />}
            </span>
          ))}
        </div>
      )}

      {/* Branches */}
      {branches.length > 0 && (
        <div className="flex flex-col gap-2.5 pl-4 border-l-2 border-gray-200 dark:border-gray-700 mt-1">
          {branches.map((branch, i) => {
            const s = colorMap[branch.color] ?? colorMap.cyan;
            return (
              <div key={i} className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold whitespace-nowrap ${s.badge}`}>
                  {branch.label}
                </span>
                {branch.path.length > 0 && <Arrow />}
                {branch.path.map((node, ni) => (
                  <span key={ni} className="flex items-center gap-2">
                    <Node label={node} cls={s.node} />
                    {ni < branch.path.length - 1 && <Arrow />}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
