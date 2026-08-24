'use client';

import Image from 'next/image';
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

function Diagram({ active }: { active: number }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`absolute inset-0 transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${active === i - 1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8'}`}>
          <Image src={i === 1 ? '/nodes.png' : i === 4 ? '/d5.png' : i === 5 ? '/d1.png' : `/d${i}.png`} alt="" fill className="object-cover" unoptimized />
        </div>
      ))}
    </>
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

      {/* Full-bleed diagram with text at bottom */}
      <div className="relative min-h-[500px] lg:min-h-[600px] overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(15,23,42,.06)]">
        <Diagram active={active} />
        <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent pt-32 pb-6 px-8 md:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#FF612A] mb-2">{item.num}</p>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-[-.04em] text-white mb-2">{item.title}</h3>
            <p className="text-lg font-medium text-white/80 mb-4">{item.subtitle}</p>
            <p className="text-base text-white/60 leading-relaxed mb-6">{item.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
