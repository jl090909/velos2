import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'From Packets to Plant Impact — Velos Shield Resources',
  description: 'Six beliefs on the evolution of OT monitoring: See → Preserve → Interpret → Prepare → Remember → Understand.',
};

const parts = [
  {
    n: 'Part 01 — See',
    title: 'See the Plant Without Touching the Plant',
    quote: 'A monitoring system shouldn’t be judged by whether the sensor is running. It should be judged by whether it keeps preserving evidence you can trust as the plant changes.',
    body: [
      'Passive monitoring is valuable because it observes without inserting itself into control paths — but passivity alone does not guarantee complete or durable visibility. A sensor can be online while evidence is delayed, dropped, de-contextualized, or unavailable.',
      'Visibility should be a continuing service property, not an appliance checkbox: evidence stays attributable to its source, important events stay available under load, degradation is itself visible, and recovery preserves continuity instead of silently creating a blind spot.',
    ],
    position: 'The future of passive OT monitoring isn’t broader coverage alone. It’s trustworthy, persistent visibility whose limitations are observable.',
  },
  {
    n: 'Part 02 — Preserve',
    title: 'Beyond Asset Visibility',
    quote: 'The event is the unit of attention. The asset is the unit of context. The process is the unit of consequence.',
    body: [
      'Asset discovery transformed OT monitoring — but a plant can have a highly accurate inventory and still leave an analyst asking: what changed? An event captures a change that can be investigated, connecting evidence to asset, relationship, time window, and operational question.',
      'Important events should stay traceable to underlying evidence and capable of later enrichment — without rewriting what was originally observed. That separation preserves facts while understanding evolves.',
    ],
    position: 'Asset-centric asks “what do we have?” Event-centric adds “what changed?” Operational asks “why does that change matter here?”',
  },
  {
    n: 'Part 03 — Interpret',
    title: 'From Protocol Awareness to Operational Awareness',
    quote: 'Observed ≠ inferred ≠ impact. Each layer should retain its own evidence and its own uncertainty.',
    body: [
      'Protocol decoding establishes what happened technically — but the same controller write can mean very different things depending on who initiated it, when, what the plant was doing, whether it was authorized, and what process depends on the target.',
      'Four levels: Packet (traffic observed) → Protocol (industrial action) → Operational observation (expected here?) → Plant-impact hypothesis (what could the operation experience?). If maintenance context is missing, the responsible conclusion is “legitimacy requires validation,” not automatically “attack.”',
    ],
    position: 'Make uncertainty useful — expose what’s known, inferred, missing, and what evidence would resolve it.',
  },
  {
    n: 'Part 04 — Prepare',
    title: 'AI Cannot Understand the Plant from Packets Alone',
    quote: 'AI shouldn’t become the source of truth for the plant. It should reason over a trustworthy, structured and traceable representation of what the plant already knows.',
    body: [
      'Pointing a language model at raw logs starts at the wrong layer. Deterministic systems should establish protocol facts, normalization create stable representations, events preserve units of attention, context connect to assets/roles/processes — only then should AI reason over that representation.',
      'Trustworthy AI is a provenance problem: factual statements trace to evidence, hypotheses are labelled, missing context stays visible. The goal isn’t sounding certain — it’s making uncertainty understandable and actionable.',
    ],
    position: 'The industrial AI opportunity isn’t “LLM on logs.” It’s an evidence-aware intelligence layer over a trustworthy plant representation.',
  },
  {
    n: 'Part 05 — Remember',
    title: 'The Plant Should Not Have to Forget',
    quote: 'Every validated investigation has the potential to make the plant easier to understand the next time.',
    body: [
      'Engineers explain vendor paths, operators confirm maintenance windows, analysts validate recurring communications — then that knowledge dies in tickets and memory. The same people keep re-explaining the same relationships.',
      'Plant memory is curated, evidence-backed relationships, patterns, exceptions, decisions and history — with provenance, time, confidence, ownership and validity. A relationship true last year shouldn’t silently become today’s truth.',
    ],
    position: 'Remember what was learned, preserve why it was believed, and know when it should no longer be trusted.',
  },
  {
    n: 'Part 06 — Understand',
    title: 'When the Plant Can Explain Itself',
    quote: 'The goal isn’t more alerts. It’s shrinking the distance between something happening and people understanding what happened, why it matters, and what to validate.',
    body: [
      'Reporting says a controller write occurred. Explanation assembles evidence, context, history and reasoning a human can evaluate: what happened, what supports it, why it matters here, what remains uncertain, what happens next.',
      'The loop: Observe → Preserve → Interpret → Contextualize → Remember → Explain → Validate → Learn. AI reasons and explains; humans validate wherever consequences are significant.',
    ],
    position: 'Intelligence doesn’t begin with AI. It begins with evidence. It gains value through context, becomes useful through memory, and earns trust through traceability and human validation.',
  },
];

