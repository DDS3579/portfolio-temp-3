'use client';

import { useRef, useState, type FormEvent } from 'react';
import { site } from '../content/site';
import { Reveal } from '../lib/useReveal';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'mailto' | 'unavailable';

const MESSAGES: Record<Exclude<Status, 'idle' | 'sending'>, string> = {
  success: "Message sent. I'll be in touch soon.",
  error: 'Something went wrong. Please try again.',
  mailto: 'Your email app should open with the message ready to send.',
  unavailable: 'The contact form is not connected yet.',
};

const empty = { name: '', email: '', type: '', message: '' };

export function Contact() {
  const [data, setData] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const trap = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) => setData((d) => ({ ...d, [k]: e.target.value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!data.name.trim()) next.name = 'Name is required.';
    if (!data.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = 'Enter a valid email.';
    if (!data.message.trim()) next.message = 'Message is required.';
    setErrors(next);
    const first = (['name', 'email', 'message'] as const).find((k) => next[k]);
    if (first) document.getElementById(`contact-${first}`)?.focus();
    return !first;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (trap.current?.value) return; // honeypot
    if (!validate()) return;

    if (site.formEndpoint) {
      setStatus('sending');
      try {
        const res = await fetch(site.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('success');
        setData(empty);
      } catch {
        setStatus('error');
      }
      return;
    }
    if (site.email) {
      const body = `${data.message}\n\n${data.name} (${data.email})${data.type ? `\nProject type: ${data.type}` : ''}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Project enquiry')}&body=${encodeURIComponent(body)}`;
      setStatus('mailto');
      return;
    }
    setStatus('unavailable');
  };

  const field = (id: 'name' | 'email' | 'message') => ({
    id: `contact-${id}`,
    className: 'form-input',
    value: data[id],
    onChange: set(id),
    'aria-invalid': !!errors[id],
    'aria-describedby': errors[id] ? `${id}-error` : undefined,
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad contact">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="contact-title" className="display-section mb-6 leading-[1.05]">Let's build something exceptional.</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="body-copy mb-10" style={{ maxWidth: '36ch' }}>Open to collaborations, product ideas, and ambitious projects.</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mb-10 flex flex-wrap gap-4">
              <a href="#contact-form" data-action="form" className="btn-solid">Start a Project</a>
              {site.github && <a href={site.github} className="btn-ghost" target="_blank" rel="noopener noreferrer">View GitHub</a>}
              {site.resume && <a href={site.resume} className="btn-ghost" download>Download Resume</a>}
            </div>
            {(site.linkedin || site.x) && (
              <p className="data-line mb-6 flex gap-4">
                {site.linkedin && <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)]">LinkedIn</a>}
                {site.x && <a href={site.x} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)]">X</a>}
              </p>
            )}
            <p className="data-line">Kathmandu 27.7172° N, 85.3240° E</p>
          </Reveal>
        </div>

        {/* Anchor sits outside Reveal so its measured top has no transform in it */}
        <div className="lg:col-span-7" data-graph-anchor="contact">
          <Reveal delay={120}>
            <form id="contact-form" onSubmit={submit} noValidate className="flex flex-col gap-6">
              <input ref={trap} type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <div>
                <label htmlFor="contact-name" className="data-line mb-2.5 block uppercase tracking-wider">Name</label>
                <input type="text" placeholder="Your name" {...field('name')} />
                {errors.name && <p id="name-error" className="form-error">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="data-line mb-2.5 block uppercase tracking-wider">Email</label>
                <input type="email" placeholder="you@example.com" {...field('email')} />
                {errors.email && <p id="email-error" className="form-error">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-type" className="data-line mb-2.5 block uppercase tracking-wider">Project type</label>
                <select id="contact-type" className="form-input" value={data.type} onChange={set('type')}>
                  <option value="">Select a type</option>
                  <option value="Web application">Web application</option>
                  <option value="AI / automation">AI / automation</option>
                  <option value="Product development">Product development</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="data-line mb-2.5 block uppercase tracking-wider">Message</label>
                <textarea placeholder="Tell me about your project..." {...field('message')} className="form-input min-h-[140px] resize-y" />
                {errors.message && <p id="message-error" className="form-error">{errors.message}</p>}
              </div>

              <button type="submit" disabled={status === 'sending'} className="btn-solid self-start disabled:opacity-50">
                {status === 'sending' ? 'Sending...' : 'Start a Project'}
              </button>
              <div aria-live="polite" className="min-h-6 text-sm text-[var(--color-muted)]">
                {status !== 'idle' && status !== 'sending' && MESSAGES[status]}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}