import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export const runtime = 'nodejs';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now > cur.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  cur.count += 1;
  return cur.count > MAX_PER_WINDOW;
}

function clean(v: unknown): string {
  return String(v ?? '').replace(/[<>\r\n]+/g, ' ').trim().slice(0, 2000);
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const rawNext = String(form?.get('next') ?? '');
  const target = rawNext === '/company/contact' ? '/company/contact' : '/demo';
  const fail = () => NextResponse.redirect(new URL(`${target}/?sent=error`, req.url), 303);
  const ok = () => NextResponse.redirect(new URL(`${target}/?sent=success`, req.url), 303);

  if (!form) return fail();

  // Honeypot: pretend success for bots
  if (String(form.get('website') ?? '').trim() !== '') return ok();

  const name = clean(form.get('name'));
  const email = clean(form.get('email'));
  const org = clean(form.get('organization'));
  const role = clean(form.get('role'));
  const industry = clean(form.get('industry'));
  const sites = clean(form.get('sites'));
  const goal = clean(form.get('goal'));

  if (name === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail();

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return fail();

  const region = process.env.AWS_REGION || 'eu-west-1';
  const from = process.env.SES_FROM || '';
  const to = process.env.CONTACT_TO || '';
  const keyId = process.env.AWS_ACCESS_KEY_ID || '';
  const secret = process.env.AWS_SECRET_ACCESS_KEY || '';
  if (!from || !to || !keyId || !secret) {
    console.error('contact api: missing SES env config');
    return fail();
  }

  const body = [
    'New demo request (velosshield.com)',
    '================================',
    '',
    `Name:         ${name}`,
    `Email:        ${email}`,
    `Organization: ${org}`,
    `Role:         ${role}`,
    `Industry:     ${industry}`,
    `OT sites:     ${sites}`,
    `Goal:         ${goal}`,
  ].join('\n');

  try {
    const ses = new SESClient({ region, credentials: { accessKeyId: keyId, secretAccessKey: secret } });
    await ses.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        ReplyToAddresses: [email],
        Message: {
          Subject: { Data: `Velos Shield demo request — ${name.slice(0, 120)}`, Charset: 'UTF-8' },
          Body: { Text: { Data: body, Charset: 'UTF-8' } },
        },
      })
    );
    return ok();
  } catch (err) {
    console.error('contact api: SES send failed', err);
    return fail();
  }
}
