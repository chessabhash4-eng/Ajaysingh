import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASE_OUT } from '../lib/api';

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  by?: 'char' | 'word';
  play?: boolean;
  duration?: number;
};

export default function SplitText({ text, className = '', delay = 0, stagger = 0.035, by = 'char', play = true, duration = 1 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  const go = play && inView;
  const parts = by === 'char' ? Array.from(text) : text.split(' ');

  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={text}>
      {parts.map((p, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '115%', rotate: 7 }}
            animate={go ? { y: '0%', rotate: 0 } : { y: '115%', rotate: 7 }}
            transition={{ duration, ease: EASE_OUT, delay: delay + i * stagger }}
          >
            {p === ' ' ? '\u00A0' : p}
            {by === 'word' && i < parts.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
