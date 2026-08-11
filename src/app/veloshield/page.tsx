import { Card, CardContent } from '@/components/ui/card';

const modules = [
  {
    num: '01',
    title: 'OT Sensor',
    lead: 'Passive-first network visibility and telemetry collection.',
    desc: 'Deploy the sensor appliance to discover OT assets, map traffic patterns, and collect telemetry without active scanning or production risk.',
    stat1: 'Passive',
    stat1d: 'zero impact on ops',
    stat2: 'Discovery',
    stat2d: 'full OT asset map',
  },
  {
    num: '02',
    title: 'Cyber Defense',
    lead: 'Threat detection, exposure prioritization and compliance evidence.',
    desc: 'Surface unsafe access, suspicious communication, and protocol anomalies. Prioritize what matters most and produce audit-ready compliance evidence.',
    stat1: 'Detection',
    stat1d: 'threat & anomaly alerts',
    stat2: 'Compliance',
    stat2d: 'IEC 62443 / NIST ready',
  },
  {
    num: '03',
    title: 'AI Intelligence',
    lead: 'Anomaly explanation, operational impact and role-specific recommendations.',
    desc: 'Turn raw telemetry into clear, contextual insights. Baseline normal behavior, explain deviations, and deliver role-specific intelligence for every stakeholder.',
    stat1: 'Context',
    stat1d: 'anomaly explanation',
    stat2: 'Roles',
    stat2d: 'CISO / COO / Plant views',
  },
  {
    num: '04',
    title: 'Executive Insights',
    lead: 'Resilience, business risk and board-ready reporting.',
    desc: 'Package findings into clear dashboards and reports for leadership. Connect OT security to business outcomes: uptime, resilience, risk posture, and ROE.',
    stat1: 'Resilience',
    stat1d: 'business risk posture',
    stat2: 'Board',
    stat2d: 'executive-ready reports',
  },
];

export default function VeloshieldPage() {
  return (
    <>
      <section className="pt-40 pb-16 text-center bg-gradient-to-b from-white to-background">
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-primary mb-5">Veloshield</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-[-.05em] leading-[1.04] bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent mb-5">
          Veloshield Platform
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A modular OT intelligence platform: sensor appliance, asset graph, cyber defense, AI intelligence and executive insights.
        </p>
      </section>

      <section className="py-8 max-w-6xl mx-auto px-6">
        <Card className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] bg-cover bg-center"
            style={{
              backgroundImage: 'url(/veloshield-hero.png)',
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.15)_0%,rgba(255,255,255,.05)_40%,rgba(0,0,0,.25)_100%)]" />
          </div>
        </Card>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-5">
          {modules.map((m) => (
            <Card key={m.num} className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300">
              <CardContent className="p-9 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">Module</p>
                    <h2 className="text-2xl font-semibold tracking-[-.03em] mb-2">{m.title}</h2>
                    <p className="text-sm font-medium text-foreground/80">{m.lead}</p>
                  </div>
                  <span className="text-4xl font-black text-muted/20 leading-none select-none">{m.num}</span>
                </div>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-xl">{m.desc}</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-border/50">
                  <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                    <b className="text-lg font-semibold block mb-1">{m.stat1}</b>
                    <span className="text-xs text-muted-foreground">{m.stat1d}</span>
                  </div>
                  <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                    <b className="text-lg font-semibold block mb-1">{m.stat2}</b>
                    <span className="text-xs text-muted-foreground">{m.stat2d}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_.9fr] gap-8 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">Platform story</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-5">
              One platform. Four modules. Infinite operational clarity.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Veloshield is a modular OT intelligence platform built for industrial environments. From passive sensor discovery to board-ready executive insights, each module works standalone or together to give teams the right information at the right time.
            </p>
          </div>
          <Card className="border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_20px_60px_rgba(15,23,42,.08)]">
            <CardContent className="p-8 md:p-10">
              <div className="rounded-none border border-border/60 bg-[linear-gradient(180deg,#ffffff,#f7f7f9)] p-6 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-primary mb-3">What you get</p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Passive OT asset discovery and mapping</li>
                  <li>• Threat detection and exposure prioritization</li>
                  <li>• AI-powered anomaly intelligence</li>
                  <li>• Executive dashboards and board-ready reporting</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-12 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-xs text-muted-foreground gap-4 flex-wrap">
          <span>© 2026 Veloshield</span>
          <div className="flex gap-5 flex-wrap">
            <a href="/product" className="hover:text-foreground no-underline">Product</a>
            <a href="/industries" className="hover:text-foreground no-underline">Industries</a>
            <a href="/trust" className="hover:text-foreground no-underline">Trust</a>
            <a href="/demo" className="hover:text-foreground no-underline">Demo</a>
          </div>
        </div>
      </footer>
    </>
  );
}
