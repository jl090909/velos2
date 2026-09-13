import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { DotGrid, Gear, RadarRing, Wordmark } from '@/components/decor';
import { OtsCardAction } from '@/components/OtsCardAction';
import { GisecModal } from "@/components/GisecModal";
import { GisecTicker } from "@/components/GisecTicker";

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

export default function HomePage() {
  return (
    <>
      <GisecModal />
      <GisecTicker />
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[560px] bg-cover bg-center"
            style={{
              backgroundImage:
                'url(/shutterstock/hero-ot.jpg)',
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,rgba(0,0,0,.52)_100%)]" />
            <RadarRing className="absolute -right-16 -top-16 h-[440px] w-[440px] md:h-[600px] md:w-[600px]" />
            <CardContent className="relative flex min-h-[380px] md:h-[560px] flex-col justify-end p-8 md:p-12 text-white">
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                Total visibility.
                <br />
                Zero downtime.
              </h1>
              <div className="inline-block bg-white/15 backdrop-blur-md pl-12 pr-8 py-6 mb-8 -ml-4 max-w-[80%]" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 90%, transparent 100%)' }}>
              <p className="text-base md:text-xl text-white">
                AI-powered OT security delivering continuous passive visibility, intelligent risk prioritization, and decision-ready insights for security teams and executives.
              </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/product" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold border border-white/30 bg-white/15 text-white shadow-[0_1px_0_rgba(255,255,255,.15)_inset] hover:bg-white/20 transition-colors no-underline backdrop-blur-sm">
                  Explore Platform
                </Link>
                <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline">
                  Request Demo
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-white/70">
                {['Comprehensive visibility', 'Real time threat detection', 'AI-powered operations', 'Audit-ready evidence'].map((tag) => (
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
        <div className="max-w-3xl mb-8">
          <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Business decisions</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] text-[#003C64]">
            How Velos Shield helps your business
          </h2>
        </div>
        <div className="relative overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div className="relative w-full" style={{ aspectRatio: '1600 / 687' }}>
            <Image
              src="/Group7.png"
              alt="Velos Shield for business"
              fill
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-8 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { img: '/upscale_image_01botomL.webp', ratio: '1200 / 987', label: 'VS Foundation', title: 'See the full OT estate.', body: 'Velos Shield starts with a complete, passive view of your OT estate — discovering assets, mapping traffic, and turning fragmented industrial networks into one clear, auditable picture.' },
            { img: '/upscale_image_01botomM.webp', ratio: '1200 / 837', label: 'VS Operational Intelligence', title: 'Protect critical operations.', body: 'Turn live operational data into protective action. Detect suspicious access, risky pathways, and high-impact assets before they become business interruptions.' },
            { img: '/upscale_image_01botomR.webp', ratio: '1200 / 800', label: 'VS Industrial Intelligence', title: 'Move from alerts to outcomes.', body: 'Prioritize what matters and act with confidence. Surface the exposures that count, share evidence cleanly, and align IT, OT, and leadership around one operational plan.' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col overflow-hidden rounded-[1.35rem] bg-white shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300">
              <div className="relative w-full h-[260px] overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.label}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
              </div>
              <div className="p-8 md:p-10">
                <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">{item.label}</p>
                <h2 className="text-2xl font-semibold tracking-[-.03em] text-[#003C64] mb-3">{item.title}</h2>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-lg">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24 max-w-6xl mx-auto px-6">
        <Wordmark text="VELOS SHIELD" />
        <DotGrid className="right-6 top-8 h-28 w-28" />
        <DotGrid className="left-6 bottom-8 h-28 w-28" />
        <div className="relative flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Platform pillars</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-.04em] text-[#003C64]">Built for industrial security teams who need clarity.</h2>
          </div>
          <p className="hidden md:block max-w-xl text-muted-foreground text-sm leading-relaxed">
            Get continuous OT visibility, understand real risk, and focus your team on the threats and vulnerabilities that could impact critical operations.
          </p>
        </div>
        <div className="relative grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {pillars.map((p) => (
            <Card key={p.title} className="border-border/70 shadow-[0_1px_3px_rgba(15,23,42,.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)] transition-all duration-300">
              <CardContent className="p-7">
                <h3 className="text-lg font-semibold mb-2 text-[#003C64]">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24 max-w-6xl mx-auto px-6">
        <Gear className="absolute right-10 top-14 h-16 w-16 opacity-25" />
        <DotGrid className="left-6 bottom-10 h-24 w-24" />
        <div className="relative max-w-6xl mx-auto px-6">
                  <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Inspired by modern security platforms</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-.05em] leading-[1.03] mb-5 text-[#003C64]">
            One platform for OT visibility, security operations, and trust.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Bring asset visibility, vulnerability management, threat detection, risk prioritization, security operations, and compliance evidence together on a single OT security platform. Reduce tool sprawl, simplify operations, and continuously understand and improve your OT security posture.
          </p>
          <OtsCardAction />
        </div>
      </section>

      <footer className="py-12 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-base text-muted-foreground gap-4 flex-wrap">
            <Link href="https://rathon.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground no-underline">© 2026 Rathon.ai</Link>
          <div className="flex gap-5 flex-wrap">
            <Link href="/product" className="hover:text-foreground no-underline">Velos Shield</Link>
            <Link href="/velossensor" className="hover:text-foreground no-underline">Velos Sensor</Link>
            <Link href="/industries" className="hover:text-foreground no-underline">Industries</Link>
            <Link href="/trust" className="hover:text-foreground no-underline">Trust</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
