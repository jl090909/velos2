'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type StorySide = 'left' | 'right';

type StoryCard = {
  num: string;
  title: string;
  desc: string;
};

const visualCards = [
  {
    side: 'left' as StorySide,
    title: 'OT Guard',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    caption: 'Real Time IDS embedded with industry-leading SAW and help automate SOAR.',
  },
  {
    side: 'right' as StorySide,
    title: 'VIShield',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    caption: 'An industrial shield to get more from your assets.',
  },
];

const stories: Record<StorySide, StoryCard[]> = {
  left: [
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
  ],
  right: [
    {
      num: '01',
      title: 'For the CISO: NIDS',
      desc: 'Strengthen network defenses with passive monitoring, threat detection, and traffic visibility.\n☑ Inspect all unencrypted traffic\n☑ Detect anomalies, intrusions early\n☑ Reduce risk of undetected\n☑ Meet continuous monitoring\n☑ Protect critical infrastructure,',
    },
    {
      num: '02',
      title: 'For the CISO: SAW',
      desc: 'Strengthen enterprise resilience with identity isolation, zero trust, and privileged protection.\n☑ Isolate credentials from high-risk traffic\n☑ Eliminate credential harvesters\n☑ Reduce risk admin leaks\n☑ Strict privileged management (PAM)\n☑ Protect infrastructure, identity and control',
    },
    {
      num: '03',
      title: 'For the CISO: SOAR',
      desc: 'Strengthen SOC efficiency with automated playbooks, orchestration, and rapid response.\n☑ Connect different security tools\n☑ Threat containment and lower MTTR\n☑ Reduce overhead and analyst burnout\n☑ Audit and compliant',
    },
  ],
};

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

export default function ProductPage() {
  const [selected, setSelected] = useState<StorySide>('left');
  const cards = stories[selected];

  return (
    <>
      <section className="pt-40 pb-16 text-center bg-gradient-to-b from-white to-background">
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-primary mb-5">Product</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-[-.05em] leading-[1.04] bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent mb-5">
          Built like a platform.
          <br />
          Designed like Apple.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Veloshield combines OT visibility, AI-powered prioritization, and operational evidence into a single premium experience for industrial security teams.
        </p>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-5">
          {visualCards.map((item) => {
            const active = selected === item.side;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setSelected(item.side)}
                className={`relative overflow-hidden bg-white/70 shadow-[0_16px_40px_rgba(15,23,42,.08)] min-h-[300px] text-left transition-all duration-300 focus:outline-none ${
                  active ? 'ring-2 ring-primary/35 scale-[1.01]' : 'ring-1 ring-white/30'
                }`}
                style={{
                  backgroundImage:
                    `url(${item.image}), linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(0,0,0,.18) 100%)`,
                  backgroundSize: 'cover, cover',
                  backgroundPosition: 'center, center',
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.02)_0%,rgba(0,0,0,.38)_100%)]" />
                <div className="relative flex h-full min-h-[300px] flex-col justify-end p-8 text-white">
                  <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-white/85 mb-2" aria-hidden="true">&nbsp;</p>
                  <h2 className="text-2xl font-semibold tracking-[-.04em] mb-2">{item.title}</h2>
                  <p className="max-w-sm text-sm leading-relaxed text-white/85">{item.caption}</p>
                  <span className="mt-5 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-[.12em] uppercase text-white/90 backdrop-blur-sm">
                    {active ? 'Selected' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">
              {selected === 'left' ? 'OT Guard' : 'VIShield'}
            </p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03]">
              {selected === 'left' ? 'OT Guard' : 'VIShield'}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c) => (
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
                <span className="absolute top-3 right-5 text-7xl font-black text-muted/10 leading-none select-none">{c.num}</span>
                <h3 className="text-xl font-semibold mb-2 relative z-10">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10 whitespace-pre-line">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_.95fr] gap-8 items-start">
          <div>
            <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">How We Protect You</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-5">
              How We Protect You
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              A premium OT security experience that combines visibility, prevention, and operational evidence in one clean interface.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'OT Guard',
                  body: 'An industrial shield to get more from your assets by combining passive visibility, AI context, and actionable OT intelligence.',
                },
                {
                  title: 'VIShield',
                  body: 'A cleaner path from telemetry to action, so teams can respond faster and document the outcome with less friction.',
                },
                {
                  title: 'Zero-trust access',
                  body: 'A practical posture for remote users and third parties without losing the operational clarity OT teams need.',
                },
                {
                  title: 'Trust and evidence',
                  body: 'Built for procurement, audit, and leadership with a presentation style that feels like a premium product, not a tool dump.',
                },
              ].map((band) => (
                <div key={band.title} className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_8px_24px_rgba(15,23,42,.05)]">
                  <div className="text-xs font-semibold uppercase tracking-[.16em] text-primary mb-2">{band.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{band.body}</div>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-white/88 shadow-[0_20px_60px_rgba(15,23,42,.08)]">
            <CardContent className="p-8 md:p-10">
              <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,#ffffff,#f7f7f9)] p-6 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-primary">Operational view</p>
                    <h3 className="text-xl font-semibold tracking-[-.03em] mt-1">Clear signals for every team</h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground px-3 py-1 rounded-full bg-white/85">Live</span>
                </div>
                <div className="space-y-3">
                  {['Assets discovered', 'Risks prioritized', 'Access reviewed', 'Evidence ready'].map((row, idx) => (
                    <div key={row} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                      <span className="text-sm text-foreground">{row}</span>
                      <span className="text-sm font-semibold text-primary">0{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-6">
        <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-8">Capabilities</p>
        <div className="grid md:grid-cols-4 gap-4">
          {capabilities.map((c) => (
            <Card key={c.title} className="bg-white/88 shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-[15px] font-semibold mb-1.5">{c.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
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
