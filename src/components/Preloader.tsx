import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE, tc } from '../lib/api';
import { CloudMark } from './Logo';

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const start = performance.now();
    const D = 2300;
    let raf = 0;
    let to: ReturnType<typeof setTimeout> | undefined;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / D);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      setP(Math.round(e * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else to = setTimeout(() => done.current(), 380);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (to) clearTimeout(to);
    };
  }, []);

  const words = ['INGEST', 'SYNC', 'ASSEMBLE', 'CUT', 'GRADE', 'MIX', 'EXPORT'];
  const word = words[Math.min(words.length - 1, Math.floor((p / 100) * words.length))];

  return (
    <motion.div
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 1.1, ease: EASE }}
      className="fixed inset-0 z-[300] flex flex-col justify-between bg-ink p-5 md:p-10"
    >
      <div className="flex items-start justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        <div className="flex items-center gap-3 text-paper">
          <CloudMark className="h-5 w-8 text-paper" /> Ajay Singh
        </div>
        <div className="text-right">
          <span className="blink mr-2 inline-block h-2 w-2 rounded-full bg-accent" />
          Loading reel
        </div>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <div className="mb-2 text-paper">{word}</div>
          <div className="tabular-nums">TC {tc((p / 100) * 12.5)}</div>
        </div>
        <div className="font-display text-[34vw] font-extrabold leading-[0.78] tracking-[-0.06em] tabular-nums md:text-[24vw]">
          {p}
          <span className="font-serif text-[0.35em] font-normal italic text-accent">%</span>
        </div>
      </div>

      <div>
        <div className="film-holes h-3 bg-paper/10" />
        <div className="relative h-10 overflow-hidden bg-ink-3">
          <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${p}%` }} />
          <div className="absolute inset-0 flex">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-ink/60" />
            ))}
          </div>
        </div>
        <div className="film-holes h-3 bg-paper/10" />
      </div>
    </motion.div>
  );
}
