import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import {
  acquireNotification,
  markNotificationSent,
  markNotificationFailed,
  getNotificationByKey,
  closeNotificationPool,
} from '../src/lib/email/notification-store';

test('notification store: acquire, mark sent, and duplicate detection', async () => {
  const key = `test:sent:${randomUUID()}`;
  const first = await acquireNotification({ type: 'welcome', dedupKey: key, recipient: 'a@example.com', maxAttempts: 3 });
  assert.equal(first.acquired, true);
  if (!first.acquired) throw new Error('expected acquired');
  await markNotificationSent(first.id, 'msg-1');
  const row = await getNotificationByKey(key);
  assert.equal(row?.status, 'sent');
  assert.equal(row?.message_id, 'msg-1');
  const second = await acquireNotification({ type: 'welcome', dedupKey: key, recipient: 'a@example.com', maxAttempts: 3 });
  assert.equal(second.acquired, false);
  if (second.acquired) throw new Error('expected not acquired');
  assert.equal(second.reason, 'already_sent');
  assert.equal(second.messageId, 'msg-1');
});

test('notification store: failed notification can be retried', async () => {
  const key = `test:retry:${randomUUID()}`;
  const first = await acquireNotification({ type: 'order_confirmation', dedupKey: key, recipient: 'b@example.com', maxAttempts: 3 });
  assert.equal(first.acquired, true);
  if (!first.acquired) throw new Error('expected acquired');
  await markNotificationFailed(first.id, 'SES timeout', 1000);
  const row = await getNotificationByKey(key);
  assert.equal(row?.status, 'failed');
  assert.equal(row?.attempts, 1);
  const retry = await acquireNotification({ type: 'order_confirmation', dedupKey: key, recipient: 'b@example.com', maxAttempts: 3 });
  assert.equal(retry.acquired, true);
});

test('notification store: exhausted notification is not retried', async () => {
  const key = `test:dead:${randomUUID()}`;
  const first = await acquireNotification({ type: 'welcome', dedupKey: key, recipient: 'c@example.com', maxAttempts: 2 });
  assert.equal(first.acquired, true);
  if (!first.acquired) throw new Error('expected acquired');
  await markNotificationFailed(first.id, 'fail 1', 1000);
  const retry = await acquireNotification({ type: 'welcome', dedupKey: key, recipient: 'c@example.com', maxAttempts: 2 });
  assert.equal(retry.acquired, true);
  if (!retry.acquired) throw new Error('expected retry acquired');
  await markNotificationFailed(retry.id, 'fail 2', 1000);
  const final = await acquireNotification({ type: 'welcome', dedupKey: key, recipient: 'c@example.com', maxAttempts: 2 });
  assert.equal(final.acquired, false);
  if (final.acquired) throw new Error('expected not acquired');
  assert.equal(final.reason, 'exhausted');
});

test('notification store: concurrent acquire allows only one claim', async () => {
  const key = `test:concurrency:${randomUUID()}`;
  const [a, b] = await Promise.all([
    acquireNotification({ type: 'welcome', dedupKey: key, recipient: 'd@example.com', maxAttempts: 3 }),
    acquireNotification({ type: 'welcome', dedupKey: key, recipient: 'd@example.com', maxAttempts: 3 }),
  ]);
  const acquiredCount = [a, b].filter((x) => x.acquired).length;
  assert.equal(acquiredCount, 1);
});

test.after(async () => {
  await closeNotificationPool();
});
