import { NextResponse } from 'next/server';
import { renderWelcome } from '@/lib/email/welcome';
import { sendTemplatedEmail } from '@/lib/email/ses';
import { acquireNotification, markNotificationSent, markNotificationFailed } from '@/lib/email/notification-store';

const MEDUSA = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9050';
const PK = process.env.MEDUSA_PUBLISHABLE_KEY || 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5';

export async function POST(request: Request) {
  const { email, password, first_name, last_name } = await request.json();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  // 1. Register auth identity
  const regRes = await fetch(`${MEDUSA}/auth/customer/emailpass/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK },
    body: JSON.stringify({ email: normalizedEmail, password }),
  });
  const regData = await regRes.json().catch(() => ({}));
  if (!regRes.ok) {
    return NextResponse.json(regData, { status: regRes.status });
  }
  const regToken = regData.token;

  // 2. Create customer record
  let customerId: string | null = null;
  try {
    const custRes = await fetch(`${MEDUSA}/store/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK, 'Authorization': `Bearer ${regToken}` },
      body: JSON.stringify({ email: normalizedEmail, first_name, last_name }),
    });
    const custData = await custRes.json().catch(() => ({}));
    customerId = custData?.customer?.id || custData?.id || null;
  } catch {}

  // 3. Login to obtain customer-bound token
  const loginRes = await fetch(`${MEDUSA}/auth/customer/emailpass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK },
    body: JSON.stringify({ email: normalizedEmail, password }),
  });
  const loginData = await loginRes.json().catch(() => ({}));
  if (!loginRes.ok) {
    return NextResponse.json(loginData, { status: loginRes.status });
  }
  const token = typeof loginData === 'string' ? loginData : loginData.token;

  // 4. Send welcome email exactly once after genuine successful new customer creation.
  const welcomeRef = `welcome:${normalizedEmail}`;
  let sesMessageId: string | null = null;
  let sesAccepted = false;
  let sesError: string | null = null;

  const acq = await acquireNotification({
    type: 'welcome',
    dedupKey: welcomeRef,
    recipient: normalizedEmail,
    payload: { firstName: first_name },
    maxAttempts: 5,
  });

  if (acq.acquired) {
    const rendered = renderWelcome({ firstName: first_name });
    const result = await sendTemplatedEmail({
      to: normalizedEmail,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      notificationType: 'welcome',
      reference: welcomeRef,
    });
    if (result.accepted) {
      await markNotificationSent(acq.id, result.messageId);
      sesMessageId = result.messageId;
      sesAccepted = true;
      sesError = null;
    } else {
      await markNotificationFailed(acq.id, result.error || 'SES send failed', 60000);
      sesMessageId = null;
      sesAccepted = false;
      sesError = result.error;
    }
  } else if (acq.reason === 'already_sent') {
    sesAccepted = true;
    sesError = 'Already notified';
    sesMessageId = acq.messageId;
  } else {
    sesAccepted = false;
    sesError = `Not sent: ${acq.reason}`;
  }

  return NextResponse.json({ token, verification_required: loginData?.verification_required, customerId, sesMessageId, sesAccepted, sesError });
}
