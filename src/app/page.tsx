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
      <section className="py-10 max-w-6xl mx-auto px-6 pt-32">
        <Card className="overflow-hidden border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.95)_100%)] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[420px] md:min-h-[480px] bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Data_Center_3_%28UNC%29.jpg/1920px-Data_Center_3_%28UNC%29.jpg)',
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,rgba(0,0,0,.52)_100%)]" />
            <CardContent className="relative flex min-h-[420px] md:min-h-[480px] flex-col justify-end p-8 md:p-12 text-white">
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-white/80 mb-4">Veloshield</p>
              <h1 className="text-4xl md:text-7xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                Total visibility.
                <br />
                Zero downtime.
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                A modern professional experience for OT security — combining passive visibility, AI-driven prioritization, and executive-ready evidence for critical operations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold bg-white text-foreground shadow-md hover:brightness-[.97] transition-colors no-underline">
                  Request Demo
                </Link>
                <Link href="/product" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold border border-white/30 bg-white/15 text-white shadow-[0_1px_0_rgba(255,255,255,.15)_inset] hover:bg-white/20 transition-colors no-underline backdrop-blur-sm">
                  Explore Platform
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/70">
                {['Comprehensive visibility', 'Zero trust posture', 'AI-powered operations', 'Audit-ready evidence'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
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
