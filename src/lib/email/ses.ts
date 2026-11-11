import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SendResult } from './types';

const REGION = process.env.AWS_REGION || 'eu-west-1';
const FROM = process.env.SES_FROM_EMAIL || 'noreply@rathon.ai';
const REPLY_TO = process.env.SES_REPLY_TO || 'demo@velosshield.com';

const client = new SESClient({ region: REGION });

export async function sendTemplatedEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  notificationType: 'welcome' | 'order_confirmation';
  reference: string;
}): Promise<SendResult> {
  const timestamp = new Date().toISOString();
  try {
    const out = await client.send(new SendEmailCommand({
      Source: `VelosShield <${FROM}>`,
      ReplyToAddresses: [REPLY_TO],
      Destination: { ToAddresses: [params.to] },
      Message: {
        Subject: { Data: params.subject },
        Body: {
          Html: { Data: params.html },
          Text: { Data: params.text },
        },
      },
    }));
    return {
      notificationType: params.notificationType,
      reference: params.reference,
      messageId: out.MessageId || null,
      accepted: true,
      error: null,
      timestamp,
    };
  } catch (e) {
    return {
      notificationType: params.notificationType,
      reference: params.reference,
      messageId: null,
      accepted: false,
      error: e instanceof Error ? e.message : String(e),
      timestamp,
    };
  }
}