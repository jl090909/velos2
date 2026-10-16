import type { Metadata } from 'next'

import { Card, CardContent } from '@/components/ui/card'
import { SiteFooter } from '@/components/SiteFooter'
import { getCustomers } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  description: 'Where Velos Shield is deployed: sectors, regions and the outcomes that mattered.',
  title: 'Customers - Velos Shield',
}

export default async function CustomersPage() {
  const { data: customers, error } = await getCustomers()
  const withLogo = customers.filter((customer) => customer.logo)

  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Customers</p>
        <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl text-[#003C64]">
          Trusted where uptime matters.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Deployments across manufacturing, energy, transport and critical infrastructure - described in the terms
          operations cares about: visibility, consequence, and continuity.
        </p>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-6">
        {customers.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-5">
            {customers.map((customer) => (
              <Card
                key={customer.id}
                className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300"
              >
                <CardContent className="p-8 md:p-9 flex flex-col h-full">
                  <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#FF612A] mb-4">
                    {customer.featured ? 'Featured' : 'Case study'} - {customer.sector}
                    {customer.region ? ` - ${customer.region}` : ''}
                  </p>
                  <h2 className="text-xl font-semibold tracking-[-.03em] text-[#003C64] mb-3">{customer.name}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{customer.summary}</p>
                  {customer.quote ? (
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      &ldquo;{customer.quote}&rdquo;
                      {customer.quoteAuthor || customer.quoteRole ? (
                        <span className="block not-italic mt-2 text-xs">
                          {customer.quoteAuthor}
                          {customer.quoteAuthor && customer.quoteRole ? ', ' : ''}
                          {customer.quoteRole}
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                  {customer.websiteUrl ? (
                    <a
                      href={customer.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto pt-6 text-sm font-medium text-[#003C64] no-underline hover:text-[#FF612A] transition-colors"
                    >
                      Read more
                    </a>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/70">
            <CardContent className="p-8 md:p-10">
              <p className="text-[#003C64] font-medium">Customer stories are being prepared.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error
                  ? 'The customer feed is temporarily unavailable. Please try again shortly.'
                  : 'Approved customer stories and reference marks will appear here as they are cleared for publication.'}
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {withLogo.length > 0 ? (
        <section className="py-12 max-w-6xl mx-auto px-6">
          <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-8">Deployed at</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {withLogo.map((customer) => (
              <div
                key={`logo-${customer.id}`}
                className="flex h-24 items-center justify-center rounded-[1.35rem] border border-border/60 bg-white/70 p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={customer.logo?.alt || customer.name}
                  className="max-h-14 w-auto object-contain"
                  src={customer.logo?.url}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </>
  )
}
