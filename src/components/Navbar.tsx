'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { normalizePath } from '@/lib/utils';

const links = [
  { href: '/industries', label: 'Industries' },
  { href: '/trust', label: 'Trust' },
];

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
  'invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-200 absolute left-0 top-full mt-3 z-50 min-w-[300px] rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(246,247,249,.96)_100%)] p-2 shadow-[0_24px_70px_rgba(15,23,42,.18),0_1px_0_rgba(255,255,255,.9)_inset] backdrop-blur-2xl';

const itemClass =
  'block px-4 py-3 rounded-2xl text-[15px] font-medium no-underline text-[#003C64] hover:bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] hover:text-[#FF612A] transition-colors';

function NavDropdown({ label, items, active }: { label: string; items: { href: string; label: string }[]; active: boolean }) {
  return (
    <div className="relative group">
      <button
        type="button"
        aria-haspopup="true"
        className="px-4 py-2 text-[17px] font-medium rounded-full cursor-pointer bg-transparent border-0"
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
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

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
      const navRect = nav.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setIndicator({
        left: rect.left - navRect.left,
        top: rect.top - navRect.top,
        width: rect.width,
        height: rect.height,
        opacity: 1,
      });
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
          className="pointer-events-auto animate-nav-enter flex items-center justify-between rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.92)_0%,rgba(243,244,246,.82)_100%)] px-6 py-3 shadow-[0_18px_50px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-5 min-w-0">
            <Link href="/" className="flex items-center no-underline shrink-0">
              <img src="/NEWvsLOGO.png" className="h-[62px] w-auto" alt="Velos Shield" />
            </Link>

            <div ref={navRef} className="hidden md:flex flex-wrap items-center gap-y-1 relative">
              <span
                className="absolute rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(246,247,249,.92)_100%)] shadow-[0_6px_18px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] transition-[left,top,width,height,opacity] duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{
                  left: indicator.left,
                  top: indicator.top,
                  width: indicator.width,
                  height: indicator.height,
                  opacity: indicator.opacity,
                }}
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
                    className={`group relative z-10 px-4 py-2 text-[17px] font-medium no-underline rounded-full overflow-hidden ${
                      'text-[#003C64]'
                    }`}
                  >
                    {!active && (
                      <span className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] opacity-0 scale-75 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100" />
                    )}
                    <span className={`relative z-10 transition-colors duration-300 ${!active ? 'group-hover:text-[#FF612A]' : ''}`}>
                      {l.label}
                    </span>
                  </Link>
                );
              })}

              <NavDropdown label="Products" items={products} active={pathname.startsWith('/product')} />

              <NavDropdown
                label="Resources"
                items={resources}
                active={pathname.startsWith('/resources')}
              />

              <Link
                href="/customers"
                className="group relative z-10 px-4 py-2 text-[17px] font-medium no-underline rounded-full overflow-hidden text-[#003C64]"
              >
                {pathname !== '/customers' && (
                  <span className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] opacity-0 scale-75 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100" />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${pathname !== '/customers' ? 'group-hover:text-[#FF612A]' : ''}`}>Customers</span>
              </Link>

              <Link
                href="/partners"
                className="group relative z-10 px-4 py-2 text-[17px] font-medium no-underline rounded-full overflow-hidden text-[#003C64]"
              >
                {pathname !== '/partners' && (
                  <span className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] opacity-0 scale-75 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100" />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${pathname !== '/partners' ? 'group-hover:text-[#FF612A]' : ''}`}>Partners</span>
              </Link>

              <NavDropdown label="Company" items={company} active={pathname.startsWith('/company')} />
            </div>
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
            {[...links, { href: '/customers', label: 'Customers' }, { href: '/partners', label: 'Partners' }].map((l) => {
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
