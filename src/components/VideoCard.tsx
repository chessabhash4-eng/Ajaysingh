import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Project } from '../lib/api';
import { pad, videoSrc } from '../lib/api';

const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function VideoCard({
  project,
  index,
  onOpen,
  mediaClass = 'aspect-video',
  showMeta = true,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
  mediaClass?: string;
  showMeta?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const inView = useInView(ref, { amount: 0.6 });

  useEffect(() => {
    if (!isTouch()) return;
    const v = vRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  const enter = () => {
    setHover(true);
    vRef.current?.play().catch(() => {});
  };
  const leave = () => {
    setHover(false);
    const v = vRef.current;
    if (v) v.pause();
  };

  return (
    <div ref={ref} className="group">
      <button
        type="button"
        data-cursor="Play"
        onClick={() => onOpen(project)}
        onMouseEnter={enter}
        onMouseLeave={leave}
        className={`relative block w-full overflow-hidden rounded-[6px] bg-ink-3 text-left ${mediaClass}`}
      >
        {project.thumbnail_url && (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hover ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
        <video
          ref={vRef}
          src={videoSrc(project.video_url)}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full scale-[1.06] object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100"
        />
        <div className="scan absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />

        {/* viewfinder corners */}
        {['left-3 top-3 border-l border-t', 'right-3 top-3 border-r border-t', 'left-3 bottom-3 border-l border-b', 'right-3 bottom-3 border-r border-b'].map((c) => (
          <span key={c} className={`absolute h-4 w-4 border-paper/80 opacity-0 transition-all duration-500 group-hover:opacity-100 ${c}`} />
        ))}

        <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/90">
          <span className={`h-1.5 w-1.5 rounded-full ${hover ? 'blink bg-accent' : 'bg-paper/60'}`} />
          {hover ? 'Playing' : project.category}
        </div>
        {project.duration && (
          <div className="absolute right-4 top-4 rounded-sm bg-ink/60 px-2 py-1 font-mono text-[10px] tracking-widest text-paper backdrop-blur">{project.duration}</div>
        )}

        <motion.div
          className="absolute bottom-0 left-0 h-[3px] bg-accent"
          initial={false}
          animate={{ width: hover ? '100%' : '0%' }}
          transition={{ duration: hover ? 8 : 0.4, ease: 'linear' }}
        />
      </button>

      {showMeta && (
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="pt-1.5 font-mono text-xs text-muted">{pad(index + 1)}</span>
            <div>
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{project.title}</h3>
              <p className="mt-1 text-sm text-muted">
                {project.client || 'Independent'} <span className="mx-1.5">·</span> {project.category}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-muted">{project.year}</span>
        </div>
      )}
    </div>
  );
}
