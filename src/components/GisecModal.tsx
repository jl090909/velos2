'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'gisec-modal-dismissed-v3';

export function GisecModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        t = setTimeout(() => setOpen(true), 1000);
      }
    } catch {
      t = setTimeout(() => setOpen(true), 1000);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(0,20,35,.55)] backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Meet Velos Shield at GISEC Global 2026"
    >
      <div
        className="w-[720px] max-w-full overflow-hidden rounded-[1.35rem] bg-white shadow-[0_32px_90px_rgba(0,40,70,.35)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full bg-[rgba(0,0,0,.45)] text-white border border-white/40 hover:bg-[rgba(0,0,0,.6)] transition-colors"
        >
          ✕
        </button>
        <div className="grid sm:grid-cols-[240px_1fr]">
          <div className="relative min-h-[220px] sm:min-h-[380px] bg-[#063b3a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gisec-details.png"
              alt="GISEC Global 2026 — 16 to 18 September, Dubai Exhibition Centre"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div className="p-7 md:p-8 flex flex-col justify-center text-center sm:text-left">
            <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-2">
              GISEC Global 2026 • Dubai
            </p>
            <h2 className="text-2xl md:text-[28px] font-semibold tracking-[-.02em] text-[#003C64] mb-2">
              Meet Velos Shield at GISEC
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Come talk OT security with us — or take our brochure with you.
            </p>
            <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
              <a
                href="/velosshield-brochure.pdf"
                download
                className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
              >
                Download brochure
              </a>
              <a
                href="https://gisec.ae/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-border/70 bg-white text-foreground hover:bg-muted transition-colors no-underline"
              >
                Visit gisec.ae
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
