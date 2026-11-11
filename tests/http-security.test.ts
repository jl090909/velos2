import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

function loadEnv() {
  try {
    for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
      const i = line.indexOf('=');
      if (i > 0) {
        const k = line.slice(0, i);
        const v = line.slice(i + 1);
        if (!(k in process.env)) process.env[k] = v;
      }
    }
  } catch {}
}
loadEnv();

const BASE = process.env.BASE_URL || 'http://127.0.0.1:9052';
const SECRET = process.env.ORDER_CONFIRMATION_WEBHOOK_SECRET || '';

test('email preview pages are reachable and branded', async () => {
  const welcome = await fetch(`${BASE}/dev/email-preview/welcome`);
  assert.equal(welcome.status, 200);
  const welcomeHtml = await welcome.text();
  assert.match(welcomeHtml, /Welcome to VelosShield/);

  const order = await fetch(`${BASE}/dev/email-preview/order-confirmation`);
  assert.equal(order.status, 200);
  const orderHtml = await order.text();
  assert.match(orderHtml, /Order Confirmation/);
});

test('order-confirmation route fails closed without secret', async () => {
  const r = await fetch(`${BASE}/api/commerce/notifications/order-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: 'order_test' }),
  });
  assert.equal(r.status, 401);
});

test('order-confirmation route rejects wrong secret', async () => {
  const r = await fetch(`${BASE}/api/commerce/notifications/order-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-velos-internal-secret': 'wrong' },
    body: JSON.stringify({ orderId: 'order_test' }),
  });
  assert.equal(r.status, 401);
});

test('order-confirmation route requires orderId when authorized', async (t) => {
  if (!SECRET) return t.skip('ORDER_CONFIRMATION_WEBHOOK_SECRET not available');
  const r = await fetch(`${BASE}/api/commerce/notifications/order-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-velos-internal-secret': SECRET },
    body: JSON.stringify({}),
  });
  assert.equal(r.status, 400);
});

test('order-confirmation route rejects invalid orderId', async (t) => {
  if (!SECRET) return t.skip('ORDER_CONFIRMATION_WEBHOOK_SECRET not available');
  const r = await fetch(`${BASE}/api/commerce/notifications/order-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-velos-internal-secret': SECRET },
    body: JSON.stringify({ orderId: '../bad' }),
  });
  assert.equal(r.status, 400);
});

test('order-confirmation route rejects GET', async (t) => {
  if (!SECRET) return t.skip('ORDER_CONFIRMATION_WEBHOOK_SECRET not available');
  const r = await fetch(`${BASE}/api/commerce/notifications/order-confirmation`, {
    method: 'GET',
    headers: { 'x-velos-internal-secret': SECRET },
  });
  assert.equal(r.status, 405);
});

test('health endpoints are reachable', async () => {
  const medusa = await fetch('http://127.0.0.1:9050/health');
  assert.equal(medusa.status, 200);
  const next = await fetch(`${BASE}/`);
  assert.ok(next.status === 200 || next.status === 304);
});
