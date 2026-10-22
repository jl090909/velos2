import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from "@/components/SiteFooter";

const storyCards = [
  {
    num: '01',
    title: 'For the CISO',
    desc: 'Strengthen OT security with visibility, context, and control.\n☑ Discover and monitor all OT assets\n☑ Detect anomalies and potential threats early\n☑ Reduce risk of cyber-physical incidents\n☑ Meet compliance and audit requirements\n☑ Protect safety, reputation, and brand trust',
  },
  {
    num: '02',
    title: 'For the COO',
    desc: 'Ensure operational reliability and business continuity.\n☑ Real-time visibility across all operations\n☑ Detect deviations before they impact service\n☑ Optimize performance and resource utilization\n☑ Reduce unplanned downtime and delays\n☑ Improve decision-making with accurate insights',
  },
  {
    num: '03',
    title: 'For the Plant',
    desc: 'Keep systems running safely, efficiently, and without interruption.\n☑ Monitor critical systems and equipment\n☑ Get early alerts on abnormal conditions\n☑ Reduce troubleshooting time\n☑ Improve maintenance with better visibility\n☑ Ensure safety for people and assets',
  },
];

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

const capabilities = [
  { title: 'Asset Discovery', desc: 'Identify PLCs, HMIs, SCADA nodes, gateways, sensors, and industrial network devices.' },
  { title: 'Dependency Mapping', desc: 'Map communication paths, zones, asset relationships, and operational dependencies.' },
  { title: 'Threat Detection', desc: 'Surface unsafe access, suspicious communication, and protocol anomalies.' },
  { title: 'Anomaly Intelligence', desc: 'Baseline normal behavior and explain deviations in cyber and operational context.' },
  { title: 'Exposure Prioritization', desc: 'Prioritize unsupported assets, risky connectivity, and high-value targets.' },
  { title: 'Compliance Evidence', desc: 'Produce audit-ready evidence for inventory, risk, detections, and remediation.' },
  { title: 'Role-Based Views', desc: 'Support CISO, SOC, engineering, plant, and executive stakeholders.' },
  { title: 'Integrations', desc: 'Export to SIEM, SOAR, CMDB, and reporting workflows.' },
];

export default function VelosShieldPage() {
  return (
    <>
      <section className="pt-20 pb-8 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[560px] bg-cover bg-center"
            style={{ backgroundImage: 'url(/multirouterslantedwider.jpg)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.22)_0%,rgba(0,0,0,.5)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[560px] flex-col justify-end p-8 md:p-12 text-white">
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                An industrial shield to get more from your assets.
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                Velos Shield unifies visibility, intelligence, and security operations across the OT environment, helping industrial teams understand risk, prioritize what matters, and act with confidence.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/70">
                {['Passive discovery', 'Threat detection', 'Risk prioritization', 'Compliance evidence'].map((tag) => (
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
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Built for every role</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-10 text-[#003C64]">
          The right view for every stakeholder.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {storyCards.map((c) => (
            <Card
              key={c.num}
              className={
                `relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] shadow-[0_1px_3px_rgba(15,23,42,.04)] ` +
                (c.num === '01'
                  ? 'bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(246,249,255,.94)_48%,rgba(240,245,255,.88)_100%)] ring-1 ring-white/70'
                  : c.num === '02'
                    ? 'bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.94)_48%,rgba(242,243,246,.9)_100%)] ring-1 ring-white/70'
                    : 'bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(248,245,242,.94)_48%,rgba(244,240,236,.9)_100%)] ring-1 ring-white/70')
              }
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.75),transparent_58%)] pointer-events-none" />
              <CardContent className="relative p-8 md:p-10">
                <h3 className="text-title-xl font-semibold mb-2 relative z-10">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10 whitespace-pre-line">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Platform modules</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-10 text-[#003C64]">
          One platform. Four modules. Infinite operational clarity.
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {modules.map((m) => (
            <Card key={m.num} className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300">
              <CardContent className="p-9 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Module</p>
                    <h3 className="text-2xl font-semibold tracking-[-.03em] text-[#003C64] mb-2">{m.title}</h3>
                    <p className="text-sm font-medium text-foreground/80">{m.lead}</p>
                  </div>
                </div>
                <p className="text-sm md:text-[14.25px] text-muted-foreground leading-relaxed mb-8 max-w-xl">{m.desc}</p>
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

      <section className="py-16 max-w-6xl mx-auto px-6">
        <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-8">Capabilities</p>
        <div className="grid md:grid-cols-4 gap-4">
          {capabilities.map((c) => (
            <Card key={c.title} className="bg-white/88 shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-[14.25px] font-semibold mb-1.5 text-[#003C64]">{c.title}</h3>
                <p className="text-[12.35px] text-muted-foreground leading-relaxed">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <Card className="border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_1px_3px_rgba(15,23,42,.04)]">
          <CardContent className="p-9 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[12.35px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Deployment tiers</p>
              <h3 className="text-2xl font-semibold tracking-[-.03em] text-[#003C64] mb-3">
                Site level or organisation level.
              </h3>
              <p className="text-sm md:text-[14.25px] text-muted-foreground leading-relaxed">
                Velos Shield 1.1 protects a single site. Velos Shield 1.5 connects every site into one consolidated
                vulnerability posture for the whole organisation.
              </p>
            </div>
            <Link
              href="/product/org-level"
              className="inline-flex shrink-0 items-center justify-center rounded-full h-12 px-8 text-[14.25px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
            >
              Explore 1.5 · Org-level
            </Link>
          </CardContent>
        </Card>
      </section>

      <SiteFooter />
    </>
  );
}
