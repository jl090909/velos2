'use client';

import { useState } from 'react';

const STORAGE_KEY = 'gisec-ticker-dismissed';

const ITEMS: { label: string; href?: string; download?: boolean }[] = [
  { label: 'Meet Velos Shield at GISEC Global 2026' },
  { label: '16 – 18 Sep 2026' },
  { label: 'Dubai Exhibition Centre (DEC), Expo City' },
  { label: 'Download our brochure', href: '/velosshield-brochure.pdf', download: true },
  { label: 'gisec.ae', href: 'https://gisec.ae/' },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t) => (
        <span key={t.label} className="flex items-center whitespace-nowrap">
          {t.href ? (
            <a
              href={t.href}
              {...(t.download ? { download: true } : { target: '_blank', rel: 'noreferrer' })}
              className="px-6 text-[12px] font-semibold tracking-[.14em] uppercase underline underline-offset-4 decoration-[#FF612A] hover:text-[#FF612A] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {t.label}
            </a>
          ) : (
            <span className="px-6 text-[12px] font-semibold tracking-[.14em] uppercase">{t.label}</span>
          )}
          <span className="text-[#FF612A]">•</span>
        </span>
      ))}
    </div>
  );
}

export function GisecTicker() {
  const [closed, setClosed] = useState(() => {
    try {
      return !!window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  function close() {
    setClosed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  if (closed) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[90] bg-[linear-gradient(90deg,#042e2d_0%,#0a5a58_50%,#042e2d_100%)] text-white shadow-[0_4px_20px_rgba(0,0,0,.25)]">
      <style>{`@keyframes gisec-scroll { to { transform: translateX(-50%); } } .gisec-marquee { display: flex; width: max-content; animation: gisec-scroll 28s linear infinite; } .gisec-marquee:hover { animation-play-state: paused; }`}</style>
      <div className="flex items-center h-9 pr-10 overflow-hidden">
        <div className="gisec-marquee">
          <Row />
          <Row />
        </div>
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-6 w-6 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors text-[13px]"
      >
        ✕
      </button>
    </div>
  );
}
