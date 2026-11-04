// Pixel-art series mascots drawn as SVG rects: crisp at any size, no image files, works in both themes.
// Each sprite is a 16×16 grid of palette letters ("." = transparent) plus an optional floating prop.
// K = outline (theme-aware), P = pupils/mouth (always dark so faces read on both themes).
// Idle animations (bob, blink, float) live in globals.css and switch off for prefers-reduced-motion.

type Grid = string[];

// Outline follows the theme (near-black on light, light gray on dark) — see --pixel-outline in globals.css
const OUTLINE = "var(--pixel-outline)";

type Sprite = {
  palette: Record<string, string>;
  body: Grid;
  /** eyelids: [x, y, w, h] rects in the body color, flashed briefly to blink */
  lids: [number, number, number, number][];
  lidColor: string;
  prop?: { grid: Grid; palette: Record<string, string>; x: number; y: number };
};

const SPRITES = {
  // JavaScript Plot Twists — a JS-yellow block, side-eyeing the spec, permanently surprised
  twisty: {
    palette: { K: OUTLINE, P: "#1f1d1a", Y: "#f7df1e", y: "#d9bf0f", W: "#ffffff", R: "#ff8f8f" },
    body: [
      "......KK........",
      ".....K..K.......",
      "......K.K.......",
      ".......K........",
      "...KKKKKKKKKK...",
      "..KYYYYYYYYYYK..",
      "..KYYYYYYYYYYK..",
      "..KYWWPYYWWPYK..",
      "..KYWWPYYWWPYK..",
      "..KYYYYYYYYYYK..",
      "..KYRYYPPYYRYK..",
      "..KYYYYPPYYYYK..",
      "..KyyyyyyyyyyK..",
      "...KKKKKKKKKK...",
      "....KK....KK....",
      "...KKK....KKK...",
    ],
    lids: [
      [4, 7, 3, 2],
      [9, 7, 3, 2],
    ],
    lidColor: "#f7df1e",
    prop: {
      palette: { Q: "#3a52ee" },
      x: 16,
      y: 0,
      grid: [".QQQ.", "Q...Q", "....Q", "...Q.", "..Q..", ".....", "..Q.."],
    },
  },
  // Next.js Field Notes — a white explorer in a ranger hat with a blue field notebook
  scout: {
    palette: {
      K: OUTLINE,
      P: "#16181e",
      W: "#f6f7f9",
      g: "#cfd3dc",
      T: "#c9a066",
      d: "#8b6a3c",
      B: "#3a52ee",
      w: "#e2e9ff",
    },
    body: [
      "................",
      ".....TTTTTT.....",
      ".....TddddT.....",
      "...TTTTTTTTTT...",
      "...KKKKKKKKKK...",
      "..KWWWWWWWWWWK..",
      "..KWPPWWWWPPWK..",
      "..KWPPWWWWPPWK..",
      "..KWWWWWWWWWWK..",
      "..KWWPWWWWPWWK..",
      "..KWWWPPPPWWWK..",
      "..KggBBBBBBggK..",
      "..KggBwwwwBggK..",
      "..KggBBBBBBggK..",
      "...KKKKKKKKKK...",
      "....KK....KK....",
    ],
    lids: [
      [4, 6, 2, 2],
      [10, 6, 2, 2],
    ],
    lidColor: "#f6f7f9",
    // magnifying glass
    prop: {
      palette: { G: "#f5b82e", g: "#fff3d1", H: "#8b6a3c" },
      x: 16,
      y: 0,
      grid: [".GGG.", "GgggG", "GgggG", ".GGG.", "...H.", "....H"],
    },
  },
} satisfies Record<string, Sprite>;

export type SpriteName = keyof typeof SPRITES;

function Pixels({
  grid,
  palette,
  dx = 0,
  dy = 0,
}: {
  grid: Grid;
  palette: Record<string, string>;
  dx?: number;
  dy?: number;
}) {
  const rects: React.ReactNode[] = [];
  grid.forEach((row, y) => {
    // merge horizontal runs of the same color into one rect (fewer nodes, no hairline seams)
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let run = 1;
      while (row[x + run] === ch) {
        run++;
      }
      if (ch !== "." && palette[ch]) {
        // style (not the fill attribute) so CSS variables resolve in every browser
        rects.push(
          <rect key={`${x}-${y}`} x={x + dx} y={y + dy} width={run} height={1} style={{ fill: palette[ch] }} />
        );
      }
      x += run;
    }
  });
  return <>{rects}</>;
}

export default function PixelSprite({
  name,
  size = 64,
  animate = true,
  className = "",
  title,
}: {
  name: SpriteName;
  size?: number;
  animate?: boolean;
  className?: string;
  /** accessible name; omit for decorative use */
  title?: string;
}) {
  const s: Sprite = SPRITES[name];
  return (
    <svg
      viewBox="0 0 22 18"
      width={size}
      height={(size * 18) / 22}
      shapeRendering="crispEdges"
      className={`${animate ? "pixel-animate" : ""} ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g className="pixel-bob">
        <Pixels grid={s.body} palette={s.palette} dy={2} />
        <g className="pixel-lid">
          {s.lids.map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y + 2} width={w} height={h} fill={s.lidColor} />
          ))}
        </g>
      </g>
      {s.prop && (
        <g className="pixel-float">
          <Pixels grid={s.prop.grid} palette={s.prop.palette} dx={s.prop.x} dy={s.prop.y} />
        </g>
      )}
    </svg>
  );
}
