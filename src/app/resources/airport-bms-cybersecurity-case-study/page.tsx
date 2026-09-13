import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Case Study: Airport Building Management Systems — Velos Shield Resources',
  description: 'How an airport gained continuous BMS visibility, vulnerability prioritisation, and protocol-aware threat detection — without touching a single controller.',
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

const gaps = [
  { title: 'Unclear asset ownership', desc: 'Controllers and devices added over the years without a complete, current inventory of what existed or how critical each one was.' },
  { title: 'Flat, under-segmented networks', desc: 'Building systems shared network space with limited separation, making it easier for an issue in one area to reach another.' },
  { title: 'Loose credentials & access', desc: 'Shared or default logins and broad vendor privileges made it hard to know exactly who could reach which systems.' },
  { title: 'Ageing, unpatched systems', desc: 'Some servers and workstations ran outdated software with no formal, ongoing process for keeping them current.' },
  { title: 'Always-on remote access', desc: 'Vendor and maintenance connections stayed open long after the work was done, with little record of what happened during the session.' },
  { title: 'No eyes on the network itself', desc: 'No tool-based way to see what normal BMS traffic looked like, let alone notice the moment something drifted from it.' },
];

const layers = [
  { title: 'Enterprise IT', desc: 'The corporate network and its users.' },
  { title: 'Airport SOC', desc: 'Central monitoring and response.' },
  { title: 'OT Monitoring', desc: 'Velos Shield NIDS, watching continuously.' },
  { title: 'OT DMZ', desc: 'Jump server and remote-access gateway.' },
  { title: 'BMS Zone', desc: 'BMS servers and engineering workstations.' },
  { title: 'Field Zone', desc: 'Controllers, sensors, and actuators.' },
];

const changes: [string, string, string][] = [
  ['Asset visibility', 'Incomplete records of what controllers existed', 'Critical BMS assets identified and classified by business impact'],
  ['Vulnerability data', 'No structured, tool-based vulnerability view', 'Correlated, risk-scored register tied to real assets'],
  ['Network design', 'Flat segments, little separation', 'Documented architecture with a segmentation roadmap'],
  ['Access control', 'Shared credentials, loose vendor access', 'Vendor access controlled, time-bound, reviewed'],
  ['Monitoring', 'No protocol-level insight into BMS traffic', 'Continuous, protocol-aware monitoring in place'],
  ['Detection & response', 'Limited anomaly detection', 'Prioritized vulnerabilities with SOC-integrated detection'],
];

