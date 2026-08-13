'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatedLogo } from '@/components/AnimatedLogo';

const links = [
  { href: '/product', label: 'Velos Shield' },
  { href: '/velossensor', label: 'Velos Sensor' },
  { href: '/industries', label: 'Industries' },
  { href: '/trust', label: 'Trust' },
  { href: '/get-started', label: 'Demo' },
];

export function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const replayShake = () => {
    const el = pillRef.current;
    if (!el) return;
    el.classList.remove('animate-nav-enter');
    // force a reflow so the browser restarts the CSS animation
    void el.offsetWidth;
    el.classList.add('animate-nav-enter');
  };

  useEffect(() => {
    const idx = links.findIndex((l) => l.href === pathname);
    const el = linkRefs.current[idx];
    const nav = navRef.current;
    if (el && nav) {
      const navLeft = nav.getBoundingClientRect().left;
      const { left, width } = el.getBoundingClientRect();
      setIndicator({ left: left - navLeft, width, opacity: 1 });
    } else {
      setIndicator((s) => ({ ...s, opacity: 0 }));
    }
  }, [pathname]);

  return (
    <nav className="fixed top-4 inset-x-0 z-50 pointer-events-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={pillRef}
          onMouseEnter={replayShake}
          className="pointer-events-auto animate-nav-enter flex items-center justify-between rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.92)_0%,rgba(243,244,246,.82)_100%)] px-5 py-2.5 shadow-[0_18px_50px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center no-underline shrink-0">
              <AnimatedLogo className="h-10 w-auto" />
            </Link>

            <div ref={navRef} className="hidden md:flex items-center relative">
              <span
                className="absolute top-[3px] bottom-[3px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(246,247,249,.92)_100%)] shadow-[0_6px_18px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] transition-[left,width,opacity] duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity }}
              />
              {links.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    className={`group relative z-10 px-3 py-2 text-[13px] font-medium no-underline rounded-full overflow-hidden ${
                      active ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {!active && (
                      <span className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(28,32,40,.95)_0%,rgba(12,15,20,.96)_100%)] opacity-0 scale-75 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100" />
                    )}
                    <span className={`relative z-10 transition-colors duration-300 ${!active ? 'group-hover:text-white' : ''}`}>
                      {l.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href="/api/auth/logout" className="hidden lg:inline-flex text-[11px] text-muted-foreground px-3 py-1.5 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.9)_0%,rgba(244,245,247,.78)_100%)] shadow-[0_1px_0_rgba(255,255,255,.85)_inset] hover:text-foreground transition-colors no-underline">
              Sign out
            </a>
            <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-9 px-4 text-[13px] font-semibold bg-[linear-gradient(180deg,#3da2ff_0%,#0071e3_48%,#005ac1_100%)] text-white shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,113,227,.24)] hover:brightness-[1.03] transition-all no-underline">
              Request Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
