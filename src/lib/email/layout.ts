const LOGO_URL = 'https://www.velosshield.com/NEWvsLOGO.png';
const PRIMARY = '#003C64';
const ACCENT = '#FF612A';
const GREY = '#f4f6f8';

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function layout(title: string, bodyHtml: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${GREY};font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
<span style="display:none;font-size:1px;color:${GREY};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${GREY};">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background:${PRIMARY};padding:20px 24px;">
            <img src="${LOGO_URL}" alt="VelosShield" width="160" style="display:block;border:0;outline:none;text-decoration:none;" />
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="background:${GREY};padding:20px 24px;font-size:12px;color:#555;line-height:1.5;">
            <p style="margin:0 0 6px 0;"><strong>VelosShield</strong> — <a href="https://www.velosshield.com/" style="color:${PRIMARY};text-decoration:none;">www.velosshield.com</a></p>
            <p style="margin:0 0 6px 0;">Contact: <a href="mailto:demo@velosshield.com" style="color:${PRIMARY};text-decoration:none;">demo@velosshield.com</a> | <a href="https://www.velosshield.com/company/contact/" style="color:${PRIMARY};text-decoration:none;">Contact page</a></p>
            <p style="margin:0 0 6px 0;">You are receiving this message because a VelosShield customer account was created using this email address. If you did not register, please contact our team.</p>
            <p style="margin:0;">This is a transactional notification, not a marketing subscription.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function button(label: string, href: string, primary = true): string {
  const bg = primary ? ACCENT : PRIMARY;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;"><tr><td style="background:${bg};border-radius:6px;"><a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;">${escapeHtml(label)}</a></td></tr></table>`;
}