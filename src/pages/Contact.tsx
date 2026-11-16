import { useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import Page from '../components/Page';
import SplitText from '../components/SplitText';
import Scramble from '../components/Scramble';
import { api, EASE_OUT, useSiteSettings } from '../lib/api';

const TYPES = ['Commercial', 'Music Video', 'Documentary', 'Brand Film', 'Social', 'Other'];
const BUDGETS = ['< $2k', '$2k – $5k', '$5k – $15k', '$15k +'];

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function Contact() {
  const settings = useSiteSettings();
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [type, setType] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'We’d love to know your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (form.message.trim().length < 10) e.message = 'Tell us a little more (10+ characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    setServerError('');
    try {
      await api('/api/messages', { method: 'POST', body: { ...form, project_type: type, budget } });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const field = (k: 'name' | 'email' | 'company', label: string, type = 'text') => (
    <div className="group relative">
      <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{label}</label>
      <input
        type={type}
        value={form[k]}
        onChange={(e) => {
          setForm({ ...form, [k]: e.target.value });
          if (k !== 'company' && errors[k]) setErrors({ ...errors, [k]: undefined });
        }}
        className="mt-2 w-full border-b border-line bg-transparent pb-3 text-2xl outline-none transition-colors placeholder:text-paper/20 focus:border-accent md:text-3xl"
        placeholder={k === 'name' ? 'Jane Doe' : k === 'email' ? 'jane@studio.com' : 'Optional'}
      />
      {k !== 'company' && errors[k] && <p className="mt-2 text-sm text-accent">{errors[k]}</p>}
    </div>
  );

  return (
    <Page label="Contact">
      <section className="grid gap-16 px-5 pb-32 pt-36 md:grid-cols-12 md:px-10 md:pt-48">
        <div className="md:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <Scramble text="[ Contact ]" />
          </p>
          <h1 className="mt-6 text-[15vw] font-extrabold leading-[0.85] tracking-[-0.055em] md:text-[7.5vw]">
            <SplitText text="Let’s" />
            <br />
            <SplitText text="talk" delay={0.15} />{' '}
            <span className="font-serif font-normal italic text-accent">
              <SplitText text="footage." delay={0.3} />
            </span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1, ease: EASE_OUT }} className="mt-12 space-y-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Email</p>
              <a href={`mailto:${settings.email}`} className="mt-1 block text-2xl underline decoration-accent decoration-2 underline-offset-4">
                {settings.email}
              </a>
            </div>
            {settings.phone && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Phone / WhatsApp</p>
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="mt-1 block text-2xl text-paper hover:text-accent">
                  {settings.phone}
                </a>
              </div>
            )}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Turnaround</p>
              <p className="mt-1 text-lg text-paper/80">We reply within one business day.</p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
              Currently booking new projects
            </div>
          </motion.div>
        </div>

        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full min-h-[500px] flex-col items-start justify-center rounded-lg border border-line p-10">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-ink">
                  <Check className="h-10 w-10" />
                </motion.span>
                <h2 className="mt-8 text-5xl font-bold tracking-tight">That’s a wrap.</h2>
                <p className="mt-3 text-lg text-muted">Thanks {form.name.split(' ')[0]} — your message is in the edit bay. We’ll be in touch soon.</p>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setForm({ name: '', email: '', company: '', message: '' });
                    setType(null);
                    setBudget(null);
                  }}
                  className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent underline underline-offset-4"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="space-y-10">
                <div className="grid gap-10 md:grid-cols-2">
                  {field('name', 'Your name *')}
                  {field('email', 'Email *', 'email')}
                </div>
                {field('company', 'Company / Artist')}

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Project type</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <button type="button" key={t} onClick={() => setType(type === t ? null : t)} className={`rounded-full border px-4 py-2 text-sm transition-all ${type === t ? 'border-accent bg-accent text-ink' : 'border-line hover:border-paper'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Budget</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <button type="button" key={b} onClick={() => setBudget(budget === b ? null : b)} className={`rounded-full border px-4 py-2 text-sm transition-all ${budget === b ? 'border-amber bg-amber text-ink' : 'border-line hover:border-paper'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Tell us about the footage *</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="What did you shoot, how long should it be, when do you need it?"
                    className="mt-2 w-full resize-none border-b border-line bg-transparent pb-3 text-xl outline-none transition-colors placeholder:text-paper/20 focus:border-accent md:text-2xl"
                  />
                  {errors.message && <p className="mt-2 text-sm text-accent">{errors.message}</p>}
                </div>

                {status === 'error' && <p className="rounded-md border border-accent/40 bg-accent/10 p-4 text-sm text-accent">{serverError}</p>}

                <button type="submit" disabled={status === 'sending'} className="group relative flex w-full items-center justify-between overflow-hidden rounded-full bg-paper px-8 py-6 text-ink disabled:opacity-60">
                  <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-x-0" />
                  <span className="relative text-xl font-bold">{status === 'sending' ? 'Rendering…' : 'Send message'}</span>
                  {status === 'sending' ? <Loader2 className="relative h-6 w-6 animate-spin" /> : <ArrowUpRight className="relative h-6 w-6 transition-transform group-hover:rotate-45" />}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Page>
  );
}
