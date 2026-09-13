import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="py-12 bg-white/50 border-t border-border/60">
      <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3 text-sm text-muted-foreground">
        <div>
          <p className="font-semibold text-[#003C64] mb-1">Velos Shield</p>
          <p>© 2026 Rathon.ai</p>
          <div className="mt-3 space-y-1">
            <p>AWFIS Tower C, Bhutani Alphatum,</p>
            <p>Floor 19, Sector 90, Noida 201305</p>
          </div>
          <div className="mt-2 space-y-1">
            <p>Email: <a href="mailto:contact@rathon.ai" className="hover:text-foreground no-underline">contact@rathon.ai</a></p>
            <p>Phone: <a href="tel:+917090004700" className="hover:text-foreground no-underline">+91 70900 04700</a></p>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#FF612A] mb-3">Resources</p>
          <div className="space-y-2">
            <p><Link href="/resources/rethinking-ot-cyber-risk-beyond-cvss" className="hover:text-foreground no-underline">Rethinking OT Cyber Risk</Link></p>
            <p><Link href="/resources/from-packets-to-plant-impact" className="hover:text-foreground no-underline">From Packets to Plant Impact</Link></p>
            <p><Link href="/resources/airport-bms-cybersecurity-case-study" className="hover:text-foreground no-underline">Airport BMS Case Study</Link></p>
            <p><a href="/velosshield-brochure.pdf" className="hover:text-foreground no-underline">Platform Brochure</a></p>
          </div>
        </div>
        <div className="flex gap-5 flex-wrap md:justify-end items-start">
          <Link href="/product" className="hover:text-foreground no-underline">Velos Shield</Link>
          <Link href="/velossensor" className="hover:text-foreground no-underline">Velos Sensor</Link>
          <Link href="/industries" className="hover:text-foreground no-underline">Industries</Link>
          <Link href="/trust" className="hover:text-foreground no-underline">Trust</Link>
          <Link href="/resources" className="hover:text-foreground no-underline">Resources</Link>
        </div>
      </div>
    </footer>
  );
}
