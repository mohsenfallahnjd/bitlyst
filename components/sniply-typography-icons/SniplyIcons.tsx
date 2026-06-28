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
      {/* "b" lettermark: stem right edge (x=24) tangent to bowl outer left edge */}
      <circle cx="37" cy="40" r="13" fill="#fff" />
      <circle cx="37" cy="40" r="7" fill="#0d9488" />
      <rect x="15" y="11" width="9" height="42" rx="4.5" fill="#fff" />
    </svg>
  );
}
