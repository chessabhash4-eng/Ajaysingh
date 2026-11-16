import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import SplitText from './SplitText';
import Magnetic from './Magnetic';
import RollText from './RollText';
import { NAV_LINKS } from './Nav';
import { useSiteSettings } from '../lib/api';

const SOCIALS = ['Instagram', 'Vimeo', 'YouTube', 'LinkedIn'];

export default function Footer() {
  const settings = useSiteSettings();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink px-5 pt-24 md:px-10">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">[ Next scene ]</p>
          <h3 className="mt-5 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            Got raw footage?
            <br />
            <span className="font-serif font-normal italic text-accent">Let’s make it move.</span>
          </h3>
          <Magnetic className="mt-10">
            <Link to="/contact" className="group inline-flex items-center gap-4 rounded-full bg-paper px-7 py-4 text-ink transition-colors hover:bg-accent">
              <span className="font-semibold">Start a project</span>
              <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </Magnetic>
        </div>
        <div className="grid grid-cols-2 gap-10 md:col-span-6 md:grid-cols-3">
          <div>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Pages</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-lg">
                    <RollText text={l.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Socials</p>
            <ul className="space-y-2">
              {SOCIALS.map((s) => (
                <li key={s}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-lg">
                    <RollText text={s} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Say hi</p>
            <a href={`mailto:${settings.email}`} className="break-all text-lg underline decoration-accent decoration-2 underline-offset-4">
              {settings.email}
            </a>
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="mt-2 block text-base text-paper/80 hover:text-accent">
                {settings.phone}
              </a>
            )}
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {settings.location || 'Remote-first edit suite.'}
              <br />
              Cutting for clients worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 flex items-center justify-between border-t border-line py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <span>© {new Date().getFullYear()} Ajay Singh Studio</span>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 hover:text-paper">
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="pointer-events-none select-none whitespace-nowrap pb-2 text-center text-[16.5vw] font-extrabold uppercase leading-[0.8] tracking-[-0.06em]">
        <SplitText text="Ajay Singh" stagger={0.04} />
      </div>
    </footer>
  );
}
