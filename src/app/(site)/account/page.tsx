import Link from 'next/link';
export default function AccountPage() {
 return <section className="mx-auto max-w-5xl px-6 pb-24 pt-16">
  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#FF612A]">Local commerce proof of concept</p>
  <h1 className="text-4xl font-semibold text-[#003C64]">Customer account</h1>
  <p className="mt-5 max-w-2xl text-slate-600">Medusa is running locally. Customer-facing registration and purchase history have not yet been connected. The test administrator can manage commerce configuration.</p>
  <a href="http://localhost:9051" className="mt-8 inline-flex rounded-full bg-[#003C64] px-6 py-3 font-semibold text-white">Open Medusa Admin (test account)</a>
  <div className="mt-8"><Link href="/shop" className="underline text-[#003C64]">Back to products</Link></div>
 </section>;
}
