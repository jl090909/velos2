/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, @next/next/no-location-assign-relative-destination */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteFooter } from '@/components/SiteFooter';
import { getCartId, clearCartId } from '@/lib/commerce';
import { medusa } from '@/lib/medusa-client';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    postal_code: '',
    country_code: 'gb',
    phone: '',
  });

  useEffect(() => {
    const id = getCartId();
    if (!id) { setLoading(false); return; }
    (async () => {
      try {
        const { cart: c } = await medusa.store.cart.retrieve(id);
        setCart(c);
        const so = await medusa.client.fetch<{ shipping_options: any[] }>('/store/shipping-options', { query: { cart_id: id } });
        setShippingOptions(so.shipping_options || []);
        if (so.shipping_options?.length) setSelectedShipping(so.shipping_options[0].id);
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cart) return;
    setSubmitting(true);
    setError(null);
    try {
      const addr = {
        first_name: form.first_name,
        last_name: form.last_name,
        address_1: form.address_1,
        city: form.city,
        postal_code: form.postal_code,
        country_code: form.country_code,
        phone: form.phone,
      };
      await medusa.store.cart.update(cart.id, {
        email: form.email,
        shipping_address: addr,
        billing_address: addr,
      });
      if (selectedShipping) {
        await medusa.store.cart.addShippingMethod(cart.id, { option_id: selectedShipping });
      }
      // initiate payment session
      const updated = await medusa.store.cart.retrieve(cart.id);
      await medusa.store.payment.initiatePaymentSession(updated.cart, { provider_id: 'pp_system_default' });
      const res = await medusa.store.cart.complete(cart.id);
      if (res.type === 'order') {
        clearCartId();
        router.push(`/order-confirmed?order_id=${res.order.id}`);
      } else {
        setError('Checkout did not complete. Please review.');
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-10">Loading checkout…</p>;
  if (!cart) return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
      <p className="text-slate-600">No cart found.</p>
      <Link href="/shop" className="mt-4 inline-flex rounded-full bg-[#003C64] px-6 py-3 font-semibold text-white">Shop products</Link>
    </section>
  );

  const inputCls = "w-full rounded border border-slate-300 px-3 py-2";

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.23em] text-[#FF612A]">Velos Shield · Checkout</p>
        <h1 className="text-4xl font-semibold text-[#003C64]">Checkout</h1>
        <p className="mt-2 text-slate-600">Total: {((cart.total || 0) / 100).toFixed(2)} {cart.region?.currency_code?.toUpperCase()}</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input required placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="First name" value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} className={inputCls} />
            <input required placeholder="Last name" value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} className={inputCls} />
          </div>
          <input required placeholder="Address" value={form.address_1} onChange={e=>setForm({...form,address_1:e.target.value})} className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className={inputCls} />
            <input required placeholder="Postal code" value={form.postal_code} onChange={e=>setForm({...form,postal_code:e.target.value})} className={inputCls} />
          </div>
          <select value={form.country_code} onChange={e=>setForm({...form,country_code:e.target.value})} className={inputCls}>
            <option value="gb">United Kingdom</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="es">Spain</option>
            <option value="it">Italy</option>
          </select>
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className={inputCls} />
          {shippingOptions.length > 0 && (
            <select value={selectedShipping} onChange={e=>setSelectedShipping(e.target.value)} className={inputCls}>
              {shippingOptions.map((o:any) => (
                <option key={o.id} value={o.id}>{o.name} — {((o.calculated_price?.calculated_amount ?? 0)/100).toFixed(2)}</option>
              ))}
            </select>
          )}
          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="inline-flex rounded-full bg-[#003C64] px-6 py-3 font-semibold text-white disabled:opacity-50">
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </section>
      <SiteFooter />
    </>
  );
}
