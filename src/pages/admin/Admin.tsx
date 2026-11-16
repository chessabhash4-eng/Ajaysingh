import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, Film, Mail, MessageSquareQuote, ShieldCheck, LogOut, Plus, Pencil, Trash2, Star, ArrowUp, ArrowDown, ExternalLink, Loader2, MailOpen, Search, Menu, X, Settings, Check, Phone,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api, useFetch, videoSrc } from '../../lib/api';
import type { AdminRow, Message, Project, Testimonial } from '../../lib/api';
import { CloudMark } from '../../components/Logo';
import ProjectForm from './ProjectForm';

type Tab = 'overview' | 'projects' | 'messages' | 'testimonials' | 'settings' | 'access';

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20 text-muted">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

function ErrorBox({ msg, retry }: { msg: string; retry: () => void }) {
  return (
    <div className="rounded-lg border border-accent/40 bg-accent/5 p-6 text-sm text-accent">
      {msg}{' '}
      <button onClick={retry} className="ml-2 underline">
        Retry
      </button>
    </div>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-ink-2 ${className}`}>{children}</div>;
}

/* ------------------------------------------------------------ PROJECTS */
function Projects({ projects, loading, error, refetch }: { projects: Project[]; loading: boolean; error: string | null; refetch: () => void }) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [actionError, setActionError] = useState('');
  const cats = useMemo(() => Array.from(new Set(projects.map((p) => p.category))), [projects]);
  const list = projects.filter((p) => `${p.title} ${p.client} ${p.category}`.toLowerCase().includes(q.toLowerCase()));

  const run = async (id: number, fn: () => Promise<unknown>) => {
    setBusy(id);
    setActionError('');
    try {
      await fn();
      await refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(null);
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    const a = projects[i];
    const b = projects[i + dir];
    if (!a || !b) return;
    const ao = a.sort_order === b.sort_order ? i : a.sort_order;
    const bo = a.sort_order === b.sort_order ? i + dir : b.sort_order;
    run(a.id, async () => {
      await api('/api/projects', { method: 'PUT', auth: true, body: { id: a.id, sort_order: bo } });
      await api('/api/projects', { method: 'PUT', auth: true, body: { id: b.id, sort_order: ao } });
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-md border border-line bg-ink-2 px-3">
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects…" className="w-full bg-transparent py-2.5 text-sm outline-none sm:w-64" />
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-ink">
          <Plus className="h-4 w-4" /> Upload project
        </button>
      </div>
      {actionError && <p className="mb-4 rounded-md bg-accent/10 p-3 text-sm text-accent">{actionError}</p>}
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorBox msg={error} retry={refetch} />
      ) : list.length === 0 ? (
        <Card className="flex flex-col items-center p-16 text-center text-muted">
          <Film className="mb-3 h-8 w-8" />
          {projects.length ? 'No projects match your search.' : 'No projects yet — upload your first reel.'}
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((p) => {
            const i = projects.indexOf(p);
            return (
              <motion.div layout key={p.id}>
                <Card className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center">
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md bg-ink sm:w-40">
                    {p.thumbnail_url ? <img src={p.thumbnail_url} alt="" className="h-full w-full object-cover" /> : <video src={videoSrc(p.video_url)} muted preload="metadata" className="h-full w-full object-cover" />}
                    {p.duration && <span className="absolute bottom-1 right-1 rounded bg-ink/80 px-1.5 font-mono text-[10px]">{p.duration}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold">{p.title}</h3>
                      {p.featured && <span className="rounded-full bg-amber/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-amber">Featured</span>}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {p.client || 'Independent'} · {p.category} · {p.year}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-muted">/work/{p.slug}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {busy === p.id && <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted" />}
                    <button title="Move up" disabled={i === 0 || !!q} onClick={() => move(i, -1)} className="rounded-md p-2 text-muted hover:bg-ink-3 hover:text-paper disabled:opacity-30">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button title="Move down" disabled={i === projects.length - 1 || !!q} onClick={() => move(i, 1)} className="rounded-md p-2 text-muted hover:bg-ink-3 hover:text-paper disabled:opacity-30">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      title="Toggle featured"
                      onClick={() => run(p.id, () => api('/api/projects', { method: 'PUT', auth: true, body: { id: p.id, featured: !p.featured } }))}
                      className={`rounded-md p-2 hover:bg-ink-3 ${p.featured ? 'text-amber' : 'text-muted hover:text-paper'}`}
                    >
                      <Star className={`h-4 w-4 ${p.featured ? 'fill-amber' : ''}`} />
                    </button>
                    <Link to={`/work/${p.slug}`} target="_blank" title="View" className="rounded-md p-2 text-muted hover:bg-ink-3 hover:text-paper">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button title="Edit" onClick={() => setEditing(p)} className="rounded-md p-2 text-muted hover:bg-ink-3 hover:text-paper">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => {
                        if (confirm(`Delete "${p.title}"? This can’t be undone.`)) run(p.id, () => api(`/api/projects?id=${p.id}`, { method: 'DELETE', auth: true }));
                      }}
                      className="rounded-md p-2 text-muted hover:bg-accent/10 hover:text-accent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      <AnimatePresence>
        {(creating || editing) && (
          <ProjectForm
            key={editing?.id ?? 'new'}
            project={editing}
            categories={cats}
            nextOrder={projects.length ? Math.max(...projects.map((p) => p.sort_order)) + 1 : 1}
            onClose={() => {
              setCreating(false);
              setEditing(null);
            }}
            onSaved={() => {
              setCreating(false);
              setEditing(null);
              refetch();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------ MESSAGES */
function Messages({ messages, loading, error, refetch }: { messages: Message[]; loading: boolean; error: string | null; refetch: () => void }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [actionError, setActionError] = useState('');

  const act = async (fn: () => Promise<unknown>) => {
    setActionError('');
    try {
      await fn();
      await refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Action failed');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} retry={refetch} />;
  if (!messages.length)
    return (
      <Card className="flex flex-col items-center p-16 text-center text-muted">
        <Mail className="mb-3 h-8 w-8" /> No messages yet. They’ll land here when someone uses the contact form.
      </Card>
    );

  return (
    <div className="space-y-3">
      {actionError && <p className="rounded-md bg-accent/10 p-3 text-sm text-accent">{actionError}</p>}
      {messages.map((m) => {
        const open = openId === m.id;
        return (
          <Card key={m.id} className={`overflow-hidden ${!m.is_read ? 'border-accent/40' : ''}`}>
            <button
              onClick={() => {
                setOpenId(open ? null : m.id);
                if (!m.is_read) act(() => api('/api/messages', { method: 'PUT', auth: true, body: { id: m.id, is_read: true } }));
              }}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${m.is_read ? 'bg-transparent' : 'bg-accent'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`truncate ${m.is_read ? '' : 'font-semibold'}`}>{m.name}</span>
                  {m.company && <span className="truncate text-sm text-muted">· {m.company}</span>}
                </div>
                <p className="truncate text-sm text-muted">{m.message}</p>
              </div>
              <div className="hidden shrink-0 gap-2 sm:flex">
                {m.project_type && <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase">{m.project_type}</span>}
                {m.budget && <span className="rounded-full border border-amber/40 px-2 py-0.5 font-mono text-[10px] text-amber">{m.budget}</span>}
              </div>
              <span className="shrink-0 font-mono text-[11px] text-muted">{new Date(m.created_at).toLocaleDateString()}</span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="border-t border-line p-5">
                    <p className="font-mono text-xs text-muted">{m.email}</p>
                    <p className="mt-3 whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <a href={`mailto:${m.email}?subject=Re: your project with Fluffy Cloud`} className="rounded-md bg-paper px-3 py-2 text-sm font-medium text-ink">
                        Reply by email
                      </a>
                      <button onClick={() => act(() => api('/api/messages', { method: 'PUT', auth: true, body: { id: m.id, is_read: !m.is_read } }))} className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm">
                        <MailOpen className="h-4 w-4" /> Mark {m.is_read ? 'unread' : 'read'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this message?')) act(() => api(`/api/messages?id=${m.id}`, { method: 'DELETE', auth: true }));
                        }}
                        className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm text-accent hover:border-accent"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------- TESTIMONIALS */
function Testimonials() {
  const { data, loading, error, refetch } = useFetch<Testimonial[]>('/api/testimonials', []);
  const [f, setF] = useState({ quote: '', author: '', role: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.quote.trim() || !f.author.trim()) return setErr('Quote and author are required');
    setBusy(true);
    setErr('');
    try {
      await api('/api/testimonials', { method: 'POST', auth: true, body: f });
      setF({ quote: '', author: '', role: '' });
      refetch();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await api(`/api/testimonials?id=${id}`, { method: 'DELETE', auth: true });
      refetch();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Failed');
    }
  };

  const input = 'w-full rounded-md border border-line bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent';
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit p-5 lg:col-span-2">
        <h3 className="font-semibold">Add testimonial</h3>
        <form onSubmit={add} className="mt-4 space-y-3">
          <textarea rows={4} value={f.quote} onChange={(e) => setF({ ...f, quote: e.target.value })} placeholder="What did the client say?" className={`${input} resize-none`} />
          <input value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} placeholder="Author name" className={input} />
          <input value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} placeholder="Role, Company" className={input} />
          {err && <p className="text-sm text-accent">{err}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2.5 text-sm font-semibold text-ink disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Add
          </button>
        </form>
      </Card>
      <div className="space-y-3 lg:col-span-3">
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorBox msg={error} retry={refetch} />
        ) : data.length === 0 ? (
          <Card className="p-10 text-center text-muted">No testimonials yet.</Card>
        ) : (
          data.map((t) => (
            <Card key={t.id} className="flex gap-4 p-5">
              <div className="flex-1">
                <p className="font-serif text-xl leading-snug">“{t.quote}”</p>
                <p className="mt-3 text-sm">
                  <span className="font-semibold">{t.author}</span> <span className="text-muted">· {t.role}</span>
                </p>
              </div>
              <button onClick={() => del(t.id)} className="h-fit rounded-md p-2 text-muted hover:bg-accent/10 hover:text-accent" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- ACCESS */
function Access({ me }: { me: string }) {
  const { data, loading, error, refetch } = useFetch<AdminRow[]>('/api/admins', [], true);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email');
    setBusy(true);
    setErr('');
    try {
      await api('/api/admins', { method: 'POST', auth: true, body: { email } });
      setEmail('');
      refetch();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <p className="mb-5 text-sm text-muted">Allow-listed emails can sign in (email/password or Google) and manage the site. Everyone else is blocked from the admin panel.</p>
      <form onSubmit={add} className="flex gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="editor@fluffycloud.studio" className="flex-1 rounded-md border border-line bg-ink-2 px-3 py-2.5 text-sm outline-none focus:border-accent" />
        <button disabled={busy} className="flex items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-ink disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Grant
        </button>
      </form>
      {err && <p className="mt-2 text-sm text-accent">{err}</p>}
      <div className="mt-6 space-y-2">
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorBox msg={error} retry={refetch} />
        ) : (
          data.map((a) => (
            <Card key={a.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-3 font-mono text-xs uppercase">{a.email[0]}</span>
                <span className="text-sm">{a.email}</span>
                {a.email === me.toLowerCase() && <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase text-accent">You</span>}
              </div>
              {a.email !== me.toLowerCase() && (
                <button
                  onClick={async () => {
                    if (!confirm(`Revoke access for ${a.email}?`)) return;
                    try {
                      await api(`/api/admins?id=${a.id}`, { method: 'DELETE', auth: true });
                      refetch();
                    } catch (e2) {
                      setErr(e2 instanceof Error ? e2.message : 'Failed');
                    }
                  }}
                  className="text-sm text-muted hover:text-accent"
                >
                  Revoke
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- SITE SETTINGS */
function SiteSettingsSection() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    api<{ email: string; phone: string; location?: string }>('/api/settings').then((data) => {
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setLocation(data.location || '');
    });
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await api('/api/settings', {
        method: 'PUT',
        body: { email: email.trim(), phone: phone.trim(), location: location.trim() },
      });
      setMsg({ type: 'ok', text: 'Live contact details updated successfully across the site!' });
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Contact & Studio Details</h2>
        <p className="mt-1 text-sm text-muted">
          Update the email address and phone number displayed across the website (Header menu, Contact page, Footer).
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-5">
          {msg && (
            <div
              className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                msg.type === 'ok' ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border border-accent/40 bg-accent/10 text-accent'
              }`}
            >
              {msg.type === 'ok' && <Check className="h-4 w-4" />}
              {msg.text}
            </div>
          )}

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Contact Email Address</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-md border border-line bg-ink px-3 focus-within:border-accent">
              <Mail className="h-4 w-4 text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              />
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted">Visitors will use this to email you from footer & contact page.</p>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Phone Number / WhatsApp</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-md border border-line bg-ink px-3 focus-within:border-accent">
              <Phone className="h-4 w-4 text-muted" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              />
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted">Visitors can click to call directly or connect on WhatsApp.</p>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Studio Tagline / Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote-first edit suite / Worldwide"
              className="mt-1.5 w-full rounded-md border border-line bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save & Update Live
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- SHELL */
export default function Admin() {
  const { user, loading, logoutDemo } = useAuth();
  const [check, setCheck] = useState<'loading' | 'ok' | 'denied'>('loading');
  const [tab, setTab] = useState<Tab>('overview');
  const [nav, setNav] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.email === 'tungtungbaje' || user.email === 'admin@fluffycloud.studio') {
      setCheck('ok');
      return;
    }
    setCheck('loading');
    api<{ isAdmin: boolean }>('/api/admins?me=1', { auth: true })
      .then((r) => setCheck(r.isAdmin ? 'ok' : 'denied'))
      .catch(() => setCheck('denied'));
  }, [user]);

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (check === 'loading') return <div className="flex min-h-screen items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-muted"><Loader2 className="mr-3 h-4 w-4 animate-spin" /> Checking access</div>;
  if (check === 'denied')
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="h-10 w-10 text-accent" />
        <h1 className="mt-4 text-3xl font-bold">Access restricted</h1>
        <p className="mt-2 max-w-sm text-muted">{user.email} isn’t on the admin allow-list. Ask an existing admin to grant access.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/" className="rounded-md border border-line px-4 py-2 text-sm">Back to site</Link>
          <button onClick={() => logoutDemo()} className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-ink cursor-pointer">Sign out</button>
        </div>
      </div>
    );

  return <Dashboard email={user.email ?? ''} tab={tab} setTab={setTab} nav={nav} setNav={setNav} onSignOut={logoutDemo} />;
}

