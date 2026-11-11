/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, @next/next/no-location-assign-relative-destination */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { getCartId, medusaFetch } from '@/lib/commerce';

type Cart = any;

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const id = getCartId();
    if (!id) { setLoading(false); return; }
    const res = await medusaFetch(`/store/carts/${id}?fields=*items,*region,*items.product,*items.variant,*items.thumbnail,+items.total`);
    if (!res.ok) { setLoading(false); return; }
    const data = await res.json();
    setCart(data.cart);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateQty(lineId: string, qty: number) {
    const id = getCartId();
    if (!id) return;
    await medusaFetch(`/store/carts/${id}/line-items/${lineId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity: qty }),
    });
    load();
  }

  async function remove(lineId: string) {
    const id = getCartId();
    if (!id) return;
    await medusaFetch(`/store/carts/${id}/line-items/${lineId}`, { method: 'DELETE' });
    load();
  }

  if (loading) return <p className="p-10">Loading cart…</p>;

  const items = cart?.items || [];
  const total = cart?.total ?? 0;
  const currency = cart?.region?.currency_code?.toUpperCase() || 'EUR';

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.23em] text-[#FF612A]">Velos Shield · Cart</p>
        <h1 className="text-4xl font-semibold text-[#003C64]">Your cart</h1>
        {items.length === 0 && (
          <div className="mt-8">
            <p className="text-slate-600">Your cart is empty.</p>
            <Link href="/shop" className="mt-4 inline-flex rounded-full bg-[#003C64] px-6 py-3 font-semibold text-white">Shop products</Link>
          </div>
        )}
        {items.length > 0 && (
          <>
            <div className="mt-8 space-y-4">
              {items.map((it: any) => (
                <div key={it.id} className="flex items-center justify-between rounded-2xl border bg-white p-6">
                  <div>
                    <p className="font-semibold text-[#003C64]">{it.title}</p>
                    <p className="text-sm text-slate-500">{it.variant?.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="number" min={1} defaultValue={it.quantity}
                      onBlur={(e) => updateQty(it.id, Number(e.target.value) || 1)}
                      className="w-20 rounded border border-slate-300 px-3 py-2" />
                    <span className="font-semibold">{(it.total / 100).toFixed(2)} {currency}</span>
                    <button onClick={() => remove(it.id)} className="text-red-600 underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-xl font-semibold text-[#003C64]">Total: {(total / 100).toFixed(2)} {currency}</p>
              <Link href="/checkout" className="inline-flex rounded-full bg-[#003C64] px-6 py-3 font-semibold text-white">Proceed to checkout</Link>
            </div>
          </>
        )}
      </section>
      <SiteFooter />
    </>
  );
}
