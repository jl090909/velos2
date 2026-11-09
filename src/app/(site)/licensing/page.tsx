import Link from 'next/link';
export default function LicensingPage() {
 return <section className="mx-auto max-w-5xl px-6 pb-24 pt-16">
  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#FF612A]">Local licensing proof of concept</p>
  <h1 className="text-4xl font-semibold text-[#003C64]">Licence infrastructure</h1>
  <p className="mt-5 max-w-2xl text-slate-600">Keygen Community Edition issues signed entitlements. The VS Core 1.1 device agent must verify them locally before enforcement is introduced. This page does not represent a licence as issued until the backend integration passes verification.</p>
  <div className="mt-8 space-y-3 rounded-2xl border bg-white p-6 text-slate-700">
    <p>Keygen CE API — local port 9045 (loopback only)</p>
    <p>Medusa Admin — <a className="underline" href="http://localhost:9050/app">localhost:9050/app</a></p>
    <p>VS Core 1.1 — <a className="underline" href="http://localhost:4011">localhost:4011</a></p>
    <p>Core licence verification — <a className="underline" href="http://localhost:9053">localhost:9053</a></p>
    <p>Health check — <Link className="underline" href="/api/poc/health/">POC service status (JSON)</Link></p>
  </div>
  <div className="mt-8"><Link href="/shop" className="underline text-[#003C64]">Back to products</Link></div>
 </section>;
}
