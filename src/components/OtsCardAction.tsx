'use client';

import { useState } from 'react';

const items = [
  {
    num: '01',
    title: 'See everything',
    subtitle: 'Find and inventory all your assets',
    body: "Stop guessing what's on your network. Build a complete inventory of OT, IoT, and IT assets.",
  },
  {
    num: '02',
    title: 'Prioritize findings',
    subtitle: 'Prioritize based on risk',
    body: 'Eliminate alert fatigue. Focus on critical vulnerabilities that actually threaten your production uptime and physical safety.',
  },
  {
    num: '03',
    title: 'Detect threats',
    subtitle: 'Detect changes and anomalies',
    body: 'Identify known and unknown threats with real-time configuration change and anomaly detection.',
  },
  {
    num: '04',
    title: 'Protect networks',
    subtitle: 'Monitor risk across your networks',
    body: 'Visualize communication patterns and baseline asset behavior. Automatically identify boundary violations and enforce segmentation to prevent lateral movement across IT and OT.',
  },
  {
    num: '05',
    title: 'Simplify compliance',
    subtitle: 'Streamline and manage compliance',
    body: 'Eliminate the manual burden of compliance audits. Automatically map your security posture to standards like NERC CIP, NIST, ISO 27001, PCI DSS, and IEC 62443.',
  },
];

function Diagram() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-[linear-gradient(180deg,#fbfbfd,#f3f4f8)] shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: 'radial-gradient(#003C64 1px, transparent 1.2px)', backgroundSize: '22px 22px' }}
      />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        <g stroke="#003C64" strokeOpacity="0.2" strokeWidth="1.5">
          <line x1="200" y1="150" x2="70" y2="60" />
          <line x1="200" y1="150" x2="330" y2="70" />
          <line x1="200" y1="150" x2="60" y2="220" />
          <line x1="200" y1="150" x2="330" y2="230" />
          <line x1="200" y1="150" x2="200" y2="258" />
        </g>
        <line x1="200" y1="150" x2="330" y2="70" stroke="#FF612A" strokeOpacity="0.5" strokeWidth="2" />
        <circle cx="70" cy="60" r="16" fill="#003C64" />
        <circle cx="330" cy="70" r="16" fill="#003C64" />
        <circle cx="60" cy="220" r="14" fill="#003C64" />
        <circle cx="330" cy="230" r="14" fill="#003C64" />
        <circle cx="200" cy="258" r="12" fill="#003C64" />
        <circle cx="200" cy="150" r="26" fill="#FF612A" />
        <circle cx="200" cy="150" r="34" stroke="#FF612A" strokeOpacity="0.25" strokeWidth="2" />
        <circle cx="200" cy="150" r="44" stroke="#FF612A" strokeOpacity="0.12" strokeWidth="1.5" />
      </svg>
      <span className="absolute bottom-3 right-4 text-[11px] font-medium text-muted-foreground">Diagram placeholder</span>
    </div>
  );
}

export function OtsCardAction() {
  const [active, setActive] = useState(0);
  const item = items[active];

  return (
    <div className="mt-14">
      {/* Numbered tab nav */}
      <div className="flex flex-wrap gap-2 mb-8">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={it.num}
              type="button"
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all no-underline cursor-pointer ${
                on
                  ? 'bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] text-white shadow-[0_8px_20px_rgba(0,60,100,.25)]'
                  : 'border border-border/70 bg-white/70 text-[#003C64] hover:bg-white'
              }`}
            >
              <span className="text-xs font-bold text-[#FF612A]">{it.num}</span>
              {it.title}
            </button>
          );
        })}
      </div>

      {/* Split panel: text + diagram */}
      <div className="grid lg:grid-cols-2 gap-10 items-center rounded-[2rem] border border-border/60 bg-white/85 p-8 md:p-12 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_20px_60px_rgba(15,23,42,.06)] backdrop-blur-sm">
        <div>
          <p className="text-sm font-bold text-[#FF612A] mb-2">{item.num}</p>
          <h3 className="text-3xl md:text-4xl font-semibold tracking-[-.04em] text-[#003C64] mb-2">{item.title}</h3>
          <p className="text-lg font-medium text-foreground mb-4">{item.subtitle}</p>
          <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-xl">{item.body}</p>
          <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#003C64] transition-colors cursor-pointer">
            Learn more <span aria-hidden>→</span>
          </span>
        </div>
        <Diagram />
      </div>
    </div>
  );
}
