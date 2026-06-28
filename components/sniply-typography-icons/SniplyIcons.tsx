export function SniplyRoundedMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <title>Bitlyst</title>
      <rect width="64" height="64" rx="13" fill="#0d9488" />
      {/* Bowl outer — left edge (cx-r=20) overlaps stem for clean join */}
      <circle cx="34" cy="40" r="14" fill="#fff" />
      {/* Inner cutout — left edge (cx-r=26) stays right of stem (x=23) */}
      <circle cx="34" cy="40" r="8" fill="#0d9488" />
      {/* Stem — drawn last, covers left arc of outer circle cleanly */}
      <rect x="13" y="10" width="10" height="44" rx="5" fill="#fff" />
    </svg>
  );
}
