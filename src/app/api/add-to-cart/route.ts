import { NextResponse } from 'next/server';

const MEDUSA = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9050';
const PK = process.env.MEDUSA_PUBLISHABLE_KEY || 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5';
const REGION = 'reg_01M6ZJ0C0XBX23YXZ267CCN475';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get('variant_id');
  const quantity = Number(searchParams.get('quantity') || '1');

  if (!variantId) {
    return NextResponse.redirect(new URL('/shop', request.url));
  }

  // create cart
  const cartRes = await fetch(`${MEDUSA}/store/carts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK },
    body: JSON.stringify({ region_id: REGION }),
  });
  const cartData = await cartRes.json();
  const cartId = cartData.cart?.id;

  if (!cartId) {
    return NextResponse.redirect(new URL('/shop', request.url));
  }

  // add line item
  await fetch(`${MEDUSA}/store/carts/${cartId}/line-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK },
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });

  return NextResponse.redirect(new URL('/cart', request.url));
}
