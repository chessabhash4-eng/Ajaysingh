import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudMark } from './Logo';
import RollText from './RollText';
import { EASE, EASE_OUT, useSiteSettings } from '../lib/api';

export const NAV_LINKS = [
  { to: '/', label: 'Index' },
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function LocalTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const settings = useSiteSettings();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setHidden(y > 200 && y > last);
      last = y;
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? '-120%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[120] mix-blend-difference"
      >
        <div className="flex items-center justify-between px-5 py-5 text-paper md:px-10">
          <Link to="/" className="group flex items-center gap-2.5">
            <CloudMark className="h-6 w-9 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
            <span className="text-lg font-bold tracking-tight">
              Ajay Singh<sup className="ml-0.5 font-mono text-[9px]">®</sup>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.slice(1).map((l, i) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                {({ isActive }) => (
                  <>
                    <span className="text-[9px] opacity-60">0{i + 1}</span>
                    <RollText text={l.label} />
                    {isActive && <motion.span layoutId="nav-dot" className="h-1.5 w-1.5 rounded-full bg-paper" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] lg:flex">
            <span className="blink h-2 w-2 rounded-full bg-paper" />
            <LocalTime />
          </div>

          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] md:hidden" aria-label="Toggle menu">
            {open ? 'Close' : 'Menu'}
            <span className="flex flex-col gap-1">
              <span className={`block h-px w-6 bg-paper transition-transform ${open ? 'translate-y-[2.5px] rotate-45' : ''}`} />
              <span className={`block h-px w-6 bg-paper transition-transform ${open ? '-translate-y-[2.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-accent px-5 pb-8 pt-28 text-ink md:hidden"
          >
            <nav className="flex flex-col">
              {NAV_LINKS.map((l, i) => (
                <div key={l.to} className="overflow-hidden">
                  <motion.div initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: EASE_OUT }}>
                    <Link to={l.to} className="flex items-baseline gap-3 py-1 text-[15vw] font-extrabold uppercase leading-[0.95] tracking-tighter">
                      <span className="font-mono text-sm font-normal">0{i}</span>
                      {l.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
              <span>{settings.email}</span>
              <LocalTime />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
