import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

const products = [
  { name: 'Velos Shield Core', code: 'CORE-11', description: 'On-site OT sensor with a device-bound security licence.', tag: 'Hardware + licence' },
  { name: 'Velos Shield Insights', code: 'INSIGHTS-15', description: 'Central analytics and security visibility with licensed entitlements.', tag: 'Software licence' },
];

export default function ShopPage() {
  return <>
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
      <p className="mb-3 text-xs font-bold uppercase tracking-[.23em] text-[#FF612A]">Velos Shield · Local Commerce POC</p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#003C64] md:text-6xl">Buy, deploy, and licence your OT security.</h1>
      <p className="mt-6 max-w-3xl text-lg text-slate-600">This is a local demonstration environment. No real payments or production licences are enabled.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {products.map(p => <article key={p.code} className="rounded-3xl border border-slate-200 bg-white p-9 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold text-[#FF612A]">{p.tag}</span><code className="text-xs text-slate-500">{p.code}</code></div>
          <h2 className="mt-5 text-2xl font-semibold text-[#003C64]">{p.name}</h2>
          <p className="mt-3 min-h-20 text-slate-600">{p.description}</p>
          <p className="mb-5 text-sm text-slate-500">Pricing and final licensing policy to be confirmed. Test orders only.</p>
          <p className="inline-flex rounded-full bg-slate-200 px-6 py-3 font-semibold text-slate-600">Checkout setup in progress — no payments enabled</p>
        </article>)}
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/account" className="rounded-full border border-[#003C64] px-6 py-3 font-semibold text-[#003C64]">Customer portal</Link>
        <Link href="/licensing" className="rounded-full border border-[#003C64] px-6 py-3 font-semibold text-[#003C64]">Licence integration status</Link>
      </div>
    </section>
    <SiteFooter />
  </>;
}
