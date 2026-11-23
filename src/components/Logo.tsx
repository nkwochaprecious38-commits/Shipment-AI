// Temporary placeholder mark. Replace the contents of <Mark /> with the final SVG logo.
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#142B45" />
      <path d="M8 22c0-5 4-5 8-5s8 0 8-5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="12" r="3" fill="#18A6A0" />
    </svg>
  )
}
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark />
      <span className={`font-display text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-navy'}`}>Shipment AI</span>
    </span>
  )
}
