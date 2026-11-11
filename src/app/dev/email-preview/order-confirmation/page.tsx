import { renderOrderConfirmation } from '@/lib/email/order-confirmation';

export default function OrderPreview() {
  if (process.env.NODE_ENV === 'production') {
    return <p>Not available</p>;
  }
  const r = renderOrderConfirmation({
    firstName: 'Lionel',
    orderNumber: '#3',
    orderDate: new Date().toLocaleDateString(),
    items: [{ title: 'VelosShield Core', quantity: 24, unitPrice: '', amount: '2400.00 EUR' }],
    subtotal: '2400.00 EUR',
    shipping: '0.10 EUR',
    tax: '0.00 EUR',
    total: '2400.10 EUR',
    currency: 'EUR',
    paymentStatus: 'authorized',
    orderStatus: 'pending',
  });
  return (
    <div>
      <p><strong>Subject:</strong> {r.subject}</p>
      <div dangerouslySetInnerHTML={{ __html: r.html }} />
    </div>
  );
}