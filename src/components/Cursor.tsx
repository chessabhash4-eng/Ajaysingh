import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.('[data-cursor]') as HTMLElement | null;
      setLabel(el?.dataset.cursor ?? null);
      setHover(!!t?.closest?.('a,button,input,textarea,select,label'));
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', d);
    window.addEventListener('mouseup', u);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', d);
      window.removeEventListener('mouseup', u);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const size = label ? 104 : hover ? 54 : 30;

  return (
    <>
      <motion.div style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[400] mix-blend-difference">
        <div className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-paper" />
      </motion.div>
      <motion.div style={{ x: rx, y: ry }} className="pointer-events-none fixed left-0 top-0 z-[399]">
        <motion.div
          animate={{ width: size, height: size, x: -size / 2, y: -size / 2, scale: down ? 0.85 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className={`flex items-center justify-center rounded-full ${
            label ? 'bg-accent text-ink' : 'border border-paper/60 mix-blend-difference'
          }`}
        >
          {label && (
            <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="font-mono text-[11px] font-bold uppercase tracking-widest">
              {label}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
