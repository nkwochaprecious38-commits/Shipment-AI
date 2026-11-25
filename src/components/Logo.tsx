// Official Shipment AI brand mark (vector redraw of the approved logo).
// Colours: navy #0A214A, blue #2F60EB, green #58C09A. The "light" variant swaps navy for white for dark backgrounds.
export function Mark({ height = 32, light = false }: { height?: number; light?: boolean }) {
  const navy = light ? '#FFFFFF' : '#0A214A'
  return (
    <svg height={height} width={height * 1.787} viewBox="15 30 840 470" role="img" aria-label="Shipment AI" style={{ display: 'block' }}>
      <g fill="#58C09A">
        <rect x="112" y="198" width="195" height="40" rx="20" />
        <rect x="22" y="285" width="372" height="40" rx="20" />
        <rect x="155" y="372" width="250" height="40" rx="20" />
      </g>
      <g strokeLinejoin="round" strokeWidth="14">
        <path d="M400 42 L790 42 L725 145 L445 145 L445 180 L500 205 L545 225 L585 315 L385 315 L305 140 Z" fill={navy} stroke={navy} />
        <path d="M410 368 L840 368 L710 488 L325 488 Z" fill={navy} stroke={navy} />
        <path d="M555 200 L725 200 L845 355 L700 355 L690 318 L585 318 L560 235 Z" fill="#2F60EB" stroke="#2F60EB" />
      </g>
    </svg>
  )
}

const sizes = { sm: [28, 'text-lg'], md: [38, 'text-2xl'], lg: [64, 'text-5xl'], xl: [84, 'text-6xl'] } as const

export function Logo({ light = false, size = 'md' }: { light?: boolean; size?: keyof typeof sizes }) {
  const [h, t] = sizes[size]
  return (
    <span className="inline-flex items-center gap-3">
      <Mark height={h} light={light} />
      <span className={`font-display font-extrabold leading-none tracking-tight ${t} ${light ? 'text-white' : 'text-[#0A214A]'}`}>
        Shipment <span className={light ? 'text-[#7FA2FF]' : 'text-[#2F60EB]'}>AI</span>
      </span>
    </span>
  )
}