export default function CaseStudyPage() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div className="relative min-h-[360px] md:h-[440px] bg-cover bg-center" style={{ backgroundImage: 'url(/shutterstock/hero-ot.jpg)' }}>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,rgba(0,0,0,.58)_100%)]" />
            <CardContent className="relative flex min-h-[360px] md:h-[440px] flex-col justify-end p-8 md:p-12 text-white">
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-white/70 mb-3">Case Study • Airport Operations — Building Management Systems</p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-[-.04em] leading-[1.05] mb-4 max-w-3xl">Strengthening Cybersecurity of Airport Building Management Systems</h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-6">Continuous BMS visibility, vulnerability prioritisation, and protocol-aware threat detection — turning OT telemetry into business-impact decisions without touching a single controller.</p>
              <div className="flex flex-wrap gap-3">
                <a href="/resources/airport-bms-cybersecurity-case-study.pdf" download className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-white text-[#003C64] hover:bg-white/90 transition-colors no-underline">Download PDF</a>
                <Link href="/resources" className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-white/30 bg-white/15 text-white hover:bg-white/20 transition-colors no-underline backdrop-blur-sm">← All resources</Link>
              </div>
            </CardContent>
          </div>
        </div>
      </section>

      <section className="py-6 max-w-6xl mx-auto px-6">
        <Card className="border-border/70">
          <CardContent className="p-8 md:p-10">
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <div className="rounded-[1.2rem] border border-border/60 bg-white p-4 text-sm"><span className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#FF612A] block mb-1">Sector</span>Airport Operations — BMS</div>
              <div className="rounded-[1.2rem] border border-border/60 bg-white p-4 text-sm"><span className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#FF612A] block mb-1">Services</span>OT Security Assessment • Discovery & Vuln Mgmt • Risk Mitigation Advisory</div>
              <div className="rounded-[1.2rem] border border-border/60 bg-white p-4 text-sm"><span className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#FF612A] block mb-1">Technology partner</span>Velos Shield</div>
            </div>
            <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">The context</p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              OT security should not stop at asset visibility or alert generation. In a cyber-physical environment such as airport BMS, the real value is connecting passive discovery, vulnerability intelligence, abnormal behaviour detection, and business-impact prioritisation into one continuous operating view.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Behind every terminal is a large interconnected BMS — HVAC, chilled-water plants, electrical distribution, lighting, elevators, access control, fire and life-safety monitoring — increasingly linked over the same IP network, connected outward to corporate IT, airport operations, contractors, remote maintenance and cloud services. A single weak link doesn’t just risk an HVAC outage — it can ripple into passenger comfort, equipment availability, operational continuity, and physical security.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="py-6 max-w-6xl mx-auto px-6 grid gap-5">
        <Section n="The challenge" title="Familiar building systems, an unfamiliar attack surface">
          <div className="grid sm:grid-cols-2 gap-3">
            {gaps.map((g) => (
              <div key={g.title} className="rounded-[1.2rem] border border-border/60 bg-white p-5">
                <p className="font-semibold text-foreground mb-1">{g.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section n="Why it matters" title="The building systems don’t need to be attacked directly to be a way in">
          <p>An intruder doesn’t need to touch any flight-critical system. A realistic path runs from the internet or a compromised IT account, into the general network, across to the BMS, through an engineering workstation, and finally to a controller managing a real physical process.</p>
          <p>From there: adjusting HVAC setpoints or stopping equipment, triggering false alarms or silencing real ones, changing schedules, or quietly disabling the very monitoring meant to catch it — using the same protocols and access paths engineers rely on every day.</p>
        </Section>

        <Section n="Assessment" title="Tool-based assessment, grounded in evidence">
          <p><b className="text-foreground">Asset discovery:</b> Velos Shield connected via SPAN ports — no agents, no active probing — and built a verified inventory of engineering workstations, BMS servers, controllers, sensors, actuators and their protocols, revealing communication relationships, unmanaged devices, forgotten remote-access endpoints and shadow connections.</p>
          <p><b className="text-foreground">Vulnerability management:</b> each asset fingerprinted and correlated against known exposure data, then layered with operational context — what it controls, how exposed it is, what a credible attack path looks like — separating theoretical exposure from risk that could genuinely affect airport operations.</p>
          <p><b className="text-foreground">Outcome:</b> a verified BMS asset inventory, a prioritised vulnerability register, and a continuously monitored behavioural baseline — each tied to business impact.</p>
        </Section>

        <Section n="Approach" title="Establish the baseline, then watch it continuously">
          <p><b className="text-foreground">Phase 1 — Baseline:</b> a structured Gramax review of assets, network architecture, configurations and working processes — a point-in-time picture against recognized OT security practices.</p>
          <p><b className="text-foreground">Phase 2 — Watch continuously:</b> Velos Shield NIDS passively listens via mirrored ports, building a living picture of every asset and conversation: who talks to whom, over which protocol, how often, and why.</p>
          <Quote>A BMS server reading data from an air-handling unit controller is ordinary. An engineering workstation suddenly writing to multiple controllers, or an unfamiliar device querying equipment across the building, looks very different once that baseline exists.</Quote>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {[
              ['Asset & network awareness', 'New devices, unexpected addresses, layout changes surfaced as they appear.'],
              ['Protocol-level detection', 'Unauthorized commands and unusual frequency stand out against the everyday rhythm.'],
              ['Cyber-attack indicators', 'Reconnaissance, lateral movement, repeated logins recognized as patterns.'],
              ['BMS-specific anomalies', 'Unexpected setpoint changes, abnormal restarts, unusual access to critical equipment.'],
            ].map(([t, d]) => (
              <div key={t} className="rounded-[1.2rem] border border-border/60 bg-white p-5">
                <p className="font-semibold text-foreground mb-1">{t}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section n="Mitigation" title="Turning telemetry into decisions">
          <p><b className="text-foreground">Identifying risk:</b> consolidated inventory and findings into a single risk register scored by likelihood and operational consequence; mapped realistic attack paths; reviewed remote-connectivity patterns to find unmanaged vendor exposure.</p>
          <p><b className="text-foreground">Mitigating risk:</b> remediation roadmap ordered by business impact; segmentation plan separating BMS from enterprise IT and lower-trust zones; time-bound, reviewed, logged vendor access replacing always-on shared credentials; NIDS policies tuned to the baseline and wired into the airport’s SOC and incident response.</p>
          <p>Velos Shield gave the airport the eyes on the network. Gramax gave it the judgment to act on what those eyes saw.</p>
        </Section>

        <Section n="Architecture" title="Layered around how the building actually operates">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {layers.map((l) => (
              <div key={l.title} className="rounded-[1.2rem] border border-border/60 bg-white p-5">
                <p className="font-semibold text-[#003C64] mb-1">{l.title}</p>
                <p className="text-sm text-muted-foreground">{l.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section n="What changed" title="From scattered visibility to a shared picture">
          <div className="overflow-x-auto rounded-[1.2rem] border border-border/60">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-muted/60 text-left">
                  <th className="p-4 font-semibold text-foreground">Area</th>
                  <th className="p-4 font-semibold text-foreground">Before</th>
                  <th className="p-4 font-semibold text-foreground">After</th>
                </tr>
              </thead>
              <tbody>
                {changes.map(([a, b, c]) => (
                  <tr key={a} className="border-t border-border/50 align-top">
                    <td className="p-4 font-semibold text-[#003C64]">{a}</td>
                    <td className="p-4 text-muted-foreground">{b}</td>
                    <td className="p-4 text-muted-foreground">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section n="Impact" title="What continuous visibility means beyond the network diagram">
          <ul className="list-disc pl-5 space-y-2">
            <li>Reduced operational risk — fewer opportunities for unauthorized manipulation of building systems.</li>
            <li>Improved resilience — clearer monitoring and response path for critical facility services during a cyber incident.</li>
            <li>Faster detection — from investigating after something goes wrong to spotting unusual behavior as it happens.</li>
            <li>Stronger vendor governance — full visibility into third-party remote access and contractor activity.</li>
            <li>Clearer executive visibility — findings translated into business-impact language for facilities, engineering, SOC and leadership alike.</li>
          </ul>
        </Section>

        <Section n="Conclusion" title="Infrastructure now — not just facilities">
          <p>An airport’s BMS has quietly become a cyber-physical layer of critical infrastructure. Pairing a Gramax-led, tool-based assessment with Velos Shield’s continuous NIDS monitoring gave the airport something more durable than a snapshot: a verified inventory, a prioritized risk register, and an ongoing shared understanding of what’s on the network, how it normally behaves, and what deserves a closer look.</p>
          <div className="pt-4 border-t border-border/50 mt-6 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[.18em] font-semibold text-foreground mb-1">Gramax Cybertech</p>
              <p className="text-sm">Specialized cybersecurity for critical infrastructure and cyber-physical environments across aviation, energy, maritime, manufacturing and urban infrastructure.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[.18em] font-semibold text-foreground mb-1">Velos Shield</p>
              <p className="text-sm">OT security and intelligence platform delivering continuous, passive visibility — asset intelligence, risk prioritisation, threat detection and decision-ready insights, built for zero-downtime operations.</p>
            </div>
          </div>
        </Section>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6 pb-24">
        <Card className="border-border/70">
          <CardContent className="p-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <p className="text-sm text-muted-foreground">Case study by Gramax Cybertech • Technology partner Velos Shield.</p>
            <div className="flex gap-3 shrink-0">
              <a href="/resources/airport-bms-cybersecurity-case-study.pdf" download className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] no-underline">Download PDF</a>
              <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-border/70 bg-white no-underline text-foreground">Request Demo</Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
