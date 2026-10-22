import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from "@/components/SiteFooter";

const outcomes = [
  { stat: 'Lower risk', detail: 'Fewer cyber-physical incidents, caught before impact.' },
  { stat: 'Less downtime', detail: 'Passive-first deployment protects uptime and safety.' },
  { stat: 'One platform', detail: 'Less tool sprawl, lower overhead, clearer ownership.' },
  { stat: 'Board-ready evidence', detail: 'Audit-ready reporting for risk, detection and remediation.' },
];

const roles = [
  {
    id: 'ciso',
    title: 'For the CISO',
    lead: 'Strengthen OT security with visibility, context, and control.',
    points: [
      'Discover and monitor every OT asset — PLCs, HMIs, SCADA, gateways',
      'Detect anomalies and potential threats before they become incidents',
      'Reduce the risk of cyber-physical incidents and safety impact',
      'Meet compliance and audit requirements with ready evidence',
    ],
    metric: 'IEC 62443 / NIST aligned',
  },
  {
    id: 'cio',
    title: 'For the CIO',
    lead: 'Extend the enterprise security estate into OT without disruption.',
    points: [
      'One platform that unifies OT visibility with existing IT security',
      'Integrates with your SIEM, SOAR and CMDB workflows',
      'Reduces tool sprawl and total cost of ownership',
      'Deploys out-of-band with zero impact on production systems',
    ],
    metric: 'SIEM / SOAR / CMDB ready',
  },
  {
    id: 'coo',
    title: 'For the COO',
    lead: 'Protect uptime, safety and business continuity.',
    points: [
      'Real-time visibility across every operational site',
      'Detect deviations before they interrupt service or production',
      'Reduce unplanned downtime and operational delays',
      'Improve decision-making with accurate, real-time insights',
    ],
    metric: 'Uptime-first, passive deployment',
  },
  {
    id: 'ceo',
    title: 'For the CEO',
    lead: 'Turn security into a business outcome the board understands.',
    points: [
      'Connect OT security to return on equity, resilience and risk posture',
      'Executive dashboards that translate risk into business impact',
      'Demonstrable reduction in operational and cyber risk',
      'A defensible security story for investors, regulators and customers',
    ],
    metric: 'Risk posture → boardroom language',
  },
];

const compliance = [
  'IEC 62443',
  'NIST CSF',
  'NIS2 Directive',
  'ISA/IEC 62443 zones & conduits',
  'CERT-In (India)',
  'NCSC CAF (UK)',
];

export default function ExecutivesPage() {
  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <Card className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[520px] bg-cover bg-center"
            style={{ backgroundImage: "url('/shutterstock/getstarted-hero.jpg')" }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.22)_0%,rgba(0,0,0,.56)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[520px] flex-col justify-end p-8 md:p-12 text-white">
              <p className="text-[10.45px] font-semibold tracking-[.18em] uppercase text-white/80 mb-4">For executives</p>
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                Security outcomes the board understands.
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                Velos Shield turns OT visibility into business value — lower risk, protected uptime, and board-ready evidence for executives across security, operations and the C-suite.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline">
                  Talk to us
                </Link>
                <a href="#roles" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold border border-white/30 bg-white/15 text-white shadow-[0_1px_0_rgba(255,255,255,.15)_inset] hover:bg-white/20 transition-colors no-underline backdrop-blur-sm">
                  See your role
                </a>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {outcomes.map((o) => (
            <Card key={o.stat} className="border-border/70 shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300">
              <CardContent className="p-7">
                <h3 className="text-2xl font-bold tracking-[-.03em] mb-2 text-[#003C64]">{o.stat}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{o.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="roles" className="py-16 max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">By role</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.04em] text-[#003C64]">The right outcome for every leader.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {roles.map((r) => (
            <Card key={r.id} className="border-border/70 shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300">
              <CardContent className="p-8 md:p-9">
                <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">{r.title}</p>
                <h3 className="text-title-xl font-semibold tracking-[-.02em] mb-3">{r.lead}</h3>
                <ul className="space-y-2.5 mb-6">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="text-[#FF612A] font-bold mt-0.5 shrink-0">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="inline-flex items-center rounded-full border border-border/60 bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                  {r.metric}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <Card className="border-border/70 shadow-[0_1px_3px_rgba(15,23,42,.04)]">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Compliance &amp; regulation</p>
                <h2 className="text-2xl md:text-4xl font-semibold tracking-[-.04em] text-[#003C64]">Aligned to the frameworks your auditors ask for.</h2>
              </div>
              <Link href="/trust" className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[13.3px] font-semibold bg-[linear-gradient(180deg,rgba(255,255,255,.96)_0%,rgba(242,243,246,.88)_100%)] text-foreground ring-1 ring-white/80 shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_10px_24px_rgba(15,23,42,.05)] hover:brightness-[1.02] transition-all no-underline">
                View trust center
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {compliance.map((c) => (
                <span key={c} className="px-4 py-2 rounded-full border border-border/60 bg-white text-sm text-foreground shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                  {c}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-center">
          <div>
            <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Why Velos Shield</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-5 text-[#003C64]">
              Passive-first security that never puts production at risk.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
              Unlike heavy appliance platforms, Velos Shield deploys out-of-band — a sensor at the edge and a centralised server — so you gain full OT visibility without active scanning, without touching production traffic, and without downtime.
            </p>
            <Link href="/velossensor" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline">
              See the sensor
            </Link>
          </div>
          <Card className="overflow-hidden border-border/70 shadow-[0_20px_60px_rgba(15,23,42,.08)]">
            <div
              className="relative h-72 bg-cover bg-center"
              style={{ backgroundImage: "url('/shutterstock/hero-ot.jpg')" }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.1)_0%,rgba(0,0,0,.35)_100%)]" />
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Edge-placed sensor + centralised server: full OT estate visibility with zero production impact.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Next step</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.04em] mb-5 text-[#003C64]">Start the conversation with a walkthrough.</h2>
          <p className="text-muted-foreground mb-8">A guided walkthrough, a site visit, or a POC scoped to your operational goals.</p>
          <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline">
            Request a demo
          </Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
