'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

const items = [
  {
    num: '01',
    title: 'See everything',
    headline: "Velos Shield discovers every OT asset — because you can't protect what you can't see.",
    subtitle: 'Find and inventory all your assets',
    body: "Stop guessing what's on your network. Build a complete inventory of OT, IoT, and IT assets.",
  },
  {
    num: '02',
    title: 'Prioritize findings',
    headline: 'With limited teams and noisy data, we surface what actually threatens production.',
    subtitle: 'Prioritize based on risk',
    body: 'Eliminate alert fatigue. Focus on critical vulnerabilities that actually threaten your production uptime and physical safety.',
  },
  {
    num: '03',
    title: 'Detect threats',
    headline: 'Professional-grade threat monitoring that catches anomalies before they become incidents.',
    subtitle: 'Detect changes and anomalies',
    body: 'Identify known and unknown threats with real-time configuration change and anomaly detection.',
  },
  {
    num: '04',
    title: 'Protect networks',
    headline: 'Visualise, baseline, and enforce — stopping lateral movement across IT and OT.',
    subtitle: 'Monitor risk across your networks',
    body: 'Visualize communication patterns and baseline asset behavior. Automatically identify boundary violations and enforce segmentation to prevent lateral movement across IT and OT.',
  },
  {
    num: '05',
    title: 'Simplify compliance',
    headline: 'Audit-ready evidence mapped to NERC CIP, NIST, ISO 27001, and IEC 62443.',
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

  const next = useCallback(() => setActive((a) => (a + 1) % items.length), []);
  const prev = useCallback(() => setActive((a) => (a - 1 + items.length) % items.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

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
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all no-underline cursor-pointer relative overflow-hidden border ${
                on
                  ? 'border-[#003C64] text-white shadow-[0_8px_20px_rgba(0,60,100,.25)]'
                  : 'border-border/70 bg-white/70 text-[#003C64] hover:bg-white'
              }`}
            >
              <span className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${on ? 'opacity-100' : 'opacity-0'}`} style={{background: 'linear-gradient(90deg, #D6EAF8 0%, #003C64 50%, #001A33 100%)'}}></span>
              <span className="relative z-10 text-xs font-bold text-[#FF612A]">{it.num}</span>
              <span className="relative z-10">{it.title}</span>
              {on && i < items.length - 1 && (
                <span className="relative z-10 ml-1.5 inline-block animate-pulse text-white/70" style={{animation: 'arrowPulse 2s ease-in-out infinite'}}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Animated headline above carousel */}
      <p key={active} className="text-base md:text-lg text-[#FF612A] font-semibold mb-6 max-w-3xl" style={{animation: 'fadeSlideUp 0.5s ease-out 0.2s both'}}>{item.headline}</p>

      {/* Full-bleed diagram with arrows and text at bottom */}
      <div className="relative min-h-[500px] lg:min-h-[600px] overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(15,23,42,.06)] group">
        <Diagram active={active} />
        {/* Left arrow */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/40"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/40"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
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
