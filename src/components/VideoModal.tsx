import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ArrowUpRight } from 'lucide-react';
import type { Project } from '../lib/api';
import { EASE } from '../lib/api';

export default function VideoModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[260] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-md md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ clipPath: 'inset(50% 0% 50% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(50% 0% 50% 0%)' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  {project.category} · {project.year}
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight md:text-4xl">{project.title}</h3>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link to={`/work/${project.slug}`} onClick={onClose} className="hidden items-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-paper sm:flex">
                  Case study <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:rotate-90" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-md bg-black">
              <video src={project.video_url} poster={project.thumbnail_url ?? undefined} autoPlay controls playsInline className="aspect-video w-full bg-black" />
            </div>
            {project.description && <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted md:text-base">{project.description}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
