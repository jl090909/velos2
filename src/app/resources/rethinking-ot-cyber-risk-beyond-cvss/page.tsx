import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Rethinking OT Cyber Risk Beyond CVSS — Velos Shield Resources',
  description: 'The Operational Context Gap: why severity is not consequence, and the six-layer Operational Context Stack.',
};

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/70">
      <CardContent className="p-8 md:p-10">
        <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">{n}</p>
        <h2 className="text-2xl font-semibold tracking-[-.03em] mb-4 text-[#003C64]">{title}</h2>
        <div className="text-sm md:text-[15px] text-muted-foreground leading-relaxed space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-[#FF612A] pl-5 py-1 text-foreground font-medium text-base md:text-lg leading-relaxed">
      {children}
    </blockquote>
  );
}

export default function Paper1Page() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div className="relative min-h-[360px] md:h-[440px] bg-cover bg-center" style={{ backgroundImage: 'url(/shutterstock/hero-ot.jpg)' }}>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,rgba(0,0,0,.58)_100%)]" />
            <CardContent className="relative flex min-h-[360px] md:h-[440px] flex-col justify-end p-8 md:p-12 text-white">
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-white/70 mb-3">POV Whitepaper Series • August 2026</p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-[-.04em] leading-[1.05] mb-4 max-w-3xl">Rethinking OT Cyber Risk Beyond CVSS</h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-6">The Operational Context Gap — the distance between what cybersecurity tools can describe and what operations needs to know before that data becomes a decision.</p>
              <div className="flex flex-wrap gap-3">
                <a href="/resources/rethinking-ot-cyber-risk-beyond-cvss.pdf" download className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-white text-[#003C64] hover:bg-white/90 transition-colors no-underline">Download PDF</a>
                <Link href="/resources" className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-white/30 bg-white/15 text-white hover:bg-white/20 transition-colors no-underline backdrop-blur-sm">← All resources</Link>
              </div>
            </CardContent>
          </div>
        </div>
      </section>

      <section className="py-6 max-w-6xl mx-auto px-6">
        <Card className="border-border/70">
          <CardContent className="p-8 md:p-10">
            <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Executive summary</p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              Industrial organisations can now see more of their operational technology than at any point in the last two decades — yet CISOs and plant leaders still cannot say, with confidence, which cyber conditions actually threaten their operation right now. This is not a visibility failure. CISA has published over 12,000 known OT/ICS vulnerabilities since 2010, and severity keeps climbing. The problem is that severity is not consequence.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              A critical finding on an isolated, redundant display and an identical finding on a single-point-of-failure safety controller are not the same risk. Closing the gap means building the context that has lived only in experienced engineers’ heads: what an asset does, what depends on it, and what would genuinely happen if it failed.
            </p>
            <Quote>“Visibility tells an organisation what exists. Context tells it what matters. Intelligence tells it what to do about it.”</Quote>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-6">
              This paper examines why CVSS, alert volume and generic criticality break down inside OT — a conclusion CISA itself reached in June 2026 when it formally retired mandated CVSS-based prioritisation — walks through five documented incidents, and introduces the Operational Context Stack.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="py-6 max-w-6xl mx-auto px-6 grid gap-5">
        <Section n="01 — Visibility paradox" title="Seeing more hasn’t meant knowing what matters">
          <p>Passive, protocol-aware monitoring now identifies most devices automatically, and CISA’s advisory pipeline scaled to over 500 ICS advisories in a single year for the first time. Average CVSS severity has risen steadily since 2010.</p>
          <p>Yet ~45% of independent OT assessments still uncover fundamental visibility gaps. Information has grown faster than any organisation’s capacity to interpret it — more sensors and advisories have not produced a proportional increase in knowing what actually matters.</p>
        </Section>

        <Section n="02 — Five capabilities" title="Seeing an asset is not understanding an asset">
          <p>Five capabilities are routinely treated as one: <b className="text-foreground">Discovery</b> (something is there), <b className="text-foreground">Identification</b> (it has a name), <b className="text-foreground">Classification</b> (it has a type), <b className="text-foreground">Contextualisation</b> (it has a place), and <b className="text-foreground">Operational Understanding</b> (it has a meaning).</p>
          <p>Modern tooling is strong at the first three. A sensor can identify a controller’s exact model and firmware — but cannot tell you, unaided, that this specific controller governs an emergency shutdown sequence with no manual backup, while an identical unit two buildings away controls parking-lot lighting.</p>
        </Section>

        <Section n="03 — The gap" title="The Operational Context Gap">
          <p>The gap is the distance between what cybersecurity data can technically describe and what operations, engineering and executive functions need to know before that description becomes a decision. The resolving information — process role, failure mode, redundancy — has always lived in engineering drawings and operator memory, not in any system security tooling can query.</p>
          <p>Each stakeholder feels it differently: CISOs cannot translate a vulnerability count into a board-level business case; SOC analysts face alert fatigue with no reliable way to separate routine anomalies from real threats; plant managers see patch requests disconnected from operational reality.</p>
        </Section>

        <Section n="04 — Why models break" title="Why traditional risk models break down in OT">
          <p><b className="text-foreground">CVSS:</b> describes theoretical severity, independent of environment. In June 2026, CISA’s Binding Operational Directive 26-04 retired mandated CVSS-based prioritisation, replacing it with exposure, exploitation and mission-impact questions.</p>
          <p><b className="text-foreground">Counts, criticality, threat intel:</b> raw counts measure exposure trends but not what to do today — only ~3% of one year’s ICS vulnerabilities required truly immediate action once context was applied. Static criticality misses that importance shifts with production schedule and redundancy. Sector intel says who is out there, not whether they can reach a specific asset.</p>
        </Section>

        <Section n="05 — Cyber vs operational risk" title="Same CVE, very different operational risk">
          <p>A CVSS 9.8 on an isolated HMI duplicated by physical gauge panels is a low-priority finding. The identical 9.8 on an HMI with vendor remote access, on a flat network shared with IT, and no manual override for a pressure-relief valve, is an emergency.</p>
          <p>Two assets can carry identical technical findings and warrant entirely different responses — invisible to any tool that stops at the technical layer.</p>
        </Section>

        <Section n="06 — The stack" title="The Operational Context Stack">
          <p>Six layers, ordered from easiest to automate to most cross-functional: <b className="text-foreground">Asset → Relationship → Process → Criticality → Threat → Consequence</b>.</p>
          <p>Most organisations can answer through Relationship (topology, reachability). Very few can answer Consequence in board-ready terms without days of manual work per asset. That distance between layer two and layer six is the gap in structural form.</p>
        </Section>

        <Section n="07 — Fusion" title="From technical signals to operational intelligence">
          <p>Most organisations already own the raw material — OT telemetry, asset inventory, engineering docs, threat intel, business criticality — sitting in different systems owned by different teams. Collecting more data widens the gap; each new feed adds another dashboard to manually reconcile.</p>
          <p>Data fusion, not collection, is the unlock: a persistent layer that joins telemetry to the process it belongs to, so a new finding inherits its operational meaning the moment it appears.</p>
        </Section>

        <Section n="08 — Human problem" title="Five functions, five vocabularies">
          <p>SOC, cybersecurity, engineering, operations and executive leadership look at the same environment and see materially different things. OT incident response plans are often absent, engineers rarely trained in cyber response, and assumed IT/OT segmentation frequently fails pen testing.</p>
          <p>IT and OT teams don’t primarily need more shared data; they need shared insight built around what an asset does operationally. Security tooling must feed structured operational context as native output, not leave teams reconciling spreadsheets after the fact.</p>
        </Section>

        <Section n="09 — New model" title="Operational Materiality">
          <p>Rather than a false-precision score: a qualitative, banded model — <b className="text-foreground">Low / Elevated / Material / Severe</b> — based on the combination of reachability, process role, failure consequence, plausible adversary, and timing. CVSS and threat intel stay as supporting evidence, never as the full judgment.</p>
        </Section>

        <Section n="10–12 — Destination" title="Cyber-Aware Operations & roadmap">
          <p><Quote>“Cyber-Aware Operations is not a bigger SOC. It is an operation that understands its own cyber risk the way it already understands its own safety risk.”</Quote></p>
          <p className="pt-2">Five architectural principles: context as a persistent layer; fusion over collection; bidirectional flow between engineering and security; role-specific views from one shared foundation; design for degradation (recognise compensating controls).</p>
          <p>Roadmap: Assess maturity per Stack layer (months 1–2) → Contextualise the smallest asset set carrying the largest risk (2–6) → Prioritise with Materiality bands, even manually (4–8) → Operationalise into an auto-updating context layer (8–16) → Continuously learn from every incident.</p>
        </Section>

        <Section n="Case studies" title="Five documented incidents through the context lens">
          <p><b className="text-foreground">Colonial Pipeline (2021):</b> an IT-only ransomware event shut 45% of the US East Coast fuel supply — driven not by what attackers reached, but by what the organisation could not prove they hadn’t. A Relationship-layer (segmentation confidence) failure.</p>
          <p><b className="text-foreground">Triton/Trisis (2017):</b> safety-controller malware undetected for two months because the first SIS anomaly was investigated as mechanical fault, not a cyber event. Engineering and security had no channel connecting safety process to adversary behaviour.</p>
          <p><b className="text-foreground">Ukraine grid (2015–2016):</b> BlackEnergy3 reconnaissance dwelled for months before breakers were opened; a year later Industroyer manipulated grid protocols directly. Process/consequence knowledge of topology and manual restoration blunted impact.</p>
          <p><b className="text-foreground">Norsk Hydro (2019):</b> LockerGoga never touched controls directly, yet cost ~$71M H1 by forcing 160 plants to manual operation. Resilience — trained manual procedures, strong backups — was the Consequence-layer mitigation.</p>
          <p><b className="text-foreground">Oldsmar water (2021):</b> an operator watching a moving mouse cursor caught a lye-dosing change automation missed. Decades-old process-safety layering (redundant pH alarms, 24–36h physical delay) worked as designed — context that predates cybersecurity tooling.</p>
        </Section>

        <Section n="Conclusion" title="A meaning problem, not a data problem">
          <Quote>“The industry does not have a data problem anymore. It has a meaning problem. And meaning cannot be scanned for — it has to be built.”</Quote>
          <p className="pt-2">Organisations that internalise this distinction now will be the ones able to say, with confidence, what a given vulnerability actually means to their operation.</p>
          <div className="pt-4 border-t border-border/50 mt-6">
            <p className="text-xs uppercase tracking-[.18em] font-semibold text-foreground mb-1">Let’s talk</p>
            <p className="text-sm">How you think about OT security — we’d like to hear it. Reach out at contact@velosshield.com.</p>
          </div>
        </Section>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6 pb-24">
        <Card className="border-border/70">
          <CardContent className="p-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <p className="text-sm text-muted-foreground">About Velos Shield — OT monitoring designed around trustworthy evidence, operational context and persistent memory.</p>
            <div className="flex gap-3 shrink-0">
              <a href="/resources/rethinking-ot-cyber-risk-beyond-cvss.pdf" download className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] no-underline">Download PDF</a>
              <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-border/70 bg-white no-underline text-foreground">Request Demo</Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
