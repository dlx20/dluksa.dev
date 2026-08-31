'use client';

import { useState } from 'react';
import { HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi';
import { EMAIL, LOCATION } from '@/lib/constants';

type Status = 'idle' | 'sending' | 'success' | 'error';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };

const EmailForm = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');

  const update = (field: keyof typeof EMPTY_FORM) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((previous) => ({ ...previous, [field]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Request failed with ${response.status}`);

      setStatus('success');
      setFormData(EMPTY_FORM);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="card">
      <div className="grid gap-8 lg:grid-cols-5">

        <div className="space-y-5 lg:col-span-2">
          <div>
            <h2 className="text-subheading font-bold text-fg-base">Get in touch</h2>
            <p className="mt-2 text-body leading-6 text-fg-muted">
              Have a project in mind? Send a message and I&apos;ll get back to you.
            </p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="icon-tile">
                <HiOutlineMail size={18} className="text-accent" />
              </span>
              <a href={`mailto:${EMAIL}`} className="text-ui text-fg-muted hover:text-accent">
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
              <label htmlFor="name" className="control-label">Name</label>
              <input
                id="name"
                className="field"
                value={formData.name}
                onChange={update('name')}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="control-label">Email</label>
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
            <label htmlFor="subject" className="control-label">Subject</label>
            <input
              id="subject"
              className="field"
              value={formData.subject}
              onChange={update('subject')}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="control-label">Message</label>
            <textarea
              id="message"
              rows={4}
              className="field resize-none"
              value={formData.message}
              onChange={update('message')}
              required
            />
          </div>

          {status === 'success' && (
            <p className="rounded-card border border-success/30 bg-success/10 px-3 py-2 text-ui text-success">
              Message sent — thanks for reaching out.
            </p>
          )}

          {status === 'error' && (
            <p className="rounded-card border border-danger/30 bg-danger/10 px-3 py-2 text-ui text-danger">
              Something went wrong. Email me directly at {EMAIL}.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full cursor-pointer rounded-card border border-accent/40 bg-accent/15 px-5 py-2.5 font-display text-body font-bold uppercase tracking-wide text-accent transition-colors hover:bg-accent/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;
