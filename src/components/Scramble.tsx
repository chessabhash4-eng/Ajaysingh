import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

/** Text that "decodes" into place — on mount, and again on hover. */
export default function Scramble({ text, className = '', hover = true }: { text: string; className?: string; hover?: boolean }) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const D = 600;
    const loop = (t: number) => {
      const k = Math.min(1, (t - start) / D);
      const reveal = Math.floor(k * text.length);
      setOut(
        text
          .split('')
          .map((c, i) => (c === ' ' ? ' ' : i < reveal ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join('')
      );
      if (k < 1) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    run();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={className} onMouseEnter={hover ? run : undefined}>
      {out}
    </span>
  );
}
