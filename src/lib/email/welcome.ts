import { layout, escapeHtml, button } from './layout';
import { WelcomeEmailData, EmailRenderResult } from './types';

export function renderWelcome(data: WelcomeEmailData): EmailRenderResult {
  const name = data.firstName?.trim() || 'there';
  const subject = 'Welcome to VelosShield | Let\u2019s Get Started';
  const preheader = 'Your VelosShield customer account has been created.';

  const body = `
<h1 style="margin:0 0 12px 0;font-size:22px;color:#003C64;">Welcome to VelosShield!</h1>
<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;">Hello ${escapeHtml(name)},</p>
<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;">Thank you for joining VelosShield.</p>
<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;">Your customer account has been successfully created.</p>
<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;">At VelosShield, we help organisations gain greater visibility into their Operational Technology environments, identify security risks and make better-informed security decisions. We're pleased to welcome you and look forward to supporting your organisation.</p>

<h2 style="margin:20px 0 8px 0;font-size:17px;color:#003C64;">VelosShield Core</h2>
<p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">On-site OT monitoring, network visibility and security threat detection capabilities for your operational technology environments.</p>

<h2 style="margin:20px 0 8px 0;font-size:17px;color:#003C64;">VelosShield Insights</h2>
<p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;">Centralised visibility, analytics and security intelligence across OT environments.</p>

${button('Explore VelosShield Solutions', 'https://www.velosshield.com/product/org-level/')}
${button('Request a Personalised Demo', 'https://www.velosshield.com/demo/', false)}

<p style="margin:16px 0 8px 0;font-size:14px;line-height:1.6;">
  <a href="https://www.velosshield.com/velosshield-brochure.pdf" style="color:#003C64;text-decoration:underline;">Download Our Product Brochure</a>
</p>

<p style="margin:16px 0 0 0;font-size:14px;line-height:1.6;">Need help? Contact us at <a href="mailto:demo@velosshield.com" style="color:#003C64;">demo@velosshield.com</a> or visit our <a href="https://www.velosshield.com/company/contact/" style="color:#003C64;">contact page</a>.</p>
`;

  const html = layout('Welcome to VelosShield', body, preheader);

  const text = `Welcome to VelosShield!

Hello ${name},

Thank you for joining VelosShield. Your customer account has been successfully created.

At VelosShield, we help organisations gain greater visibility into their Operational Technology environments, identify security risks and make better-informed security decisions. We're pleased to welcome you and look forward to supporting your organisation.

VelosShield Core: On-site OT monitoring, network visibility and security threat detection capabilities.

VelosShield Insights: Centralised visibility, analytics and security intelligence across OT environments.

Explore VelosShield Solutions: https://www.velosshield.com/product/org-level/
Request a Personalised Demo: https://www.velosshield.com/demo/
Download Our Product Brochure: https://www.velosshield.com/velosshield-brochure.pdf

Need help? Contact demo@velosshield.com or visit https://www.velosshield.com/company/contact/

VelosShield — www.velosshield.com
`;

  return { subject, html, text };
}