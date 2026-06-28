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
      <rect width="64" height="64" rx="14" fill="#0d9488" />
      {/* Upper bullet */}
      <circle cx="18" cy="26" r="4.5" fill="#fff" />
      <rect x="28" y="21.5" width="22" height="9" rx="4.5" fill="#fff" />
      {/* Lower bullet */}
      <circle cx="18" cy="42" r="4.5" fill="#fff" />
      <rect x="28" y="37.5" width="15" height="9" rx="4.5" fill="#fff" />
    </svg>
  );
}
