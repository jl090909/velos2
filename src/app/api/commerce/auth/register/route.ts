import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const MEDUSA = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9050';
const PK = process.env.MEDUSA_PUBLISHABLE_KEY || 'pk_514423ce34bf1aabb2ab61c13d483cf88a24685f019a8b5f2e5b4cc589ff46e5';

const ses = new SESClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const FROM = process.env.SES_FROM_EMAIL || 'noreply@rathon.ai';

async function sendWelcomeEmail(to: string, name?: string) {
  return ses.send(new SendEmailCommand({
    Source: FROM,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: 'Welcome to Velos Shield' },
      Body: {
        Text: { Data: `Hello ${name || ''},\n\nYour Velos Shield customer account has been created. You can now sign in, view orders, and manage licences.\n\nRegards,\nVelos Shield` },
        Html: { Data: `<p>Hello ${name || ''},</p><p>Your Velos Shield customer account has been created. You can now sign in, view orders, and manage licences.</p><p>Regards,<br/>Velos Shield</p>` },
      },
    },
  }));
}

export async function POST(request: Request) {
  const { email, password, first_name, last_name } = await request.json();

  // 1. Register auth identity
  const regRes = await fetch(`${MEDUSA}/auth/customer/emailpass/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK },
    body: JSON.stringify({ email, password }),
  });
  const regData = await regRes.json().catch(() => ({}));
  if (!regRes.ok) {
    return NextResponse.json(regData, { status: regRes.status });
  }
  const regToken = regData.token;

  // 2. Create customer record
  try {
    await fetch(`${MEDUSA}/store/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK, 'Authorization': `Bearer ${regToken}` },
      body: JSON.stringify({ email, first_name, last_name }),
    });
  } catch {}

  // 3. Login to obtain customer-bound token
  const loginRes = await fetch(`${MEDUSA}/auth/customer/emailpass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PK },
    body: JSON.stringify({ email, password }),
  });
  const loginData = await loginRes.json().catch(() => ({}));
  if (!loginRes.ok) {
    return NextResponse.json(loginData, { status: loginRes.status });
  }
  const token = typeof loginData === 'string' ? loginData : loginData.token;

  // 4. Send welcome email via AWS SES (best effort)
  let sesMessageId: string | null = null;
  let sesError: string | null = null;
  try {
    const out = await sendWelcomeEmail(email, first_name);
    sesMessageId = (out as { MessageId?: string })?.MessageId || null;
    console.log('SES welcome email accepted, MessageId:', sesMessageId, 'recipient:', email);
  } catch (e: unknown) {
    sesError = e instanceof Error ? e.message : String(e);
    console.error('SES send failed:', sesError);
  }

  return NextResponse.json({ token, verification_required: loginData?.verification_required, sesMessageId, sesError });
}
