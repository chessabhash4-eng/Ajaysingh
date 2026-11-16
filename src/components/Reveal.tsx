import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE_OUT } from '../lib/api';

export default function Reveal({ children, delay = 0, className = '', y = 40 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
