import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const pillars = [
  {
    title: 'Comprehensive visibility',
    desc: 'Discover OT assets, map traffic, and see the operational environment with the clarity teams expect from a modern security platform.',
  },
  {
    title: 'Zero downtime posture',
    desc: 'Passive-first deployment helps you improve security without interrupting production, safety systems, or remote operations.',
  },
  {
    title: 'AI-powered prioritization',
    desc: 'Turn noisy telemetry into clear actions by surfacing the exposures, anomalies, and dependencies that matter most.',
  },
  {
    title: 'Security operations ready',
    desc: 'Package findings into audit-ready evidence and workflows for security leaders, engineers, and executive stakeholders.',
  },
];

const highlights = [
  {
    label: 'Visibility',
    title: 'See the full OT estate.',
    body: 'Inspired by the visibility-first approach behind modern network security platforms, Veloshield turns fragmented industrial networks into one understandable view.',
  },
  {
    label: 'Protection',
    title: 'Protect critical operations.',
    body: 'Detect suspicious access, risky pathways, and high-impact assets before they become business interruptions.',
  },
  {
    label: 'Action',
    title: 'Move from alerts to outcomes.',
    body: 'Prioritize what matters, share evidence cleanly, and align IT, OT, and leadership around the same plan.',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative pt-44 pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.96),rgba(245,245,247,1)_45%,rgba(236,236,241,1)_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-80 bg-[radial-gradient(circle_at_20%_15%,rgba(0,113,227,.13),transparent_26%),radial-gradient(circle_at_80%_8%,rgba(175,189,224,.30),transparent_24%),radial-gradient(circle_at_50%_70%,rgba(255,255,255,.90),transparent_35%)]" />
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-primary mb-6">Veloshield</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-.05em] leading-[1.02] bg-gradient-to-b from-foreground to-foreground/45 bg-clip-text text-transparent mb-6">
            Total visibility.
            <br />
            Zero downtime.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            An Apple-clean experience for OT security — combining passive visibility, AI-driven prioritization, and executive-ready evidence for critical operations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/80 transition-colors no-underline">
              Request Demo
            </Link>
            <Link href="/product" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold border border-border bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(245,245,247,.95))] shadow-[0_1px_0_rgba(255,255,255,.8)_inset,0_4px_12px_rgba(15,23,42,.04)] hover:bg-white hover:text-foreground transition-colors no-underline">
              Explore Platform
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 justify-center text-xs text-muted-foreground">
            <span className="px-4 py-2 rounded-full border border-white/80 bg-white/80 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_4px_12px_rgba(15,23,42,.03)]">Comprehensive visibility</span>
            <span className="px-4 py-2 rounded-full border border-white/80 bg-white/80 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_4px_12px_rgba(15,23,42,.03)]">Zero trust posture</span>
            <span className="px-4 py-2 rounded-full border border-white/80 bg-white/80 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_4px_12px_rgba(15,23,42,.03)]">AI-powered operations</span>
            <span className="px-4 py-2 rounded-full border border-white/80 bg-white/80 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_4px_12px_rgba(15,23,42,.03)]">Audit-ready evidence</span>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-5">
          {[
            {
              title: 'OT command center',
              image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
              caption: 'A premium visual anchor for the platform story.',
            },
            {
              title: 'Operations and visibility',
              image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
              caption: 'Show the calm control-room feel that Apple-style pages use so well.',
            },
            {
              title: 'Trust and assurance',
              image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
              caption: 'A polished trust section with editorial spacing and clean typography.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[2rem] bg-white/70 shadow-[0_16px_40px_rgba(15,23,42,.08)] ring-1 ring-white/30 min-h-[330px]"
              style={{
                backgroundImage:
                  `url(${item.image}), linear-gradient(180deg, rgba(255,255,255,.08) 0%, rgba(0,0,0,.14) 100%)`,
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.02)_0%,rgba(0,0,0,.36)_100%)]" />
              <div className="relative flex h-full min-h-[330px] flex-col justify-end p-8 text-white">
                <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-white/85 mb-2">Visual story</p>
                <h2 className="text-2xl font-semibold tracking-[-.04em] mb-2">{item.title}</h2>
                <p className="max-w-sm text-sm leading-relaxed text-white/85">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-5">
          {highlights.map((item) => (
            <Card key={item.title} className="border-border/70 shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300">
              <CardContent className="p-8 md:p-10">
                <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">{item.label}</p>
                <h2 className="text-2xl font-semibold tracking-[-.03em] mb-3">{item.title}</h2>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-lg">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">Platform pillars</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-.04em]">Built for industrial security teams who need clarity.</h2>
          </div>
          <p className="hidden md:block max-w-xl text-muted-foreground text-sm leading-relaxed">
            The language mirrors the calm, premium feel of Apple product pages while leaning on the same modern themes used by leading security vendors: visibility, AI, prevention, and evidence.
          </p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {pillars.map((p) => (
            <Card key={p.title} className="border-border/70 shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300">
              <CardContent className="p-7">
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[.18em] uppercase text-primary mb-3">Inspired by modern security platforms</p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-5">
              One platform for OT visibility, security operations, and trust.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Public messaging from Palo Alto Networks emphasizes unified visibility, AI-driven operations, and OT security without downtime. Veloshield carries that same clarity into industrial environments with a more refined Apple-style presentation.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_8px_24px_rgba(15,23,42,.05)]">
                <div className="text-xs font-semibold uppercase tracking-[.16em] text-primary mb-2">Visibility</div>
                <div className="text-sm text-muted-foreground">Passive discovery, flow mapping, and device context across the OT estate.</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_8px_24px_rgba(15,23,42,.05)]">
                <div className="text-xs font-semibold uppercase tracking-[.16em] text-primary mb-2">Operations</div>
                <div className="text-sm text-muted-foreground">Prioritized findings, workflows, and evidence for security and engineering teams.</div>
              </div>
            </div>
          </div>

          <Card className="border-border/70 shadow-[0_20px_60px_rgba(15,23,42,.08)]">
            <CardContent className="p-8 md:p-10">
              <div className="rounded-[1.75rem] border border-border/60 bg-[linear-gradient(180deg,#ffffff,#f7f7f9)] p-6 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-primary">Platform view</p>
                    <h3 className="text-xl font-semibold tracking-[-.03em] mt-1">Operational confidence</h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground px-3 py-1 rounded-full border border-border/60 bg-white">Live</span>
                </div>
                <div className="space-y-3">
                  {['OT assets discovered', 'Risks prioritized', 'Remote access reviewed', 'Evidence ready for leadership'].map((row, idx) => (
                    <div key={row} className="flex items-center justify-between rounded-2xl border border-border/50 bg-white px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
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

      <footer className="py-12 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-xs text-muted-foreground gap-4 flex-wrap">
          <span>© 2026 Veloshield. Secure Operations. Intelligent Decisions.</span>
          <div className="flex gap-5 flex-wrap">
            <Link href="/product" className="hover:text-foreground no-underline">Product</Link>
            <Link href="/industries" className="hover:text-foreground no-underline">Industries</Link>
            <Link href="/trust" className="hover:text-foreground no-underline">Trust</Link>
            <Link href="/demo" className="hover:text-foreground no-underline">Demo</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
