'use client';

import { useState } from 'react';

const EmailFormSideBySide = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("sending");

  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to send");
    }

    setStatus("success");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => setStatus("idle"), 3000);
  } catch (err) {
    console.error(err);
    setStatus("error");

    setTimeout(() => setStatus("idle"), 3000);
  }
};

  return (
    <div className="backdrop-blur-lg bg-surface-elevated/30 border border-accent/20 rounded-2xl overflow-hidden shadow-xl">
      <div className="grid md:grid-cols-5 gap-6 p-6">
        {/* Info Side */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-text/95 font-mono mb-2">Get in Touch</h2>
            <p className="text-sm text-text/60 leading-relaxed">
              Have a project in mind? Let's discuss how we can work together.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="text-accent text-xs">✉</span>
              </div>
              <span className="text-text/70 font-mono text-xs">ddev@dluksa.dev</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="text-accent text-xs">📍</span>
              </div>
              <span className="text-text/70 font-mono text-xs">London, England</span>
            </div>

          </div>
        </div>

        {/* Form Side */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Name"
                required
                className="px-3 py-2.5 bg-surface-base/40 border border-accent/15 rounded-lg text-text text-sm font-mono placeholder:text-text/40 focus:outline-none focus:border-accent/30 transition-colors"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                required
                className="px-3 py-2.5 bg-surface-base/40 border border-accent/15 rounded-lg text-text text-sm font-mono placeholder:text-text/40 focus:outline-none focus:border-accent/30 transition-colors"
              />
            </div>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Subject"
              required
              className="w-full px-3 py-2.5 bg-surface-base/40 border border-accent/15 rounded-lg text-text text-sm font-mono placeholder:text-text/40 focus:outline-none focus:border-accent/30 transition-colors"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Your message..."
              required
              rows={4}
              className="w-full px-3 py-2.5 bg-surface-base/40 border border-accent/15 rounded-lg text-text text-sm font-mono placeholder:text-text/40 focus:outline-none focus:border-accent/30 transition-colors resize-none"
            />

            {status === 'success' && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-400/10 border border-green-400/30">
                <span className="text-green-400 text-sm">✓</span>
                <span className="text-xs font-mono text-green-400">Message sent successfully!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-5 py-2.5 bg-gradient-to-r from-accent/80 to-accent/60 hover:from-accent/90 hover:to-accent/70 border border-accent/40 rounded-lg text-text font-mono text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailFormSideBySide;