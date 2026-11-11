/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, @next/next/no-location-assign-relative-destination */
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

function OrderConfirmedInner() {
  const sp = useSearchParams();
  const orderId = sp.get('order_id');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('medusa_auth_token') : null;
    if (!token) return; // do not fetch order details without auth (avoid leaking order data)
    fetch('http://localhost:9050/store/orders/' + orderId, {
      headers: { 'x-publishable-api-key': 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5', 'Authorization': `Bearer ${token}` },
    }).then(r=>r.json()).then(d=>setOrder(d.order)).catch(()=>{});
  }, [orderId]);

  return (
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <p className="mb-3 text-xs font-bold uppercase tracking-[.23em] text-[#FF612A]">Velos Shield · Order confirmed</p>
      <h1 className="text-4xl font-semibold text-[#003C64]">Thank you for your order</h1>
      {orderId && <p className="mt-4 text-slate-600">Order ID: {orderId}</p>}
      {order && (
        <div className="mt-6 rounded-2xl border bg-white p-6">
          <p className="font-semibold">Total: {((order.total||0)/100).toFixed(2)} {order.currency_code ? order.currency_code.toUpperCase() : ''}</p>
          <p className="mt-2">Items: {order.items ? order.items.length : 0}</p>
        </div>
      )}
      <div className="mt-8 flex gap-4">
        <Link href="/shop" className="rounded-full border border-[#003C64] px-6 py-3 font-semibold text-[#003C64]">Continue shopping</Link>
        <Link href="/account" className="rounded-full bg-[#003C64] px-6 py-3 font-semibold text-white">Account and orders</Link>
      </div>
    </section>
  );
}

export default function OrderConfirmedPage() {
  return (
    <>
      <Suspense fallback={<p className="p-10">Loading…</p>}>
        <OrderConfirmedInner />
      </Suspense>
      <SiteFooter />
    </>
  );
}
