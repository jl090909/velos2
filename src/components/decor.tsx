// Decorative accents for the site (pure CSS/SVG, no external assets)

export function DotGrid({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(#003C64 1.5px, transparent 1.7px), radial-gradient(#FF612A 2px, transparent 2.2px)',
        backgroundSize: '16px 16px, 52px 52px',
        backgroundPosition: '0 0, 8px 8px',
        opacity: 0.32,
      }}
    />
  );
}

export function Gear({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="decor-gear" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF612A" />
          <stop offset="100%" stopColor="#F5C861" />
        </linearGradient>
      </defs>
      <g stroke="url(#decor-gear)" strokeWidth="5" strokeLinecap="round">
        <line x1="32" y1="9" x2="32" y2="55" />
        <line x1="9" y1="32" x2="55" y2="32" />
        <line x1="16" y1="16" x2="48" y2="48" />
        <line x1="48" y1="16" x2="16" y2="48" />
      </g>
      <circle cx="32" cy="32" r="5" fill="#FF612A" />
    </svg>
  );
}

export function RadarRing({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} fill="none" aria-hidden>
      <circle cx="300" cy="300" r="290" stroke="#FF612A" strokeWidth="1" opacity="0.18" />
      <circle cx="300" cy="300" r="240" stroke="#003C64" strokeWidth="1" opacity="0.14" />
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 300 300"
          to="360 300 300"
          dur="40s"
          repeatCount="indefinite"
        />
        <circle cx="300" cy="300" r="290" stroke="#FF612A" strokeWidth="1.5" strokeDasharray="3 18" opacity="0.5" />
        <circle cx="300" cy="300" r="240" stroke="#003C64" strokeWidth="1.5" strokeDasharray="2 14" opacity="0.4" />
      </g>
    </svg>
  );
}

export function Wordmark({ text = 'VELOS SHIELD', className = '' }: { text?: string; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}>
      <span className="whitespace-nowrap text-[11vw] font-black leading-none tracking-[-0.05em] text-[#003C64] opacity-[0.045]">
        {text}
      </span>
    </div>
  );
}
