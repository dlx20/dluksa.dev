const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dluksa.dev';

const FONT =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function metaRow(label: string, value: string): string {
    return `
      <tr>
        <td style="padding:10px 0;width:96px;vertical-align:top;font-family:${FONT};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
          ${label}
        </td>
        <td style="padding:10px 0;vertical-align:top;font-family:${FONT};font-size:15px;line-height:1.5;color:#111827;">
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
    const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
    const fileList =
        files.length === 0
            ? 'None'
            : files.map((file) => escapeForHtml(file)).join('<br/>');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New message — ddev</title>
</head>
<body style="margin:0;padding:0;background:#eef0f3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f3;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
          <tr>
            <td style="padding:0 8px 20px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="40" height="40" valign="middle" align="center" style="width:40px;height:40px;background-color:#1c1c1c;border-radius:8px;">
                    <img src="${SITE_URL}/email-logo.svg" width="40" height="40" alt="ddev" style="display:block;border:0;border-radius:8px;" />
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <div style="font-family:${MONO};font-size:18px;font-weight:700;color:#111827;letter-spacing:0.04em;">ddev</div>
                    <div style="font-family:${FONT};font-size:12px;color:#6b7280;">
                      <a href="${SITE_URL}" style="color:#6b7280;text-decoration:none;">dluksa.dev</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1c1c1c;padding:18px 28px;">
                    <div style="font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#C3E88D;">
                      Contact form
                    </div>
                    <div style="font-family:${FONT};font-size:20px;font-weight:700;color:#f9fafb;padding-top:4px;">
                      New message
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 28px 4px 28px;border-bottom:1px solid #eef0f3;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${metaRow('From', safeName)}
                      ${metaRow(
                          'Email',
                          `<a href="mailto:${safeEmail}" style="color:#1c1c1c;font-weight:600;text-decoration:none;">${safeEmail}</a>`
                      )}
                      ${metaRow('Subject', safeSubject)}
                      ${metaRow('Received', escapeForHtml(receivedAt))}
                      ${metaRow(
                          'Files',
                          files.length === 0
                              ? 'None'
                              : `${files.length} attached<br/><span style="color:#4b5563;font-size:13px;">${fileList}</span>`
                      )}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 28px 8px 28px;font-family:${FONT};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">
                    Message
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 28px 28px;">
                    <div style="font-family:${FONT};font-size:15px;line-height:1.7;color:#111827;background:#f8fafc;border:1px solid #eef0f3;border-radius:8px;padding:18px 20px;">
                      ${safeMessage}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 28px 28px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#C3E88D;border-radius:8px;">
                          <a href="${replyHref}"
                             style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:14px;font-weight:700;color:#1c1c1c;text-decoration:none;">
                            Reply to ${safeName}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 8px 0 8px;font-family:${FONT};font-size:12px;line-height:1.6;color:#9ca3af;">
              Sent from the contact form on
              <a href="${SITE_URL}/contact" style="color:#6b7280;text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, '')}/contact</a>.
              Reply in your client to write back to the sender.
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
        'New message via ddev contact form',
        SITE_URL,
        '',
        `From:      ${name}`,
        `Email:     ${email}`,
        `Subject:   ${subject}`,
        `Received:  ${receivedAt}`,
        `Files:     ${fileLines}`,
        '',
        message,
        '',
        `Reply to ${email}`,
    ].join('\n');
}

function escapeForHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}