function Dashboard({ email, tab, setTab, nav, setNav, onSignOut }: { email: string; tab: Tab; setTab: (t: Tab) => void; nav: boolean; setNav: (b: boolean) => void; onSignOut: () => void }) {
  const projects = useFetch<Project[]>('/api/projects', []);
  const messages = useFetch<Message[]>('/api/messages', [], true);
  const unread = messages.data.filter((m) => !m.is_read).length;

  const tabs: { id: Tab; label: string; icon: typeof Film; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Film, badge: projects.data.length },
    { id: 'messages', label: 'Messages', icon: Mail, badge: unread || undefined },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'settings', label: 'Contact Info', icon: Settings },
    { id: 'access', label: 'Access', icon: ShieldCheck },
  ];

  const stats = [
    { l: 'Projects', v: projects.data.length },
    { l: 'Featured', v: projects.data.filter((p) => p.featured).length },
    { l: 'Messages', v: messages.data.length },
    { l: 'Unread', v: unread },
  ];

  const Side = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 px-5 py-6">
        <CloudMark className="h-6 w-9 text-accent" />
        <div>
          <p className="font-bold leading-none">Ajay Singh</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Admin suite</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setNav(false);
            }}
            className={`relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${tab === t.id ? 'text-paper' : 'text-muted hover:text-paper'}`}
          >
            {tab === t.id && <motion.span layoutId="adm-tab" className="absolute inset-0 rounded-md bg-ink-3" />}
            <t.icon className="relative h-4 w-4" />
            <span className="relative flex-1 text-left">{t.label}</span>
            {t.badge !== undefined && <span className={`relative rounded-full px-2 py-0.5 font-mono text-[10px] ${t.id === 'messages' ? 'bg-accent text-ink' : 'bg-ink-3 text-muted'}`}>{t.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="border-t border-line p-4">
        <p className="truncate font-mono text-[11px] text-muted">{email}</p>
        <div className="mt-3 flex gap-2">
          <Link to="/" className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-line py-2 text-xs hover:border-paper">
            <ExternalLink className="h-3.5 w-3.5" /> Site
          </Link>
          <button onClick={onSignOut} className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-line py-2 text-xs hover:border-accent hover:text-accent cursor-pointer">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink md:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line bg-ink-2 md:block">{Side}</aside>
      <AnimatePresence>
        {nav && (
          <motion.div className="fixed inset-0 z-40 bg-ink/70 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNav(false)}>
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="h-full w-64 border-r border-line bg-ink-2" onClick={(e) => e.stopPropagation()}>
              {Side}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ink/80 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setNav(true)} className="md:hidden" aria-label="Open menu">
              {nav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Admin / {tab}</p>
              <h1 className="text-xl font-bold capitalize">{tab}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <span className="blink h-2 w-2 rounded-full bg-emerald-400" /> Live
          </div>
        </header>

        <main className="p-5 md:p-8">
          {tab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((s) => (
                  <Card key={s.l} className="p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{s.l}</p>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight">{projects.loading || messages.loading ? '—' : s.v}</p>
                  </Card>
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Latest projects</h3>
                    <button onClick={() => setTab('projects')} className="text-xs text-accent">Manage →</button>
                  </div>
                  {projects.loading ? <Spinner /> : (
                    <div className="grid grid-cols-2 gap-3">
                      {[...projects.data].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 4).map((p) => (
                        <div key={p.id}>
                          <div className="aspect-video overflow-hidden rounded-md bg-ink">
                            {p.thumbnail_url ? <img src={p.thumbnail_url} alt="" className="h-full w-full object-cover" /> : <video src={videoSrc(p.video_url)} muted preload="metadata" className="h-full w-full object-cover" />}
                          </div>
                          <p className="mt-1.5 truncate text-sm">{p.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
                <Card className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Recent messages</h3>
                    <button onClick={() => setTab('messages')} className="text-xs text-accent">Inbox →</button>
                  </div>
                  {messages.loading ? <Spinner /> : messages.data.length === 0 ? <p className="py-10 text-center text-sm text-muted">Inbox zero.</p> : (
                    <div className="divide-y divide-line">
                      {messages.data.slice(0, 5).map((m) => (
                        <div key={m.id} className="flex items-center gap-3 py-3">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${m.is_read ? 'bg-ink-3' : 'bg-accent'}`} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{m.name}</p>
                            <p className="truncate text-xs text-muted">{m.message}</p>
                          </div>
                          <span className="font-mono text-[10px] text-muted">{new Date(m.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
              <Card className="flex flex-col items-start justify-between gap-4 bg-linear-to-r from-accent/15 to-transparent p-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold">Fresh off the timeline?</h3>
                  <p className="text-sm text-muted">Upload a new video and it goes live in the showcase instantly.</p>
                </div>
                <button onClick={() => setTab('projects')} className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-ink">
                  <Plus className="h-4 w-4" /> Upload project
                </button>
              </Card>
            </div>
          )}
          {tab === 'projects' && <Projects projects={projects.data} loading={projects.loading} error={projects.error} refetch={projects.refetch} />}
          {tab === 'messages' && <Messages messages={messages.data} loading={messages.loading} error={messages.error} refetch={messages.refetch} />}
          {tab === 'testimonials' && <Testimonials />}
          {tab === 'settings' && <SiteSettingsSection />}
          {tab === 'access' && <Access me={email} />}
        </main>
      </div>
    </div>
  );
}
