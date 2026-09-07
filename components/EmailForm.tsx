'use client';

import { useRef, useState } from 'react';
import { FaPaperclip, FaTimes } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi';
import { EMAIL, LOCATION } from '@/lib/constants';
import {
    CONTACT_ACCEPT,
    CONTACT_MAX_FILE_BYTES,
    CONTACT_MAX_FILES,
    CONTACT_MAX_TOTAL_BYTES,
    fileError,
    formatFileSize,
} from '@/lib/contact';

type Status = 'idle' | 'sending' | 'success' | 'error';

type Attachment = {
    id: string;
    file: File;
    progress: number;
    ready: boolean;
};

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };

function postForm(payload: FormData, onProgress: (percent: number) => void): Promise<Response> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/send-email');
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };
        xhr.onload = () => {
            resolve(
                new Response(xhr.responseText, {
                    status: xhr.status,
                    headers: {
                        'Content-Type':
                            xhr.getResponseHeader('Content-Type') ?? 'application/json',
                    },
                })
            );
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(payload);
    });
}

const EmailForm = () => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInput = useRef<HTMLInputElement>(null);
    const readers = useRef(new Map<string, FileReader>());

    const files = attachments.map((entry) => entry.file);
    const attaching = attachments.some((entry) => !entry.ready);

    const update = (field: keyof typeof EMPTY_FORM) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setFormData((previous) => ({ ...previous, [field]: event.target.value }));

    const readFile = (id: string, file: File) => {
        const reader = new FileReader();
        readers.current.set(id, reader);

        reader.onprogress = (event) => {
            if (!event.lengthComputable) return;
            const progress = Math.round((event.loaded / event.total) * 100);
            setAttachments((previous) =>
                previous.map((entry) => (entry.id === id ? { ...entry, progress } : entry))
            );
        };

        reader.onload = () => {
            setAttachments((previous) =>
                previous.map((entry) =>
                    entry.id === id ? { ...entry, progress: 100, ready: true } : entry
                )
            );
            readers.current.delete(id);
        };

        reader.onerror = () => {
            setError(`Could not read ${file.name}.`);
            setAttachments((previous) => previous.filter((entry) => entry.id !== id));
            readers.current.delete(id);
        };

        reader.readAsArrayBuffer(file);
    };

    const addFiles = (incoming: FileList | File[]) => {
        setError(null);
        const accepted: Attachment[] = [];
        let total = files.reduce((sum, file) => sum + file.size, 0);
        let count = attachments.length;

        for (const file of Array.from(incoming)) {
            const duplicate = [...attachments, ...accepted].some(
                (entry) => entry.file.name === file.name && entry.file.size === file.size
            );
            if (duplicate) continue;

            const problem = fileError(file, total, count);
            if (problem) {
                setError(problem);
                continue;
            }

            accepted.push({
                id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
                file,
                progress: 0,
                ready: false,
            });
            total += file.size;
            count += 1;
        }

        if (fileInput.current) fileInput.current.value = '';
        if (accepted.length === 0) return;

        setAttachments((previous) => [...previous, ...accepted]);
        for (const entry of accepted) readFile(entry.id, entry.file);
    };

    const removeFile = (id: string) => {
        setError(null);
        readers.current.get(id)?.abort();
        readers.current.delete(id);
        setAttachments((previous) => previous.filter((entry) => entry.id !== id));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (attaching) return;

        setStatus('sending');
        setUploadProgress(0);
        setError(null);

        const payload = new FormData();
        payload.set('name', formData.name);
        payload.set('email', formData.email);
        payload.set('subject', formData.subject);
        payload.set('message', formData.message);
        for (const file of files) payload.append('files', file);

        try {
            const response = await postForm(payload, setUploadProgress);
            const body = (await response.json().catch(() => null)) as { error?: string } | null;

            if (!response.ok) {
                throw new Error(body?.error || `Request failed with ${response.status}`);
            }

            setUploadProgress(100);
            setStatus('success');
            setFormData(EMPTY_FORM);
            setAttachments([]);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setError(err instanceof Error ? err.message : null);
        } finally {
            setTimeout(() => {
                setStatus('idle');
                setUploadProgress(0);
            }, 4000);
        }
    };

    return (
        <div className="card">
            <div className="grid gap-8 lg:grid-cols-5">
                <div className="space-y-5 lg:col-span-2">
                    <div>
                        <h2 className="text-subheading font-bold text-fg-base">Get in touch</h2>
                        <p className="mt-2 text-body leading-6 text-fg-muted">
                            Have a role or a project in mind? Send a message — a CV or
                            screenshots are welcome.
                        </p>
                    </div>

                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <span className="icon-tile">
                                <HiOutlineMail size={18} className="text-accent" />
                            </span>
                            <a
                                href={`mailto:${EMAIL}`}
                                className="text-ui text-fg-muted hover:text-accent"
                            >
                                {EMAIL}
                            </a>
                        </li>

                        <li className="flex items-center gap-3">
                            <span className="icon-tile">
                                <HiOutlineLocationMarker size={18} className="text-accent" />
                            </span>
                            <span className="text-ui text-fg-muted">{LOCATION}</span>
                        </li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 lg:col-span-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="control-label">
                                Name
                            </label>
                            <input
                                id="name"
                                className="field"
                                value={formData.name}
                                onChange={update('name')}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="control-label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="field"
                                value={formData.email}
                                onChange={update('email')}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="subject" className="control-label">
                            Subject
                        </label>
                        <input
                            id="subject"
                            className="field"
                            value={formData.subject}
                            onChange={update('subject')}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="control-label">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={8}
                            className="field resize-none"
                            value={formData.message}
                            onChange={update('message')}
                            required
                        />
                    </div>

                    <div>
                        <p className="control-label">Attachments</p>
                        <label
                            className={`field flex cursor-pointer flex-col items-center gap-2 py-5 text-center ${
                                dragging ? 'border-accent/50 bg-accent/10' : ''
                            }`}
                            onDragOver={(event) => {
                                event.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(event) => {
                                event.preventDefault();
                                setDragging(false);
                                addFiles(event.dataTransfer.files);
                            }}
                        >
                            <FaPaperclip className="text-accent" />
                            <span className="text-ui text-fg-muted">
                                PDF, images, Word or zip — up to {CONTACT_MAX_FILES} files,{' '}
                                {formatFileSize(CONTACT_MAX_FILE_BYTES)} each,{' '}
                                {formatFileSize(CONTACT_MAX_TOTAL_BYTES)} total.
                            </span>
                            <input
                                ref={fileInput}
                                type="file"
                                multiple
                                accept={CONTACT_ACCEPT}
                                className="sr-only"
                                onChange={(event) => {
                                    if (event.target.files) addFiles(event.target.files);
                                }}
                            />
                        </label>

                        {attachments.length > 0 && (
                            <ul className="mt-2 space-y-1.5">
                                {attachments.map((entry) => (
                                    <li
                                        key={entry.id}
                                        className="rounded-card border border-accent/20 px-3 py-2 text-ui"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="min-w-0 truncate text-fg-base">
                                                {entry.file.name}
                                                <span className="text-fg-muted">
                                                    {' '}
                                                    · {formatFileSize(entry.file.size)}
                                                    {!entry.ready && ` · ${entry.progress}%`}
                                                </span>
                                            </span>
                                            <button
                                                type="button"
                                                aria-label={`Remove ${entry.file.name}`}
                                                disabled={status === 'sending'}
                                                onClick={() => removeFile(entry.id)}
                                                className="shrink-0 cursor-pointer text-fg-muted transition-colors hover:text-danger disabled:cursor-not-allowed"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <div
                                            className="progress-bar mt-2"
                                            role="progressbar"
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={entry.progress}
                                            aria-label={
                                                entry.ready
                                                    ? `${entry.file.name} attached`
                                                    : `Attaching ${entry.file.name}`
                                            }
                                        >
                                            <div
                                                className="progress-bar__fill"
                                                style={{ width: `${entry.progress}%` }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {status === 'sending' && (
                        <div>
                            <p className="mb-1.5 text-ui text-fg-muted">
                                Uploading {uploadProgress}%
                            </p>
                            <div
                                className="progress-bar h-1.5"
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={uploadProgress}
                                aria-label="Upload progress"
                            >
                                <div
                                    className="progress-bar__fill"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <p className="rounded-card border border-success/30 bg-success/10 px-3 py-2 text-ui text-success">
                            Message sent — thanks for reaching out.
                        </p>
                    )}

                    {status === 'error' && (
                        <p className="rounded-card border border-danger/30 bg-danger/10 px-3 py-2 text-ui text-danger">
                            {error && !error.startsWith('Request failed')
                                ? error
                                : `Something went wrong. Email me directly at ${EMAIL}.`}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'sending' || attaching}
                        className="btn-fill"
                    >
                        {status === 'sending'
                            ? 'Sending…'
                            : attaching
                              ? 'Attaching…'
                              : 'Send message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmailForm;
