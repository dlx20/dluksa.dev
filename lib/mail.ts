import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';
import { contactEmailHtml, contactEmailText } from './mail-template';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export type MailAttachment = {
    filename: string;
    content: Buffer;
    contentType?: string;
};

function logoAttachment() {
    const paths = [
        join(process.cwd(), 'public', 'email-logo.png'),
        join(process.cwd(), 'email-logo.png'),
    ];

    for (const file of paths) {
        try {
            return {
                filename: 'email-logo.png',
                content: readFileSync(file),
                contentType: 'image/png',
                cid: 'ddev-logo',
                contentDisposition: 'inline' as const,
            };
        } catch {
            // Standalone vs local cwd.
        }
    }

    return null;
}

export async function sendEmail({
    name,
    email,
    subject,
    message,
    attachments = [],
}: {
    name: string;
    email: string;
    subject: string;
    message: string;
    attachments?: MailAttachment[];
}) {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken.token ?? '',
        },
    });

    const receivedAt = new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/London',
    }).format(new Date());
    const files = attachments.map((file) => file.filename);
    const logo = logoAttachment();

    await transporter.sendMail({
        from: `"ddev" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: `${name} <${email}>`,
        subject: `[ddev] ${subject}`,
        text: contactEmailText({
            name,
            email,
            subject,
            message,
            files,
            receivedAt,
        }),
        html: contactEmailHtml({
            name,
            email,
            subject,
            message,
            files,
            receivedAt,
        }),
        attachments: [
            ...(logo ? [logo] : []),
            ...attachments.map(({ filename, content, contentType }) => ({
                filename,
                content,
                contentType,
            })),
        ],
    });
}
