import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

function loadEnv() {
  try {
    for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
      const i = line.indexOf('=');
      if (i > 0 && !(line.slice(0, i) in process.env)) process.env[line.slice(0, i)] = line.slice(i + 1);
    }
  } catch {}
}
loadEnv();

const BASE = process.env.BASE_URL || 'http://127.0.0.1:9052';
const SECRET = process.env.ORDER_CONFIRMATION_WEBHOOK_SECRET || '';

describe('email preview pages', () => {
  test('welcome preview returns 200 and contains branded content', async () => {
    const r = await fetch(`${BASE}/dev/email-preview/welcome`);
    assert.equal(r.status, 200);
    const html = await r.text();
    assert.match(html, /Welcome to VelosShield/);
    assert.match(html, /noreply@rathon.ai|velosshield\.com/);
  });
  test('order-confirmation preview returns 200', async () => {
    const r = await fetch(`${BASE}/dev/email-preview/order-confirmation`);
    assert.equal(r.status, 200);
    const html = await r.text();
    assert.match(html, /Order Confirmation/);
  });
});

describe('order-confirmation route authz', () => {
  test('no secret -> 401', async () => {
    const r = await fetch(`${BASE}/api/commerce/notifications/order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: 'order_test' }),
    });
    assert.equal(r.status, 401);
  });
  test('wrong secret -> 401', async () => {
    const r = await fetch(`${BASE}/api/commerce/notifications/order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-velos-internal-secret': 'wrong' },
      body: JSON.stringify({ orderId: 'order_test' }),
    });
    assert.equal(r.status, 401);
  });
  test('correct secret but missing orderId -> 400', async (t) => {
    if (!SECRET) return t.skip('ORDER_CONFIRMATION_WEBHOOK_SECRET not available');
    const r = await fetch(`${BASE}/api/commerce/notifications/order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-velos-internal-secret': SECRET },
      body: JSON.stringify({}),
    });
    assert.equal(r.status, 400);
  });
  test('GET method -> 405', async () => {
    const r = await fetch(`${BASE}/api/commerce/notifications/order-confirmation`, {
      method: 'GET',
      headers: { 'x-velos-internal-secret': SECRET },
    });
    assert.equal(r.status, 405);
  });
});

describe('health', () => {
  test('medusa health ok', async () => {
    const r = await fetch('http://127.0.0.1:9050/health');
    assert.equal(r.status, 200);
    const t = await r.text();
    assert.match(t, /OK/);
  });
  test('next home ok', async () => {
    const r = await fetch(`${BASE}/`);
    assert.ok(r.status === 200 || r.status === 304);
  });
});
