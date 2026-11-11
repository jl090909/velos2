import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { renderOrderConfirmation } from '@/lib/email/order-confirmation';
import { sendTemplatedEmail } from '@/lib/email/ses';
import { acquireNotification, markNotificationSent, markNotificationFailed } from '@/lib/email/notification-store';

const MEDUSA = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9050';
const PK = process.env.MEDUSA_PUBLISHABLE_KEY || 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5';
const WEBHOOK_SECRET = process.env.ORDER_CONFIRMATION_WEBHOOK_SECRET;

const ALLOWED_PAYMENT_STATUSES = new Set(['captured', 'partially_captured', 'authorized']);

function isAuthorized(request: Request): boolean {
  if (!WEBHOOK_SECRET) return false;
  const h = request.headers.get('x-velos-internal-secret') || request.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : h;
  const a = Buffer.from(token);
  const b = Buffer.from(WEBHOOK_SECRET);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const orderId = String(body?.orderId || '').trim();
  if (!orderId || !/^[A-Za-z0-9_-]{1,128}$/.test(orderId)) {
    return NextResponse.json({ error: 'orderId required' }, { status: 400 });
  }

  const adminKey = process.env.MEDUSA_ADMIN_API_KEY || process.env.MEDUSA_SECRET_API_KEY;
  const headers: Record<string, string> = { 'x-publishable-api-key': PK };
  if (adminKey) headers['Authorization'] = `Bearer ${adminKey}`;

  const res = await fetch(`${MEDUSA}/store/orders/${orderId}`, { headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const order = data?.order || data;
  if (!order?.id) return NextResponse.json({ error: 'order not found' }, { status: 404 });

  const paymentStatus = String(order?.payment_status || '').toLowerCase();
  const orderStatus = String(order?.status || '').toLowerCase();

  if (!ALLOWED_PAYMENT_STATUSES.has(paymentStatus)) {
    return NextResponse.json({ accepted: false, skipped: true, reason: `payment_status=${paymentStatus}` }, { status: 200 });
  }
  if (orderStatus === 'canceled' || orderStatus === 'archived' || orderStatus === 'failed') {
    return NextResponse.json({ accepted: false, skipped: true, reason: `order_status=${orderStatus}` }, { status: 200 });
  }

  const recipient = String(order?.email || '').trim();
  if (!recipient) return NextResponse.json({ error: 'order has no email' }, { status: 400 });

  const ref = `order_confirmation:${orderId}`;
  const acq = await acquireNotification({
    type: 'order_confirmation',
    dedupKey: ref,
    recipient,
    payload: { orderId },
    maxAttempts: 5,
  });

  if (!acq.acquired) {
    if (acq.reason === 'already_sent') {
      return NextResponse.json({ accepted: true, duplicate: true, messageId: acq.messageId });
    }
    return NextResponse.json({ accepted: false, duplicate: false, reason: acq.reason }, { status: 202 });
  }

  const items = (order?.items || []).map((it: { title?: string; product_title?: string; quantity?: number; unit_price?: number }) => ({
    title: it?.title || it?.product_title || 'Item',
    quantity: Number(it?.quantity || 0),
    unitPrice: '',
    amount: `${((Number(it?.unit_price || 0) * Number(it?.quantity || 0)) / 100).toFixed(2)} ${String(order?.currency_code || '').toUpperCase()}`,
  }));

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
    to: recipient,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    notificationType: 'order_confirmation',
    reference: ref,
  });

  if (result.accepted) {
    // SES accepted the message (MessageId). This is not proof of inbox delivery.
    await markNotificationSent(acq.id, result.messageId);
  } else {
    await markNotificationFailed(acq.id, result.error || 'SES send failed', 60000);
  }

  return NextResponse.json({ accepted: result.accepted, messageId: result.messageId, error: result.error, duplicate: false });
}

export async function GET() { return NextResponse.json({ error: 'method not allowed' }, { status: 405 }); }
