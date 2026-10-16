'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { normalizePath } from '@/lib/utils';

const tabs = [
  { href: '/company/about', label: 'About' },
  { href: '/company/events', label: 'Events' },
  { href: '/company/media', label: 'Media' },
  { href: '/company/careers', label: 'Careers' },
  { href: '/company/contact', label: 'Contact' },
];

export function CompanyTabs() {
  const pathname = normalizePath(usePathname());

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium no-underline transition-all ${
              active
                ? 'bg-[linear-gradient(180deg,#003C64_0%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_10px_25px_rgba(0,60,100,.20)]'
                : 'border border-border/70 text-muted-foreground hover:text-[#003C64] hover:border-[#003C64]/40'
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
