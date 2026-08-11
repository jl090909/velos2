'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/product', label: 'Product' },
  { href: '/industries', label: 'Industries' },
  { href: '/trust', label: 'Trust' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 inset-x-0 z-50 pointer-events-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pointer-events-auto flex items-center justify-between rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.92)_0%,rgba(243,244,246,.82)_100%)] px-5 py-3 shadow-[0_18px_50px_rgba(15,23,42,.08),0_1px_0_rgba(255,255,255,.9)_inset] backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-[-.02em] text-foreground no-underline">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[linear-gradient(180deg,#5bb6ff_0%,#0071e3_100%)] shadow-[0_0_0_4px_rgba(0,113,227,.12)]" />
            Velo<span className="bg-gradient-to-r from-[#0071e3] via-[#0f7ddf] to-[#6bc1ff] bg-clip-text text-transparent">shield</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.82)_0%,rgba(244,245,247,.7)_100%)] p-1 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium no-underline transition-all ${
                    active
                      ? 'bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(248,249,251,.92)_100%)] text-foreground shadow-[0_6px_18px_rgba(15,23,42,.08)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/70'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex text-[11px] text-muted-foreground px-3 py-1.5 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,.9)_0%,rgba(244,245,247,.78)_100%)] shadow-[0_1px_0_rgba(255,255,255,.85)_inset]">
              Secure operations
            </span>
            <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-9 px-4 text-[13px] font-semibold bg-[linear-gradient(180deg,#3da2ff_0%,#0071e3_48%,#005ac1_100%)] text-white shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,113,227,.24)] hover:brightness-[1.03] transition-all no-underline">
              Request Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
