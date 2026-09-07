import { EMAIL } from './constants';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dluksa.dev';

const FONT =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function metaRow(label: string, value: string): string {
    return `
      <tr>
        <td style="padding:6px 0;width:112px;vertical-align:top;font-family:${FONT};font-size:12px;color:#6b7280;">
          ${label}
        </td>
        <td style="padding:6px 0;vertical-align:top;font-family:${FONT};font-size:14px;line-height:1.5;color:#111827;">
          ${value}
        </td>
      </tr>`;
}

export function contactEmailHtml({
    name,
    email,
    subject,
    message,
    files,
    receivedAt,
}: {
    name: string;
    email: string;
    subject: string;
    message: string;
    files: string[];
    receivedAt: string;
}): string {
    const safeName = escapeForHtml(name);
    const safeEmail = escapeForHtml(email);
    const safeSubject = escapeForHtml(subject);
    const safeMessage = escapeForHtml(message).replaceAll('\n', '<br/>');
    const safeTo = escapeForHtml(EMAIL);
    const host = SITE_URL.replace(/^https?:\/\//, '');
    const attachmentRow =
        files.length === 0
            ? ''
            : metaRow('Attachments', files.map((file) => escapeForHtml(file)).join(', '));

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e5e7eb;">
          <tr>
            <td style="height:3px;background:#C3E88D;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 40px 22px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="36" height="36" style="width:36px;height:36px;">
                          <img src="cid:ddev-logo" width="36" height="36" alt="ddev" style="display:block;border:0;border-radius:6px;" />
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <div style="font-family:${MONO};font-size:16px;font-weight:700;color:#111827;">ddev</div>
                          <div style="font-family:${FONT};font-size:12px;color:#6b7280;">Dovydas Luksa</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle" align="right" style="font-family:${FONT};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">
                    Enquiry
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;">
              <div style="border-top:1px solid #e5e7eb;font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${metaRow('To', `Dovydas Luksa &lt;${safeTo}&gt;`)}
                ${metaRow(
                    'From',
                    `${safeName} &lt;<a href="mailto:${safeEmail}" style="color:#111827;text-decoration:none;">${safeEmail}</a>&gt;`
                )}
                ${metaRow('Date', escapeForHtml(receivedAt))}
                ${metaRow('Subject', safeSubject)}
                ${attachmentRow}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 40px 0 40px;">
              <div style="border-top:1px solid #e5e7eb;font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 8px 40px;font-family:${FONT};font-size:15px;line-height:1.75;color:#111827;">
              ${safeMessage}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px 32px 40px;font-family:${FONT};font-size:15px;line-height:1.75;color:#111827;">
              Kind regards,<br />
              ${safeName}<br />
              <a href="mailto:${safeEmail}" style="color:#4b5563;text-decoration:none;">${safeEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px 24px 40px;border-top:1px solid #e5e7eb;font-family:${FONT};font-size:11px;line-height:1.65;color:#9ca3af;">
              Submitted via
              <a href="${SITE_URL}/contact" style="color:#6b7280;text-decoration:none;">${host}/contact</a>.
              Reply to this email to respond to ${safeName}.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function contactEmailText({
    name,
    email,
    subject,
    message,
    files,
    receivedAt,
}: {
    name: string;
    email: string;
    subject: string;
    message: string;
    files: string[];
    receivedAt: string;
}): string {
    const fileLines = files.length === 0 ? 'None' : files.join(', ');
    return [
        'Enquiry — ddev',
        '',
        `To:          Dovydas Luksa <${EMAIL}>`,
        `From:        ${name} <${email}>`,
        `Date:        ${receivedAt}`,
        `Subject:     ${subject}`,
        `Attachments: ${fileLines}`,
        '',
        message,
        '',
        'Kind regards,',
        name,
        email,
        '',
        `Submitted via ${SITE_URL}/contact`,
    ].join('\n');
}

function escapeForHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}
