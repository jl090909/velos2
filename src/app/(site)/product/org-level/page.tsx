import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/SiteFooter';
import { VulnSnapshot } from '@/components/VulnSnapshot';
import { SiteRiskBars } from '@/components/SiteRiskBars';
import { ORG_FINDINGS, ORG_SEVERITY_COUNTS, SITE_RISK } from '@/lib/sample-data';

const tags = ['Org-level', 'Multi-site rollup', 'Consolidated posture', 'Role-based views'];

export default function OrgLevelPage() {
  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[560px] bg-cover bg-center"
            style={{ backgroundImage: 'url(/multirouter.jpg)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.22)_0%,rgba(0,0,0,.5)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[560px] flex-col justify-end p-8 md:p-12 text-white">
              <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">
                Product · Organisation level
              </p>
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                Velos Shield
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                The org-level cyber instance. It connects the Velos Shield appliance at every site and reports a
                consolidated vulnerability posture across the whole organisation.
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
          Org-level vulnerability snapshot
        </p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-10 text-[#003C64]">
          Findings from all sites, in one place.
        </h2>
        <div className="grid lg:grid-cols-2 gap-5 items-start">
          <Card className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]">
            <CardContent className="p-8 md:p-10">
              <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-2">
                All sites · 4 connected
              </p>
              <h3 className="text-2xl font-semibold tracking-[-.03em] text-[#003C64] mb-7">
                Vulnerability snapshot
              </h3>
              <VulnSnapshot counts={ORG_SEVERITY_COUNTS} rows={ORG_FINDINGS} />
            </CardContent>
          </Card>

          <Card className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]">
            <CardContent className="p-8 md:p-10">
              <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-2">
                Risk by site
              </p>
              <h3 className="text-2xl font-semibold tracking-[-.03em] text-[#003C64] mb-7">
                Site risk score (0–100)
              </h3>
              <SiteRiskBars sites={SITE_RISK} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <Card className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]">
          <CardContent className="p-9 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-[-.03em] text-[#003C64] mb-3">
                Deploy across your organisation.
              </h2>
              <p className="text-sm md:text-[14.25px] text-muted-foreground leading-relaxed">
                Start with one site and extend to the whole estate. The org instance consolidates every site appliance
                into one posture, with role-based views for security, operations and leadership.
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
