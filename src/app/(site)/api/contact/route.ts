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

/** Only same-site pages may be used as the post-submit redirect target. */
const RETURN_TARGETS: Record<string, string> = {
  demo: '/demo',
  contact: '/company/contact',
  partner: '/partners',
};

type FormKind = keyof typeof RETURN_TARGETS;

const isFormKind = (value: string): value is FormKind => Object.hasOwn(RETURN_TARGETS, value);

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);

  const declaredKind = clean(form?.get('formType'));
  const nextRaw = clean(form?.get('next'));
  const kind: FormKind = isFormKind(declaredKind)
    ? declaredKind
    : nextRaw === '/company/contact'
      ? 'contact'
      : nextRaw === '/partners'
        ? 'partner'
        : 'demo';
  const target = RETURN_TARGETS[kind];

  const fail = () => NextResponse.redirect(new URL(`${target}/?sent=error`, req.url), 303);
  const ok = () => NextResponse.redirect(new URL(`${target}/?sent=success`, req.url), 303);

  if (!form) return fail();

  // Honeypot: pretend success for bots
  if (String(form.get('website') ?? '').trim() !== '') return ok();

  const name = clean(form.get('name'));
  const email = clean(form.get('email'));

  const fields: Array<[string, string]> = [];
  let subject = '';

  if (kind === 'partner') {
    const company = clean(form.get('company'));
    const orgType = clean(form.get('orgType'));
    const industries = clean(form.get('industries'));
    const otExperience = clean(form.get('otExperience'));
    const regions = clean(form.get('regions'));
    const website = clean(form.get('companyWebsite'));
    const message = clean(form.get('message'));
    const consent = String(form.get('consent') ?? '') !== '';

    if (name === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || company === '' || !consent) return fail();

    subject = `Velos Shield partnership enquiry — ${company.slice(0, 100)}`;
    fields.push(
      ['Enquiry type', 'OT partnership'],
      ['Name', name],
      ['Work email', email],
      ['Company', company],
      ['Website', website],
      ['Organisation type', orgType],
      ['Industries served', industries],
      ['OT experience', otExperience],
      ['Regions covered', regions],
      ['What they want to do', message],
      ['Consent to be contacted', consent ? 'yes' : 'no'],
    );
  } else {
    const org = clean(form.get('organization'));
    const role = clean(form.get('role'));
    const industry = clean(form.get('industry'));
    const sites = clean(form.get('sites'));
    const goal = clean(form.get('goal'));

    if (name === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail();

    subject = kind === 'contact'
      ? `Velos Shield contact message — ${name.slice(0, 120)}`
      : `Velos Shield demo request — ${name.slice(0, 120)}`;
    fields.push(
      ['Name', name],
      ['Email', email],
      ['Organization', org],
      ['Role', role],
      ['Industry', industry],
      ['OT sites', sites],
      ['Goal', goal],
    );
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return fail();

  const region = process.env.AWS_REGION || 'eu-west-1';
  const from = process.env.SES_FROM || '';
  const keyId = process.env.AWS_ACCESS_KEY_ID || '';
  const secret = process.env.AWS_SECRET_ACCESS_KEY || '';
  // CONTACT_TO may list several recipients ("a@x.com, b@y.com"). SES accepts an array of
  // destinations but rejects a comma-joined single entry, so split and validate here.
  const recipients = (process.env.CONTACT_TO || '')
    .split(/[,;\s]+/)
    .map((entry) => entry.trim())
    .filter((entry) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(entry));
  if (!from || recipients.length === 0 || !keyId || !secret) {
    console.error('contact api: missing SES env config, or CONTACT_TO has no valid recipient');
    return fail();
  }

  const heading = kind === 'partner'
    ? 'New partnership enquiry (velosshield.com)'
    : kind === 'contact'
      ? 'New contact message (velosshield.com)'
      : 'New demo request (velosshield.com)';

  const body = [heading, '================================', '', ...fields.map(([label, value]) => `${(label + ':').padEnd(26)}${value}`)].join('\n');

  try {
    const ses = new SESClient({ region, credentials: { accessKeyId: keyId, secretAccessKey: secret } });
    await ses.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: recipients },
        ReplyToAddresses: [email],
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
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
