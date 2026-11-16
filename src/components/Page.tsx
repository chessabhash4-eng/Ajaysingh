import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../lib/api';
import Footer from './Footer';

export default function Page({ children, footer = true, label }: { children: ReactNode; footer?: boolean; label?: string }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main>{children}</main>
      {footer && <Footer />}
      {/* enter: curtain lifts away */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[250] flex origin-top items-center justify-center bg-accent"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
      />
      {/* exit: curtain rises from the bottom */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[250] flex origin-bottom items-center justify-center bg-ink"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {label && <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{label}</span>}
      </motion.div>
    </>
  );
}
