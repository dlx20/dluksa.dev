import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';
import {
    CONTACT_MAX_FILES,
    fileError,
    safeFilename,
} from '@/lib/contact';

function readField(form: FormData, key: string): string {
    const value = form.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const name = readField(form, 'name');
        const email = readField(form, 'email');
        const subject = readField(form, 'subject');
        const message = readField(form, 'message');

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ success: false, error: 'Missing fields.' }, { status: 400 });
        }

        const incoming = form.getAll('files').filter((entry): entry is File => entry instanceof File);
        if (incoming.length > CONTACT_MAX_FILES) {
            return NextResponse.json(
                { success: false, error: `At most ${CONTACT_MAX_FILES} files.` },
                { status: 400 }
            );
        }

        const attachments = [];
        let total = 0;

        for (const file of incoming) {
            const error = fileError(file, total, attachments.length);
            if (error) {
                return NextResponse.json({ success: false, error }, { status: 400 });
            }

            total += file.size;
            attachments.push({
                filename: safeFilename(file.name),
                content: Buffer.from(await file.arrayBuffer()),
                contentType: file.type || undefined,
            });
        }

        await sendEmail({
            name,
            email,
            subject,
            message,
            attachments,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);

        return NextResponse.json({ success: false }, { status: 500 });
    }
}
