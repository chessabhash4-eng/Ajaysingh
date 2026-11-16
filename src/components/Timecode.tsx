import { useEffect, useState } from 'react';
import { tc } from '../lib/api';

export default function Timecode({ className = '' }: { className?: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const s = performance.now();
    let r = 0;
    let last = 0;
    const loop = (n: number) => {
      if (n - last > 40) {
        setT((n - s) / 1000);
        last = n;
      }
      r = requestAnimationFrame(loop);
    };
    r = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(r);
  }, []);
  return <span className={`font-mono tabular-nums ${className}`}>{tc(t)}</span>;
}
