'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';

import { normalizePath } from '@/lib/utils';

const products = [
  { href: '/product/org-level', label: 'Velos Shield 1.5 · Org-level' },
  { href: '/product/site-level', label: 'Velos Shield 1.1 · Site-level' },
];

const resources = [
  { href: '/resources', label: 'White Papers & Case Studies' },
  { href: '/resources/knowledge-hub', label: 'Knowledge Hub' },
];

const company = [
  { href: '/company/about', label: 'About' },
  { href: '/company/events', label: 'Events' },
  { href: '/company/media', label: 'Media' },
  { href: '/company/careers', label: 'Careers' },
  { href: '/company/contact', label: 'Contact Us' },
];

const panelClass =
  'invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-200 absolute left-0 top-full mt-3 z-50 min-w-[300px] rounded-2xl bg-[rgba(250,250,252,.82)] p-2 shadow-[0_24px_70px_rgba(15,23,42,.18),0_1px_0_rgba(255,255,255,.9)_inset] backdrop-blur-2xl backdrop-saturate-150';

const itemClass =
  'block px-4 py-3 rounded-2xl text-[15px] font-medium no-underline text-[#003C64] hover:bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] hover:text-[#FF612A] transition-colors';

function NavDropdown({ label, items, active }: { label: string; items: { href: string; label: string }[]; active: boolean }) {
  return (
    <div className="relative group">
      <button
        type="button"
        aria-haspopup="true"
        className="px-3 py-2 text-[15px] font-medium rounded-full cursor-pointer bg-transparent border-0"
        style={{ color: active ? '#FF612A' : '#003C64' }}
      >
        {label} <span aria-hidden className="text-[11px] align-middle">▾</span>
      </button>
      <div className={panelClass}>
        {items.map((p) => (
          <Link key={p.href} href={p.href} className={itemClass}>
            {p.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = normalizePath(usePathname());
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const replayShake = () => {
    const el = pillRef.current;
    if (!el) return;
    el.classList.remove('animate-nav-enter');
    // force a reflow so the browser restarts the CSS animation
    void el.offsetWidth;
    el.classList.add('animate-nav-enter');
  };

  return (
    <nav className="fixed top-4 inset-x-0 z-50 pointer-events-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={pillRef}
          onMouseEnter={replayShake}
          className="pointer-events-auto animate-nav-enter glass-nav flex items-center justify-between rounded-full px-5 py-2.5"
        >
          <Link href="/" className="flex items-center no-underline shrink-0">
            <img src="/NEWvsLOGO.png" className="h-[52px] w-auto" alt="Velos Shield" />
          </Link>

          {/* The links are the middle of three groups, so the pill stays balanced now that Industries
              and Trust are gone: logo left, menu centred, call to action right. */}
          <div ref={navRef} className="hidden md:flex flex-1 flex-nowrap items-center justify-center">

              <NavDropdown label="Products" items={products} active={pathname.startsWith('/product')} />

              <NavDropdown
                label="Resources"
                items={resources}
                active={pathname.startsWith('/resources')}
              />

              <Link
                href="/customers"
                className="group relative z-10 px-3 py-2 text-[15px] font-medium no-underline rounded-full overflow-hidden text-[#003C64]"
              >
                {pathname !== '/customers' && (
                  <span className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] opacity-0 scale-75 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100" />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${pathname !== '/customers' ? 'group-hover:text-[#FF612A]' : ''}`}>Customers</span>
              </Link>

              <Link
                href="/partners"
                className="group relative z-10 px-3 py-2 text-[15px] font-medium no-underline rounded-full overflow-hidden text-[#003C64]"
              >
                {pathname !== '/partners' && (
                  <span className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] opacity-0 scale-75 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100" />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${pathname !== '/partners' ? 'group-hover:text-[#FF612A]' : ''}`}>Partners</span>
              </Link>

            <NavDropdown label="Company" items={company} active={pathname.startsWith('/company')} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/demo" className="hidden md:inline-flex items-center justify-center rounded-full h-11 px-5 text-[15px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.24)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline">
              Request Demo
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(246,247,249,.92)_100%)] text-foreground shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_6px_18px_rgba(15,23,42,.08)] transition-all no-underline"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pointer-events-auto mt-2 rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,.96)_0%,rgba(246,247,249,.94)_100%)] p-2 shadow-[0_24px_70px_rgba(15,23,42,.18),0_1px_0_rgba(255,255,255,.9)_inset] backdrop-blur-2xl">
            {[...products, ...resources, ...company].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl text-[16px] font-medium no-underline text-[#003C64] transition-colors"
              >
                {p.label}
              </Link>
            ))}
            {[{ href: '/customers', label: 'Customers' }, { href: '/partners', label: 'Partners' }].map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-[16px] font-medium no-underline transition-colors ${
                    active
                      ? 'bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(246,247,249,.92)_100%)] text-[#003C64] shadow-[0_6px_18px_rgba(15,23,42,.08)]'
                      : 'text-[#003C64]'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/demo"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center rounded-2xl h-12 px-5 text-[15px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.24)] no-underline"
            >
              Request Demo
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
