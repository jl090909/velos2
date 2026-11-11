// Backwards-compatible shim. New code should use notification-store directly.
import { getNotificationByKey } from './notification-store';

export async function alreadyNotified(type: string, reference: string): Promise<boolean> {
  const row = await getNotificationByKey(reference);
  return !!row && row.status === 'sent';
}

export async function recordNotification(entry: { type: string; reference: string; messageId: string | null; timestamp: string }): Promise<void> {
  // no-op shim: store records via acquire/mark. Kept for compatibility.
  return;
}
