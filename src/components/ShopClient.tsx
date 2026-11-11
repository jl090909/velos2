/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, @next/next/no-location-assign-relative-destination */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { setCartId } from '@/lib/commerce';

type Product = {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  variants?: { id: string; title: string; calculated_price?: { calculated_amount: number; currency_code: string } }[];
};

const MEDUSA = 'http://localhost:9050';
const PK = 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5';
const REGION = 'reg_01M6ZJ0C0XBX23YXZ267CCN475';

export default function ShopClient() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${MEDUSA}/store/products?limit=50&region_id=${REGION}`, {
      headers: { 'x-publishable-api-key': PK },
    })
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, []);

  async function addToCart(variantId: string, quantity: number) {
    let cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) {
      const res = await fetch(`${MEDUSA}/store/carts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK },
        body: JSON.stringify({ region_id: REGION }),
      });
      const data = await res.json();
      cartId = data.cart?.id;
      if (cartId) localStorage.setItem('medusa_cart_id', cartId);
    }
    if (!cartId) return;
    await fetch(`${MEDUSA}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK },
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });
    if (cartId) setCartId(cartId);
    router.push('/cart');
  }

  if (loading) return <p className="p-10">Loading products…</p>;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
      <p className="mb-3 text-xs font-bold uppercase tracking-[.23em] text-[#FF612A]">Velos Shield · Commerce</p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#003C64] md:text-6xl">Products for sale</h1>
      <p className="mt-6 max-w-3xl text-lg text-slate-600">Live catalogue from Medusa. Choose quantity and add to cart.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const variant = p.variants?.[0];
          const price = variant?.calculated_price;
          const q = qty[p.id] || 1;
          return (
            <article key={p.id} className="rounded-3xl border border-slate-200 bg-white p-9 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#FF612A]">Product</span>
                <code className="text-xs text-slate-500">{p.id}</code>
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-[#003C64]">{p.title}</h2>
              <p className="mt-3 min-h-20 text-slate-600">{p.description || 'No description.'}</p>
              {price && (
                <p className="mb-3 text-lg font-semibold text-[#003C64]">
                  {price.calculated_amount / 100} {price.currency_code.toUpperCase()}
                </p>
              )}
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={q}
                  onChange={(e) => setQty({ ...qty, [p.id]: Number(e.target.value) || 1 })}
                  className="w-20 rounded border border-slate-300 px-3 py-2"
                />
                <button
                  onClick={() => addToCart(variant?.id || '', q)}
                  className="inline-flex rounded-full bg-[#003C64] px-6 py-3 font-semibold text-white"
                >
                  Add to cart
                </button>
              </div>
            </article>
          );
        })}
        {products.length === 0 && <p className="text-slate-600">No products available.</p>}
      </div>
    </section>
  );
}