export default function Paper2Page() {
  return (
    <>
      <section className="pt-20 pb-10 max-w-6xl mx-auto px-6">
        <div className="overflow-hidden rounded-[1.35rem] shadow-[0_16px_40px_rgba(15,23,42,.08)]">
          <div className="relative min-h-[360px] md:h-[440px] bg-cover bg-center" style={{ backgroundImage: 'url(/shutterstock/industries-hero.jpg)' }}>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,rgba(0,0,0,.58)_100%)]" />
            <CardContent className="relative flex min-h-[360px] md:h-[440px] flex-col justify-end p-8 md:p-12 text-white">
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-white/70 mb-3">POV Whitepaper Series • August 2026</p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-[-.04em] leading-[1.05] mb-4 max-w-3xl">From Packets to Plant Impact</h1>
              <p className="text-base md:text-xl text-white/80 max-w-2xl mb-6">Why the next evolution of OT security monitoring isn’t about seeing more — it’s about understanding what matters.</p>
              <div className="flex flex-wrap gap-3">
                <a href="/resources/from-packets-to-plant-impact.pdf" download className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-white text-[#003C64] hover:bg-white/90 transition-colors no-underline">Download PDF</a>
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
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              OT monitoring spent a decade learning to see: discover assets, decode protocols, flag suspicious activity. That progress matters — but more dashboards and alerts still don’t answer what actually happened and why it matters.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {['Visibility, redefined', 'Events over inventory', 'AI grounded in evidence', 'Memory that compounds'].map((t) => (
                <div key={t} className="rounded-[1.2rem] border border-border/60 bg-white p-4 text-sm font-medium text-[#003C64]">{t}</div>
              ))}
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              The progression this paper argues for: <b className="text-foreground">See → Preserve → Interpret → Prepare → Remember → Understand.</b> Each part builds on the one before it.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="py-6 max-w-6xl mx-auto px-6 grid gap-5">
        {parts.map((p) => (
          <Card key={p.n} className="border-border/70">
            <CardContent className="p-8 md:p-10">
              <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">{p.n}</p>
              <h2 className="text-2xl font-semibold tracking-[-.03em] mb-4 text-[#003C64]">{p.title}</h2>
              <blockquote className="border-l-2 border-[#FF612A] pl-5 py-1 text-foreground font-medium text-base md:text-lg leading-relaxed mb-5">“{p.quote}”</blockquote>
              <div className="text-sm md:text-[15px] text-muted-foreground leading-relaxed space-y-4 mb-5">
                {p.body.map((b, i) => (
                  <p key={i}>{b}</p>
                ))}
              </div>
              <div className="rounded-[1.2rem] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,.98)_0%,rgba(247,247,249,.92)_100%)] p-4 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#FF612A] block mb-1">Our position</span>
                <span className="text-muted-foreground">{p.position}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-border/70">
          <CardContent className="p-8 md:p-10">
            <p className="text-[13px] font-semibold tracking-[.18em] uppercase text-[#FF612A] mb-3">Closing</p>
            <h2 className="text-2xl font-semibold tracking-[-.03em] mb-4 text-[#003C64]">Where this industry is headed</h2>
            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-4">
              OT monitoring is moving from a visibility problem toward an understanding problem. The winners won’t be the systems with the most detections — they’ll be the systems that preserve trustworthy evidence, understand it in the context of a specific plant, remember what the organization has learned, and help people act on it.
            </p>
            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-6">
              The future may not be defined by how many packets a system can see or alerts it can generate — but by how well it preserves evidence, remembers what the plant taught us, and explains what changed in terms that matter to the operation.
            </p>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs uppercase tracking-[.18em] font-semibold text-foreground mb-1">Let’s talk</p>
              <p className="text-sm text-muted-foreground">How you think about OT security — we’d like to hear it. Reach out at contact@velosshield.com.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-6 pb-24">
        <Card className="border-border/70">
          <CardContent className="p-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <p className="text-sm text-muted-foreground">About Velos Shield — OT monitoring designed around trustworthy evidence, operational context and persistent memory.</p>
            <div className="flex gap-3 shrink-0">
              <a href="/resources/from-packets-to-plant-impact.pdf" download className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold bg-[linear-gradient(180deg,#0f5c8f_0%,#003C64_48%,#002640_100%)] text-[#FF612A] no-underline">Download PDF</a>
              <Link href="/demo" className="inline-flex items-center justify-center rounded-full h-11 px-6 text-[14px] font-semibold border border-border/70 bg-white no-underline text-foreground">Request Demo</Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
