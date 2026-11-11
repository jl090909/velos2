import { test } from 'node:test';
import assert from 'node:assert/strict';

import { renderWelcome } from '../src/lib/email/welcome';
import { renderOrderConfirmation } from '../src/lib/email/order-confirmation';

const FORBIDDEN_EMAIL_URLS = ['localhost', '127.0.0.1', '/account'];

test('welcome template contains branded content and production links only', () => {
  const r = renderWelcome({ firstName: 'Alice' });
  assert.match(r.subject, /Welcome to VelosShield/);
  assert.match(r.html, /noreply@rathon\.ai|velosshield\.com/);
  assert.match(r.text, /noreply@rathon\.ai|velosshield\.com/);
  for (const bad of FORBIDDEN_EMAIL_URLS) {
    assert.ok(!r.html.includes(bad) && !r.text.includes(bad), `welcome contains forbidden ${bad}`);
  }
  assert.match(r.html, /https:\/\/www\.velosshield\.com\/product\/org-level\//);
  assert.match(r.html, /https:\/\/www\.velosshield\.com\/demo\//);
});

test('order confirmation template renders items and totals', () => {
  const r = renderOrderConfirmation({
    firstName: 'Bob',
    orderNumber: '#123',
    orderDate: '01/01/2026',
    items: [{ title: 'VelosShield Core', quantity: 2, unitPrice: '10.00 EUR', amount: '20.00 EUR' }],
    subtotal: '20.00 EUR',
    shipping: '5.00 EUR',
    tax: '1.00 EUR',
    total: '26.00 EUR',
    currency: 'EUR',
    paymentStatus: 'captured',
    orderStatus: 'completed',
  });
  assert.match(r.subject, /Order Confirmation/);
  assert.match(r.html, /VelosShield Core/);
  assert.match(r.html, /26\.00 EUR/);
  for (const bad of FORBIDDEN_EMAIL_URLS) {
    assert.ok(!r.html.includes(bad) && !r.text.includes(bad), `order confirmation contains forbidden ${bad}`);
  }
});

test('templates escape HTML in dynamic values', () => {
  const r = renderWelcome({ firstName: '<script>alert(1)</script>' });
  assert.ok(!r.html.includes('<script>alert(1)</script>'));
  assert.match(r.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});
