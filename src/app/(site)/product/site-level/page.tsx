import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteTopology } from '@/components/SiteTopology';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

import { VulnSnapshot } from '@/components/VulnSnapshot';
import {
  SITE_DEVICE_GROUPS,
  SITE_FINDINGS,
  SITE_NETWORK_LABEL,
  SITE_SCOPE_LABEL,
  SITE_SEVERITY_COUNTS,
} from '@/lib/sample-data';

export const metadata: Metadata = pageMetadata({
  path: '/product/site-level/',
  title: 'Site-Level Protection - Velos Shield',
  description: 'Site-level OT monitoring that observes safely and acts with context.',
});

const tags = ['Site level', 'Appliance', 'Passive sensors', 'Vulnerability assessment'];

export default function SiteLevelPage() {
  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[560px] bg-cover bg-center"
            style={{ backgroundImage: 'url(/velosrouter.png)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.22)_0%,rgba(0,0,0,.5)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[560px] flex-col justify-end p-8 md:p-12 text-white">
              <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">
                Product · Site level
              </p>
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                Velos Shield at site level
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                The Velos Shield appliance deployed at a site. It talks to sensors across your IT and OT network and
                collects the data needed for continuous vulnerability assessment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
                >
                  Request a demo
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold border border-white/30 bg-white/15 text-white shadow-[0_1px_0_rgba(255,255,255,.15)_inset] hover:bg-white/20 transition-colors no-underline backdrop-blur-sm"
                >
                  Explore the platform
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/70">
                {tags.map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">
          How the site view works
        </p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-10 text-[#003C64]">
          Sensors in. Assessment out.
        </h2>
        <SiteTopology networkLabel={SITE_NETWORK_LABEL} deviceGroups={SITE_DEVICE_GROUPS} />
        <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Sensors observe the plant network passively and report to the Velos Shield appliance, which collects the
          data needed for vulnerability assessment at the site. An optional uplink rolls that site into the org
          instance for organisation-level reporting.
        </p>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">
          Site vulnerability snapshot
        </p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-10 text-[#003C64]">
          Every finding at the site, prioritised.
        </h2>
        <Card className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]">
          <CardContent className="p-8 md:p-10">
            <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-2">
              {SITE_SCOPE_LABEL}
            </p>
            <h3 className="text-2xl font-semibold tracking-[-.03em] text-[#003C64] mb-7">Vulnerability snapshot</h3>
            <VulnSnapshot counts={SITE_SEVERITY_COUNTS} rows={SITE_FINDINGS} showSite={false} />
          </CardContent>
        </Card>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <Card className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]">
          <CardContent className="p-9 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-[-.03em] text-[#003C64] mb-3">
                Protect your site.
              </h2>
              <p className="text-sm md:text-[14.25px] text-muted-foreground leading-relaxed">
                Start at a single plant and see the full asset estate, the exposures that matter, and the evidence your
                teams need to act — without touching production.
              </p>
            </div>
            <Link
              href="/demo"
              className="inline-flex shrink-0 items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
            >
              Request a demo
            </Link>
          </CardContent>
        </Card>
      </section>

      <SiteFooter />
    </>
  );
}
