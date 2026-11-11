/* eslint-disable */
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";

const ALLOWED_PAYMENT_STATUSES = new Set(["captured", "partially_captured", "authorized"]);
const BLOCKED_ORDER_STATUSES = new Set(["canceled", "archived", "failed"]);

const MAX_TRIGGER_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requiredEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value || !value.trim()) return undefined;
  return value.trim();
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = data?.id;
  if (!orderId) return;

  const logger = container.resolve("logger") as {
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
  };

  const medusaUrl = requiredEnv("MEDUSA_BACKEND_URL");
  const publishableKey = requiredEnv("MEDUSA_PUBLISHABLE_KEY");
  const nextAppUrl = requiredEnv("NEXT_APP_URL");
  const secret = requiredEnv("ORDER_CONFIRMATION_WEBHOOK_SECRET");

  if (!medusaUrl || !publishableKey || !nextAppUrl || !secret) {
    logger.error(
      "[email] missing required env (MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY, NEXT_APP_URL, ORDER_CONFIRMATION_WEBHOOK_SECRET); cannot trigger order confirmation email"
    );
    return;
  }

  let order: any;
  try {
    const res = await fetch(`${medusaUrl}/store/orders/${orderId}`, {
      headers: { "x-publishable-api-key": publishableKey },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      logger.warn(`[email] could not load order ${orderId}: ${res.status}`);
      return;
    }
    order = json?.order || json;
  } catch (e) {
    logger.error(`[email] failed to load order ${orderId}: ${e instanceof Error ? e.message : e}`);
    return;
  }

  if (!order?.id) {
    logger.warn(`[email] order ${orderId} not found in Medusa response`);
    return;
  }

  const paymentStatus = String(order?.payment_status || "").toLowerCase();
  const orderStatus = String(order?.status || "").toLowerCase();

  if (!ALLOWED_PAYMENT_STATUSES.has(paymentStatus)) {
    logger.info(`[email] skipping order ${orderId}: payment_status=${paymentStatus}`);
    return;
  }
  if (BLOCKED_ORDER_STATUSES.has(orderStatus)) {
    logger.info(`[email] skipping order ${orderId}: order_status=${orderStatus}`);
    return;
  }

  for (let attempt = 1; attempt <= MAX_TRIGGER_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${nextAppUrl}/api/commerce/notifications/order-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-velos-internal-secret": secret,
        },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        logger.info(`[email] order-confirmation triggered for ${orderId}`);
        return;
      }
      const text = await res.text().catch(() => "");
      if (res.status >= 400 && res.status < 500) {
        logger.warn(`[email] order-confirmation trigger rejected ${res.status}: ${text.slice(0, 300)}`);
        return;
      }
      logger.warn(`[email] order-confirmation trigger failed ${res.status}: ${text.slice(0, 300)}`);
    } catch (e) {
      logger.error(`[email] order-confirmation trigger error: ${e instanceof Error ? e.message : e}`);
    }

    if (attempt < MAX_TRIGGER_ATTEMPTS) {
      await sleep(BASE_BACKOFF_MS * attempt);
    }
  }

  logger.error(`[email] order-confirmation trigger failed after ${MAX_TRIGGER_ATTEMPTS} attempts for ${orderId}`);
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
