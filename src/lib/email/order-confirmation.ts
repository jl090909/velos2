import { layout, escapeHtml } from './layout';
import { OrderConfirmationEmailData, EmailRenderResult } from './types';

export function renderOrderConfirmation(data: OrderConfirmationEmailData): EmailRenderResult {
  const subject = `VelosShield Order Confirmation | ${data.orderNumber}`;
  const preheader = `Your order ${data.orderNumber} has been received.`;

  const rows = data.items.map((it) => `
<tr>
  <td style="padding:8px;border-bottom:1px solid #eee;font-size:14px;">${escapeHtml(it.title)}</td>
  <td style="padding:8px;border-bottom:1px solid #eee;font-size:14px;text-align:center;">${it.quantity}</td>
  <td style="padding:8px;border-bottom:1px solid #eee;font-size:14px;text-align:right;">${escapeHtml(it.amount)}</td>
</tr>`).join('');

  const body = `
<h1 style="margin:0 0 12px 0;font-size:22px;color:#003C64;">Order Confirmation</h1>
<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;">Hello ${escapeHtml(data.firstName || 'there')},</p>
<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;">Thank you for your order. Here is a summary of your purchase.</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:12px 0;">
  <tr style="background:#f4f6f8;">
    <th style="padding:8px;text-align:left;font-size:13px;">Product</th>
    <th style="padding:8px;text-align:center;font-size:13px;">Qty</th>
    <th style="padding:8px;text-align:right;font-size:13px;">Amount</th>
  </tr>
  ${rows}
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px 0;">
  <tr><td style="font-size:14px;padding:4px 0;">Subtotal</td><td style="font-size:14px;padding:4px 0;text-align:right;">${escapeHtml(data.subtotal)}</td></tr>
  <tr><td style="font-size:14px;padding:4px 0;">Shipping</td><td style="font-size:14px;padding:4px 0;text-align:right;">${escapeHtml(data.shipping)}</td></tr>
  <tr><td style="font-size:14px;padding:4px 0;">Tax</td><td style="font-size:14px;padding:4px 0;text-align:right;">${escapeHtml(data.tax)}</td></tr>
  <tr><td style="font-size:15px;font-weight:bold;padding:8px 0;border-top:2px solid #003C64;">Total (${escapeHtml(data.currency.toUpperCase())})</td><td style="font-size:15px;font-weight:bold;padding:8px 0;border-top:2px solid #003C64;text-align:right;">${escapeHtml(data.total)}</td></tr>
</table>

<p style="margin:0 0 6px 0;font-size:14px;"><strong>Order reference:</strong> ${escapeHtml(data.orderNumber)}</p>
<p style="margin:0 0 6px 0;font-size:14px;"><strong>Order date:</strong> ${escapeHtml(data.orderDate)}</p>
<p style="margin:0 0 6px 0;font-size:14px;"><strong>Order status:</strong> ${escapeHtml(data.orderStatus)}</p>
<p style="margin:0 0 16px 0;font-size:14px;"><strong>Payment status:</strong> ${escapeHtml(data.paymentStatus)}</p>

<p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;">What happens next?</p>
<p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;">For VelosShield Core, fulfilment, shipment and deployment details will follow when applicable.</p>
<p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;">For VelosShield Insights, licence activation and onboarding instructions will follow once the entitlement is provisioned.</p>

<p style="margin:0 0 0 0;font-size:14px;line-height:1.6;">Need help? Contact <a href="mailto:demo@velosshield.com" style="color:#003C64;">demo@velosshield.com</a> or visit our <a href="https://www.velosshield.com/company/contact/" style="color:#003C64;">contact page</a>. Please quote your order reference so we can locate your order.</p>
`;

  const html = layout('Order Confirmation', body, preheader);

  const textLines = [
    `Order Confirmation`,
    ``,
    `Hello ${data.firstName || 'there'},`,
    ``,
    `Thank you for your order. Summary:`,
    ...data.items.map((it) => `${it.title} x${it.quantity} - ${it.amount}`),
    ``,
    `Subtotal: ${data.subtotal}`,
    `Shipping: ${data.shipping}`,
    `Tax: ${data.tax}`,
    `Total (${data.currency.toUpperCase()}): ${data.total}`,
    ``,
    `Order reference: ${data.orderNumber}`,
    `Order date: ${data.orderDate}`,
    `Order status: ${data.orderStatus}`,
    `Payment status: ${data.paymentStatus}`,
    ``,
    `What happens next?`,
    `For VelosShield Core, fulfilment, shipment and deployment details will follow when applicable.`,
    `For VelosShield Insights, licence activation and onboarding instructions will follow once the entitlement is provisioned.`,
    ``,
    `Need help? Contact demo@velosshield.com or visit https://www.velosshield.com/company/contact/`,
  ];

  return { subject, html, text: textLines.join('\n') };
}