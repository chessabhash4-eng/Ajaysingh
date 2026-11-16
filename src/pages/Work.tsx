import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Film } from 'lucide-react';
import Page from '../components/Page';
import SplitText from '../components/SplitText';
import Scramble from '../components/Scramble';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import { useProjects, pad, EASE_OUT } from '../lib/api';
import type { Project } from '../lib/api';

const LAYOUT = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7', 'md:col-span-12'];
const HEIGHT = ['md:h-[32vw]', 'md:h-[32vw]', 'md:h-[32vw]', 'md:h-[32vw]', 'md:h-[46vw]'];

export default function Work() {
  const { data: projects, loading, error, refetch } = useProjects();
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [open, setOpen] = useState<Project | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const cats = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const list = useMemo(() => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)), [projects, filter]);

  return (
    <Page label="Work">
      <section className="px-5 pb-16 pt-36 md:px-10 md:pt-44">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <Scramble text="[ The showcase ]" />
        </p>
        <h1 className="mt-4 flex flex-wrap items-start text-[19vw] font-extrabold uppercase leading-[0.82] tracking-[-0.06em] md:text-[13vw]">
          <SplitText text="Work" stagger={0.07} duration={1.1} />
          <motion.sup initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="ml-3 mt-[2vw] font-mono text-[4vw] font-normal tracking-normal text-accent md:text-[2vw]">
            ({pad(projects.length)})
          </motion.sup>
          <span className="ml-auto self-end pb-[1.5vw] font-serif text-[6vw] font-normal normal-case italic tracking-normal text-paper/60 md:text-[3.2vw]">
            <SplitText text="cut by hand" by="word" delay={0.4} />
          </span>
        </h1>

        <div className="mt-12 flex flex-col gap-5 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`relative rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${filter === c ? 'text-ink' : 'text-muted hover:text-paper'}`}
              >
                {filter === c && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">
                  {c}
                  {c !== 'All' && <span className="ml-1.5 opacity-50">{projects.filter((p) => p.category === c).length}</span>}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-full border border-line p-1 font-mono text-xs uppercase tracking-widest">
            {(['grid', 'list'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 transition-colors ${view === v ? 'bg-accent text-ink' : 'text-muted hover:text-paper'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-32 md:px-10">
        {error && (
          <div className="rounded-md border border-accent/40 p-8 text-center">
            <p className="text-accent">Couldn’t load projects: {error}</p>
            <button onClick={refetch} className="mt-4 rounded-full bg-paper px-5 py-2 text-sm text-ink">Retry</button>
          </div>
        )}
        {loading ? (
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-12">
            {LAYOUT.slice(0, 4).map((l, i) => (
              <div key={i} className={l}>
                <div className={`aspect-video animate-pulse rounded-md bg-ink-3 ${HEIGHT[i]} md:aspect-auto`} />
                <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-ink-3" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center text-muted">
            <Film className="mb-4 h-10 w-10" />
            <p>No projects in this category yet.</p>
          </div>
        ) : view === 'grid' ? (
          <motion.div layout className="grid gap-x-6 gap-y-14 md:grid-cols-12 md:gap-y-20">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div
                  layout
                  key={p.id}
                  className={LAYOUT[i % 5]}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                >
                  <VideoCard project={p} index={i} onOpen={setOpen} mediaClass={`aspect-video md:aspect-auto ${HEIGHT[i % 5]}`} />
                  <Link to={`/work/${p.slug}`} className="group mt-3 inline-flex items-center gap-1.5 pl-9 font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-accent">
                    Case study <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="relative border-t border-line" onMouseLeave={() => setHoverIdx(null)}>
            {list.map((p, i) => (
              <Link
                key={p.id}
                to={`/work/${p.slug}`}
                data-cursor="View"
                onMouseEnter={() => setHoverIdx(i)}
                className="group grid grid-cols-12 items-center gap-4 border-b border-line py-6 transition-colors md:py-8"
              >
                <span className="col-span-2 font-mono text-xs text-muted md:col-span-1">{pad(i + 1)}</span>
                <h3 className={`col-span-10 text-3xl font-bold tracking-tight transition-all duration-500 md:col-span-6 md:text-6xl ${hoverIdx !== null && hoverIdx !== i ? 'opacity-25' : ''} group-hover:translate-x-3 group-hover:text-accent`}>
                  {p.title}
                </h3>
                <span className="col-span-6 text-sm text-muted md:col-span-2">{p.client}</span>
                <span className="col-span-4 font-mono text-xs uppercase tracking-widest text-muted md:col-span-2">{p.category}</span>
                <span className="col-span-2 hidden text-right font-mono text-xs text-muted md:block">{p.year}</span>
              </Link>
            ))}
            <AnimatePresence>
              {hoverIdx !== null && list[hoverIdx] && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="pointer-events-none fixed right-10 top-1/2 z-40 hidden aspect-video w-[30vw] -translate-y-1/2 overflow-hidden rounded-md shadow-2xl md:block"
                >
                  <video key={list[hoverIdx].id} src={list[hoverIdx].video_url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>
      <VideoModal project={open} onClose={() => setOpen(null)} />
    </Page>
  );
}
