import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: 'Resources — Velos Shield POV Whitepaper Series',
  description: 'Point-of-view whitepapers, case studies, and brochures on OT cyber risk, operational context, and the future of OT monitoring.',
};

type Paper = {
  slug: string;
  kind: string;
  series: string;
  title: string;
  subtitle: string;
  desc: string;
  points: string[];
  readTime: string;
  file: string;
  direct?: boolean;
};

const papers: Paper[] = [
  {
    slug: 'airport-bms-cybersecurity-case-study',
    kind: 'Case Study',
    series: 'Airport Operations • Building Management Systems',
    title: 'Strengthening Cybersecurity of Airport Building Management Systems',
    subtitle: 'Continuous visibility without touching a single controller',
    desc: 'How an airport gained a verified BMS inventory, a prioritised vulnerability register, and protocol-aware threat detection — with Gramax assessment + Velos Shield continuous monitoring.',
    points: ['Verified asset inventory', 'Risk-scored register', 'SOC-integrated NIDS'],
    readTime: '~18 min read',
    file: '/resources/airport-bms-cybersecurity-case-study.pdf',
  },
  {
    slug: 'rethinking-ot-cyber-risk-beyond-cvss',
    kind: 'Whitepaper',
    series: 'POV Whitepaper Series • August 2026',
    title: 'Rethinking OT Cyber Risk Beyond CVSS',
    subtitle: 'The Operational Context Gap',
    desc: 'Why severity is not consequence. How the six-layer Operational Context Stack closes the gap between what security tools describe and what operations needs to decide — illustrated through five documented incidents.',
    points: ['Operational Context Stack', '5 incident case studies', 'Operational Materiality model'],
    readTime: '~28 min read',
    file: '/resources/rethinking-ot-cyber-risk-beyond-cvss.pdf',
  },
  {
    slug: 'from-packets-to-plant-impact',
    kind: 'Whitepaper',
    series: 'POV Whitepaper Series • August 2026',
    title: 'From Packets to Plant Impact',
    subtitle: 'Why the next evolution of OT monitoring isn’t about seeing more',
    desc: 'Six beliefs, one direction: See → Preserve → Interpret → Prepare → Remember → Understand. From passive visibility to evidence-grounded AI to a plant that can explain itself.',
    points: ['6-part framework', 'Event-centric monitoring', 'Evidence-grounded AI'],
    readTime: '~24 min read',
    file: '/resources/from-packets-to-plant-impact.pdf',
  },
  {
    slug: 'brochure',
    kind: 'Brochure',
    series: 'Velos Shield • Platform Brochure',
    title: 'Velos Shield Platform Brochure',
    subtitle: 'OT/ICS Security Platform at a glance',
    desc: 'The attack surface every industrial facility runs on — and how Velos Shield turns visibility into insight across manufacturing, energy, airports, maritime, and smart cities.',
    points: ['2-page overview', 'Industries covered', 'Platform pillars'],
    readTime: '2 pages • PDF',
    file: '/velosshield-brochure.pdf',
    direct: true,
  },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div
            className="relative min-h-[380px] md:h-[480px] bg-cover bg-center"
            style={{ backgroundImage: 'url(/shutterstock/industries-hero.jpg)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,rgba(0,0,0,.55)_100%)]" />
            <CardContent className="relative flex min-h-[380px] md:h-[480px] flex-col justify-end p-8 md:p-12 text-white">
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-white/70 mb-3">
                Resources • Whitepapers, Case Studies & Brochures
              </p>
              <h1 className="text-3xl md:text-6xl font-bold tracking-[-.05em] leading-[1.02] mb-5 max-w-3xl">
                Rethinking OT security, in plain operational terms.
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-8">
                Point-of-view papers, field case studies, and the platform brochure on closing the gap between what OT security tools see and what plant, security, and executive teams need to know.
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/70">
                {['Ungated • free to read', 'HTML + PDF download', 'Board-ready frameworks'].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-5">
          {papers.map((p) => (
            <Card key={p.slug} className="overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,.10)] transition-all duration-300">
              <CardContent className="p-9 md:p-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[11px] font-semibold tracking-[.14em] uppercase px-3 py-1 rounded-full ${p.kind === 'Case Study' ? 'bg-[#FF612A]/10 text-[#FF612A]' : p.kind === 'Brochure' ? 'bg-[#003C64]/10 text-[#003C64]' : 'bg-[#003C64]/5 text-[#003C64]'}`}>
                    {p.kind}
                  </span>
                </div>
                <p className="text-[12px] font-semibold tracking-[.14em] uppercase text-muted-foreground mb-3">{p.series}</p>
                <h2 className="text-2xl font-semibold tracking-[-.03em] mb-1 text-[#003C64]">{p.title}</h2>
                <p className="text-sm font-medium text-foreground/80 mb-4">{p.subtitle}</p>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-6">{p.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.points.map((pt) => (
                    <span key={pt} className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-white text-muted-foreground">
                      {pt}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-6">{p.readTime}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-6 border-t border-border/50">
                  {p.direct ? (
                    <a
                      href={p.file}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
                    >
                      View PDF
                    </a>
                  ) : (
                    <Link
                      href={`/resources/${p.slug}`}
                      className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_10px_25px_rgba(0,60,100,.3)] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline"
                    >
                      Read online
                    </Link>
                  )}
                  <a
                    href={p.file}
                    download
                    className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-border/70 bg-white text-foreground hover:bg-muted transition-colors no-underline"
                  >
                    Download PDF
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6 pb-24">
        <Card className="border-border/70">
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-2">A position, not a product claim</p>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                These papers describe our perspective on how OT monitoring should evolve. They intentionally don’t present every idea as an already-shipped capability.
              </p>
            </div>
            <Link href="/demo" className="shrink-0 inline-flex items-center justify-center rounded-full h-12 px-8 text-[15px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] hover:bg-[linear-gradient(180deg,#ff8a4d_0%,#FF612A_48%,#e04f0a_100%)] hover:text-[#003C64] transition-all no-underline">
              Continue the conversation
            </Link>
          </CardContent>
        </Card>
      </section>
      <SiteFooter />
    </>
  );
}
