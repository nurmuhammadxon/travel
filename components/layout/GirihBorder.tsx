export function GirihBorder({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="6"
      viewBox="0 0 64 6"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <pattern id="girih" width="16" height="6" patternUnits="userSpaceOnUse">
        <path
          d="M0 3 L4 0 L8 3 L4 6 Z M8 3 L12 0 L16 3 L12 6 Z"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="0.75"
        />
      </pattern>
      <rect width="100%" height="6" fill="url(#girih)" />
    </svg>
  );
}