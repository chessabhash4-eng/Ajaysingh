import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import supabase from '../../lib/supabase';
import { signInWithGoogle } from '../../lib/googleAuth';
import { useAuth } from '../../contexts/AuthContext';
import { CloudMark } from '../../components/Logo';
import Timecode from '../../components/Timecode';

export default function Login() {
  const { user, loading, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!loading && user) return <Navigate to="/admin" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = email.trim();
    const trimmedPw = password.trim();

    // Check custom credentials: ID = "tungtungbaje" & Password = "tungtungbaje"
    if (trimmedId === 'tungtungbaje' && trimmedPw === 'tungtungbaje') {
      loginAsDemo();
      return;
    }

    // Default admin fallback
    if (trimmedId === 'admin@fluffycloud.studio' && trimmedPw === 'fluffy2026') {
      loginAsDemo();
      return;
    }

    if (!trimmedId) return setError('Enter your ID or Email');
    if (!trimmedPw) return setError('Enter your Password');

    // Attempt Supabase login if provided valid email format
    if (/^\S+@\S+\.\S+$/.test(trimmedId) && trimmedPw.length >= 6) {
      setBusy(true);
      try {
        const { error: supaError } = await supabase.auth.signInWithPassword({ email: trimmedId, password: trimmedPw });
        setBusy(false);
        if (supaError) setError(supaError.message);
      } catch (err) {
        setBusy(false);
        setError(err instanceof Error ? err.message : 'Invalid credentials');
      }
    } else {
      setError('Invalid ID or Password. Use: tungtungbaje / tungtungbaje');
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden md:block">
        <video src="/media/p6.mp4" autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-ink/30" />
        <div className="absolute left-8 top-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
          <span className="blink h-2 w-2 rounded-full bg-accent" /> Edit bay · <Timecode />
        </div>
        <div className="absolute bottom-10 left-8 right-8">
          <p className="text-6xl font-extrabold leading-[0.9] tracking-[-0.05em]">
            Director’s <span className="font-serif font-normal italic text-accent">cut.</span>
          </p>
          <p className="mt-3 text-muted">Manage the showcase, upload new reels and read client messages.</p>
        </div>
      </div>

      <div className="flex flex-col justify-between p-6 md:p-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-paper">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <CloudMark className="h-6 w-9 text-paper" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-sm py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Admin access</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Sign in to the suite</h1>

          <form onSubmit={submit} className="mt-10 space-y-5" noValidate>
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">ID / Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-line bg-ink-2 px-4 py-3 outline-none focus:border-accent"
                placeholder="tungtungbaje"
              />
            </div>
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-line bg-ink-2 px-4 py-3 outline-none focus:border-accent"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="rounded-md bg-accent/10 p-3 text-sm text-accent">{error}</p>}
            <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3.5 font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted">
            <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
          </div>
          <button onClick={() => signInWithGoogle('Fluffy Cloud Admin')} className="flex w-full items-center justify-center gap-3 rounded-md border border-line py-3.5 font-medium transition-colors hover:border-paper cursor-pointer">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12s4.3 9.7 9.7 9.7c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z" />
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 rounded-md border border-dashed border-line p-4 font-mono text-xs text-muted">
            <p className="mb-1 uppercase tracking-widest text-paper">Admin Credentials</p>
            <p><span className="text-paper">ID:</span> tungtungbaje</p>
            <p><span className="text-paper">Password:</span> tungtungbaje</p>
          </div>
        </motion.div>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Only allow-listed emails can manage content.</p>
      </div>
    </div>
  );
}
