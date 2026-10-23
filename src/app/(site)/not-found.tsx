import Link from 'next/link'
import type { Metadata } from 'next'

import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Page not found - Velos Shield',
  // A 404 must never be indexed, and must never claim to be canonical content.
  robots: { index: false, follow: false },
}

/**
 * Branded 404. The Next.js default ("404 | This page could not be found.") ships no chrome, no
 * branding and no way back, so a visitor following a stale link is simply stranded.
 */
export default function NotFound() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">
          404
        </p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          That page has moved or never existed.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          The link may be out of date. These are the ways most visitors get where they were going.
        </p>
      </section>

      <section className="pb-20 max-w-6xl mx-auto px-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            { href: '/product/', label: 'Platform', note: 'What Velos Shield does' },
            { href: '/resources/', label: 'Resources', note: 'Papers and case studies' },
            { href: '/customers/', label: 'Customers', note: 'Where it is deployed' },
            { href: '/demo/', label: 'Request a demo', note: 'Talk to the team' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-[1.35rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] p-6 no-underline shadow-[0_1px_3px_rgba(15,23,42,.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)]"
            >
              <p className="text-title-md font-semibold tracking-[-.03em] text-[#003C64] transition-colors group-hover:text-[#FF612A]">
                {link.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{link.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
