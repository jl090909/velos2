import { NextResponse } from 'next/server';
import { renderOrderConfirmation } from '@/lib/email/order-confirmation';
import { sendTemplatedEmail } from '@/lib/email/ses';
import { alreadyNotified, recordNotification } from '@/lib/email/notifications';

const MEDUSA = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9050';
const PK = process.env.MEDUSA_PUBLISHABLE_KEY || 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5';

export async function POST(request: Request) {
  const { orderId, token } = await request.json();
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  const ref = `order_confirmation:${orderId}`;
  if (alreadyNotified('order_confirmation', ref)) {
    return NextResponse.json({ accepted: true, duplicate: true, messageId: null });
  }

  // Fetch order from Medusa
  const res = await fetch(`${MEDUSA}/store/orders/${orderId}`, {
    headers: { 'x-publishable-api-key': PK, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }
  const order = data?.order || data;

  const items = (order?.items || []).map((it: { title?: string; product_title?: string; quantity?: number; unit_price?: number }) => ({
    title: it?.title || it?.product_title || 'Item',
    quantity: Number(it?.quantity || 0),
    unitPrice: '',
    amount: `${((Number(it?.unit_price || 0) * Number(it?.quantity || 0)) / 100).toFixed(2)} ${String(order?.currency_code || '').toUpperCase()}`,
  }));

  // totals from order_summary? Use order fields if present
  const currency = String(order?.currency_code || 'eur').toUpperCase();
  const total = order?.total != null ? (Number(order.total) / 100).toFixed(2) : '0.00';
  const subtotal = order?.subtotal != null ? (Number(order.subtotal) / 100).toFixed(2) : total;
  const shipping = order?.shipping_total != null ? (Number(order.shipping_total) / 100).toFixed(2) : '0.00';
  const tax = order?.tax_total != null ? (Number(order.tax_total) / 100).toFixed(2) : '0.00';

  const rendered = renderOrderConfirmation({
    firstName: order?.shipping_address?.first_name || order?.customer?.first_name || '',
    orderNumber: order?.display_id ? `#${order.display_id}` : order?.id,
    orderDate: order?.created_at ? new Date(order.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
    items,
    subtotal: `${subtotal} ${currency}`,
    shipping: `${shipping} ${currency}`,
    tax: `${tax} ${currency}`,
    total: `${total} ${currency}`,
    currency,
    paymentStatus: order?.payment_status || 'not_paid',
    orderStatus: order?.status || 'pending',
  });

  const result = await sendTemplatedEmail({
    to: order?.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    notificationType: 'order_confirmation',
    reference: ref,
  });
  recordNotification({ type: 'order_confirmation', reference: ref, messageId: result.messageId, timestamp: result.timestamp });

  return NextResponse.json({ accepted: result.accepted, messageId: result.messageId, error: result.error, duplicate: false });
}