'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9050';
const PK = process.env.MEDUSA_PUBLISHABLE_KEY || 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5';
const REGION_ID = 'reg_01M6ZJ0C0XBX23YXZ267CCN475';

async function medusa(path: string, init: RequestInit = {}) {
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PK,
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  return res;
}

export async function addToCart(formData: FormData) {
  const variantId = String(formData.get('variant_id') || '');
  const quantity = Number(formData.get('quantity') || 1);
  if (!variantId || quantity < 1) return;

  const cookieStore = await cookies();
  let cartId = cookieStore.get('_medusa_cart_id')?.value;

  if (!cartId) {
    const res = await medusa('/store/carts', {
      method: 'POST',
      body: JSON.stringify({ region_id: REGION_ID }),
    });
    const data = await res.json();
    cartId = data.cart?.id;
    if (cartId) {
      cookieStore.set('_medusa_cart_id', cartId, { path: '/', sameSite: 'lax' });
    }
  }

  if (!cartId) return;

  await medusa(`/store/carts/${cartId}/line-items`, {
    method: 'POST',
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });

  redirect(`/cart`);
}
