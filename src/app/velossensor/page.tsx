import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  {
    num: '01',
    title: 'Where it sits',
    lead: 'SPAN / TAP near operational zones.',
    desc: 'Deployed out-of-band at the network edge, the sensor observes safely without touching production traffic or control loops — no active scanning, no disruption.',
    stat1: 'Out-of-band',
    stat1d: 'zero production impact',
    stat2: 'Edge-placed',
    stat2d: 'near operational zones',
  },
  {
    num: '02',
    title: 'What it learns',
    lead: 'Assets, protocols, dependencies and baselines.',
    desc: 'Passive discovery builds a living map of every device on the network, how it communicates, and what normal behavior looks like over time.',
    stat1: 'Discovery',
    stat1d: 'assets & protocols',
    stat2: 'Baselines',
    stat2d: 'normal behavior modeled',
  },
  {
    num: '03',
    title: 'What it detects',
    lead: 'Threats, exposures and operational anomalies.',
    desc: 'The sensor surfaces unsafe access, risky pathways, and deviations from baseline — before they become incidents or unplanned downtime.',
    stat1: 'Detection',
    stat1d: 'threats & exposures',
    stat2: 'Anomalies',
    stat2d: 'operational deviations',
  },
  {
    num: '04',
    title: 'Who uses it',
    lead: 'Security, OT, engineering and leadership teams.',
    desc: 'Role-based views give every team the right signal, evidence, and next step — from SOC triage to plant action to board-ready reporting.',
    stat1: 'Security',
    stat1d: 'triage & response',
    stat2: 'Leadership',
    stat2d: 'resilience & evidence',
  },
];

const steps = [
  {
    title: 'Observe safely',
    desc: 'Passive, out-of-band visibility that never interrupts production, safety systems, or remote operations.',
  },
  {
    title: 'Contextualize deeply',
    desc: 'Assets, dependencies, and baselines turn raw traffic into a clear picture of what matters.',
  },
  {
    title: 'Act confidently',
    desc: 'Prioritized findings and evidence route the right action to the right team, fast.',
  },
];

export default function VelosSensorPage() {
  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <Card className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[560px] bg-cover bg-center"
            style={{ backgroundImage: 'url(/velosrouter2.jpg)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.22)_0%,rgba(0,0,0,.52)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[560px] flex-col justify-end p-8 md:p-12 text-white">
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                Observe safely. Contextualize deeply. Act confidently.
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                Velos Sensor is practical, deployment-aware, and OT-safe. The focus is not just alerts — the focus is visibility, context, and action.
              </p>
              <div>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold bg-[linear-gradient(180deg,#3da2ff_0%,#0071e3_48%,#005ac1_100%)] text-white shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,113,227,.3)] hover:brightness-[1.03] transition-all no-underline"
                >
                  Request a demo
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/70">
                {['Passive-first', 'Out-of-band', 'Asset discovery', 'Anomaly detection'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">The sensor, in four parts</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-10">
          One sensor. Four clear responsibilities.
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {sections.map((s) => (
            <Card
              key={s.num}
              className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300"
            >
              <CardContent className="p-9 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">{s.title}</p>
                    <h3 className="text-2xl font-semibold tracking-[-.03em] mb-2">{s.lead}</h3>
                  </div>
                </div>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-xl">{s.desc}</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-border/50">
                  <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                    <b className="text-lg font-semibold block mb-1">{s.stat1}</b>
                    <span className="text-xs text-muted-foreground">{s.stat1d}</span>
                  </div>
                  <div className="rounded-none border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                    <b className="text-lg font-semibold block mb-1">{s.stat2}</b>
                    <span className="text-xs text-muted-foreground">{s.stat2d}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-8">How it works</p>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <Card key={step.title} className="bg-white/88 shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300">
              <CardContent className="p-7">
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="py-12 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-xs text-muted-foreground gap-4 flex-wrap">
          <span>© 2026 Rathon.ai · Another product from Rathon.ai</span>
          <div className="flex gap-5 flex-wrap">
            <a href="/product" className="hover:text-foreground no-underline">Velos Shield</a>
            <a href="/velossensor" className="hover:text-foreground no-underline">Velos Sensor</a>
            <a href="/industries" className="hover:text-foreground no-underline">Industries</a>
            <a href="/trust" className="hover:text-foreground no-underline">Trust</a>
            <a href="/get-started" className="hover:text-foreground no-underline">Demo</a>
          </div>
        </div>
      </footer>
    </>
  );
}
