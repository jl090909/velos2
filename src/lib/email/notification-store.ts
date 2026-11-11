import { Pool } from 'pg';

let pool: Pool | null = null;
let schemaReady = false;

function requireEmailDatabaseUrl(): string {
  const url = process.env.EMAIL_DATABASE_URL;
  if (!url || !url.trim()) {
    throw new Error('EMAIL_DATABASE_URL is required for durable email notification state; refusing to use a fallback database URL.');
  }
  return url.trim();
}

function getPool(): Pool {
  if (pool) return pool;
  pool = new Pool({ connectionString: requireEmailDatabaseUrl(), max: 5 });
  return pool;
}

export async function ensureNotificationSchema(): Promise<void> {
  if (schemaReady) return;
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS email_notifications (
      id SERIAL PRIMARY KEY,
      notification_type TEXT NOT NULL,
      dedup_key TEXT NOT NULL UNIQUE,
      recipient TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0,
      max_attempts INTEGER NOT NULL DEFAULT 5,
      next_retry_at TIMESTAMPTZ,
      lease_until TIMESTAMPTZ,
      locked_by TEXT,
      message_id TEXT,
      last_error TEXT,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await p.query(`CREATE INDEX IF NOT EXISTS email_notifications_status_idx ON email_notifications(status);`);
  await p.query(`CREATE INDEX IF NOT EXISTS email_notifications_retry_idx ON email_notifications(next_retry_at);`);
  schemaReady = true;
}

export type AcquireResult =
  | { acquired: true; id: number }
  | { acquired: false; reason: 'already_sent' | 'exhausted' | 'in_flight' | 'not_found'; id: number | null; messageId: string | null };

export async function acquireNotification(params: {
  type: 'welcome' | 'order_confirmation';
  dedupKey: string;
  recipient: string;
  payload?: Record<string, unknown>;
  maxAttempts?: number;
  workerId?: string;
}): Promise<AcquireResult> {
  await ensureNotificationSchema();
  const p = getPool();
  const maxAttempts = params.maxAttempts ?? 5;
  const workerId = params.workerId ?? `worker-${process.pid}-${Date.now()}`;

  // Insert if absent.
  await p.query(
    `INSERT INTO email_notifications (notification_type, dedup_key, recipient, payload, max_attempts, status)
     VALUES ($1,$2,$3,$4::jsonb,$5,'pending')
     ON CONFLICT (dedup_key) DO NOTHING`,
    [params.type, params.dedupKey, params.recipient, JSON.stringify(params.payload ?? {}), maxAttempts]
  );

  const sel = await p.query(
    `SELECT id, status, attempts, max_attempts, lease_until, message_id FROM email_notifications WHERE dedup_key=$1`,
    [params.dedupKey]
  );
  if (sel.rowCount === 0) return { acquired: false, reason: 'not_found', id: null, messageId: null };
  const row = sel.rows[0];
  if (row.status === 'sent') return { acquired: false, reason: 'already_sent', id: row.id, messageId: row.message_id };
  if (row.status === 'dead' || row.attempts >= row.max_attempts) return { acquired: false, reason: 'exhausted', id: row.id, messageId: null };
  if (row.status === 'processing' && row.lease_until && new Date(row.lease_until).getTime() > Date.now()) {
    return { acquired: false, reason: 'in_flight', id: row.id, messageId: null };
  }

  const claim = await p.query(
    `UPDATE email_notifications
     SET status='processing', lease_until=now() + interval '60 seconds', locked_by=$2, updated_at=now()
     WHERE id=$1
       AND status NOT IN ('sent','dead')
       AND (status <> 'processing' OR lease_until IS NULL OR lease_until < now())
     RETURNING id`,
    [row.id, workerId]
  );
  if (claim.rowCount === 0) {
    // Re-check in case status changed.
    const r2 = await p.query(`SELECT status, message_id FROM email_notifications WHERE id=$1`, [row.id]);
    if (r2.rows[0]?.status === 'sent') return { acquired: false, reason: 'already_sent', id: row.id, messageId: r2.rows[0].message_id };
    return { acquired: false, reason: 'in_flight', id: row.id, messageId: null };
  }
  return { acquired: true, id: row.id };
}

export async function markNotificationSent(id: number, messageId: string | null): Promise<void> {
  await ensureNotificationSchema();
  const p = getPool();
  await p.query(
    `UPDATE email_notifications
     SET status='sent', message_id=$2, attempts=attempts+1, lease_until=NULL, locked_by=NULL, last_error=NULL, updated_at=now()
     WHERE id=$1`,
    [id, messageId]
  );
}

export async function markNotificationFailed(id: number, error: string, retryDelayMs = 60000): Promise<void> {
  await ensureNotificationSchema();
  const p = getPool();
  const r = await p.query(`SELECT attempts, max_attempts FROM email_notifications WHERE id=$1`, [id]);
  if (r.rowCount === 0) return;
  const attempts = (r.rows[0].attempts as number) + 1;
  const max = r.rows[0].max_attempts as number;
  const dead = attempts >= max;
  await p.query(
    `UPDATE email_notifications
     SET status=$2, attempts=$3, last_error=$4, lease_until=NULL, locked_by=NULL,
         next_retry_at=$5, updated_at=now()
     WHERE id=$1`,
    [id, dead ? 'dead' : 'failed', attempts, error.slice(0, 2000), dead ? null : new Date(Date.now() + retryDelayMs)]
  );
}

export async function getNotificationByKey(dedupKey: string): Promise<Record<string, unknown> | null> {
  await ensureNotificationSchema();
  const p = getPool();
  const r = await p.query(`SELECT * FROM email_notifications WHERE dedup_key=$1`, [dedupKey]);
  return r.rowCount ? (r.rows[0] as Record<string, unknown>) : null;
}

export async function closeNotificationPool(): Promise<void> {
  if (pool) { await pool.end(); pool = null; schemaReady = false; }
}
