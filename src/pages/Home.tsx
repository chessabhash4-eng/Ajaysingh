import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useScroll, useTransform, animate } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Quote } from 'lucide-react';
import Page from '../components/Page';
import SplitText from '../components/SplitText';
import Timecode from '../components/Timecode';
import Magnetic from '../components/Magnetic';
import Scramble from '../components/Scramble';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import Reveal from '../components/Reveal';
import { CloudMark } from '../components/Logo';
import { useFetch, useProjects, pad, EASE_OUT } from '../lib/api';
import type { Project, Testimonial } from '../lib/api';

/* ------------------------------------------------------------------ HERO */
function Hero({ ready, featured }: { ready: boolean; featured: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (featured.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % featured.length), 6500);
    return () => clearInterval(t);
  }, [featured.length]);

  const current = featured[idx];

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] w-full">
      <motion.div style={{ scale, borderRadius: radius }} className="absolute inset-0 overflow-hidden bg-ink-2">
        <AnimatePresence>
          <motion.video
            key={current?.id ?? 'reel'}
            src={current?.video_url ?? '/media/reel.mp4'}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: ready ? 1 : 0, scale: ready ? 1.02 : 1.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: EASE_OUT }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/25 to-ink" />
        <div className="scan absolute inset-0 opacity-30" />
      </motion.div>

      {/* viewfinder HUD */}
      <motion.div style={{ opacity: fade }} initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 1, duration: 1 }} className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-x-5 top-24 bottom-6 md:inset-x-10 md:top-24">
          {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'left-0 bottom-0 border-l-2 border-b-2', 'right-0 bottom-0 border-r-2 border-b-2'].map((c) => (
            <span key={c} className={`absolute h-6 w-6 border-paper/70 ${c}`} />
          ))}
          <div className="absolute left-5 top-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="blink h-2.5 w-2.5 rounded-full bg-accent" /> Rec
            <Timecode className="ml-3 text-paper/80" />
          </div>
          <div className="absolute right-5 top-4 hidden font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70 sm:block">
            4K · 23.976 · ISO 800 · ƒ/1.8
          </div>
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <span className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 bg-paper/50" />
            <span className="absolute left-1/2 top-1/2 h-8 w-px -translate-y-1/2 bg-paper/50" />
          </div>
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute right-5 top-12 hidden text-right font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70 md:block"
              >
                Now playing — <span className="text-paper">{current.title}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-20 flex h-full flex-col justify-end px-5 pb-12 md:px-10 md:pb-14">
        <div className="mb-6 flex flex-col justify-between gap-6 md:mb-4 md:flex-row md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 1, ease: EASE_OUT }}
            className="max-w-md text-lg leading-snug text-paper/90 md:text-xl"
          >
            An independent <span className="font-serif text-2xl italic text-amber md:text-[1.6rem]">video editing</span> studio cutting stories that refuse to sit still.
          </motion.p>
        </div>
        <h1 className="select-none font-extrabold uppercase leading-[0.8] tracking-[-0.055em]">
          <span className="block text-[22vw] md:text-[17.5vw]">
            <SplitText text="Ajay" play={ready} delay={0.15} stagger={0.06} duration={1.2} />
          </span>
          <span className="flex items-end gap-[2vw] text-[22vw] md:text-[17.5vw]">
            <SplitText text="Singh" play={ready} delay={0.45} stagger={0.06} duration={1.2} />
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={ready ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 1.1, type: 'spring', stiffness: 120, damping: 12 }}
              className="mb-[2.2vw] hidden md:block"
            >
              <span className="relative flex h-[9vw] w-[9vw] items-center justify-center">
                <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full">
                  <defs>
                    <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-paper font-mono" style={{ fontSize: 9.5, letterSpacing: 2.4 }}>
                    <textPath href="#circ">CUT • GRADE • SOUND • MOTION • STORY • </textPath>
                  </text>
                </svg>
                <CloudMark className="h-[2.6vw] w-[4vw] text-accent" />
              </span>
            </motion.span>
          </span>
        </h1>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------ MANIFESTO */
const MANIFESTO =
  'Every frame is a decision. We find the *rhythm* hiding in your footage and cut it into stories that *breathe,* *hit* hard and stay with people long after the screen goes *dark.*';

function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.22em] inline-block ${accent ? 'font-serif font-normal italic text-accent' : ''}`}>
      {children}
    </motion.span>
  );
}

function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });
  const words = MANIFESTO.split(' ');
  return (
    <section className="relative px-5 py-32 md:px-10 md:py-48">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <Scramble text="[ 01 — Manifesto ]" />
          </p>
          <div className="mt-6 hidden h-40 w-px bg-linear-to-b from-accent to-transparent md:block" />
        </div>
        <p ref={ref} className="text-[9vw] font-semibold leading-[1.02] tracking-[-0.03em] md:col-span-9 md:text-[4.8vw]">
          {words.map((w, i) => {
            const accent = w.startsWith('*');
            return (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={accent}>
                {w.replace(/\*/g, '')}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- MARQUEE */
function Marquee() {
  const a = ['Commercials', 'Music Videos', 'Documentary', 'Brand Films', 'Short Form', 'Color Grading'];
  const b = ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Sound Design', 'Motion Graphics', 'Avid'];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 2]);
  const row = (items: string[], outline: boolean) =>
    [...items, ...items].map((t, i) => (
      <span key={i} className="flex items-center gap-10 px-5">
        <span className={outline ? 'text-outline' : ''}>{t}</span>
        <CloudMark className={`h-[0.45em] w-[0.7em] ${outline ? 'text-paper' : 'text-ink'}`} />
      </span>
    ));
  return (
    <section ref={ref} className="relative overflow-hidden py-16">
      <motion.div style={{ rotate }} className="-mx-10 bg-accent py-5 text-ink">
        <div className="marquee flex w-max whitespace-nowrap text-5xl font-extrabold uppercase tracking-tight md:text-8xl">{row(a, false)}</div>
      </motion.div>
      <div className="-mx-10 mt-6 py-3">
        <div className="marquee-rev flex w-max whitespace-nowrap text-5xl font-extrabold uppercase tracking-tight md:text-8xl">{row(b, true)}</div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- FEATURED (horizontal) */
function FeaturedReel({ projects, loading, onOpen }: { projects: Project[]; loading: boolean; onOpen: (p: Project) => void }) {
  const target = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const m = () => {
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    m();
    const t = setTimeout(m, 400);
    window.addEventListener('resize', m);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', m);
    };
  }, [projects.length, loading]);

  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={target} className="relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-8 flex items-end justify-between px-5 md:mb-10 md:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <Scramble text="[ 02 — Featured cuts ]" />
            </p>
            <h2 className="mt-3 text-5xl font-bold tracking-[-0.04em] md:text-7xl">
              <SplitText text="Selected" /> <span className="font-serif font-normal italic text-amber"><SplitText text="reels" delay={0.2} /></span>
            </h2>
          </div>
          <Link to="/work" className="group hidden items-center gap-2 rounded-full border border-line px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-accent hover:text-accent sm:flex">
            All work <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-5 md:gap-8 md:px-10">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-video w-[82vw] animate-pulse rounded-md bg-ink-3 md:w-[46vw]" />)
            : projects.map((p, i) => (
                <div key={p.id} className="w-[82vw] md:w-[46vw]">
                  <VideoCard project={p} index={i} onOpen={onOpen} />
                </div>
              ))}
          {!loading && (
            <Link to="/work" data-cursor="Open" className="group flex aspect-video w-[60vw] flex-col items-center justify-center rounded-md border border-dashed border-line transition-colors hover:border-accent hover:bg-accent hover:text-ink md:w-[28vw]">
              <span className="text-4xl font-bold tracking-tight md:text-5xl">View all</span>
              <span className="font-serif text-3xl italic">the work →</span>
            </Link>
          )}
        </motion.div>

        {/* timeline scrubber */}
        <div className="mx-5 mt-10 md:mx-10">
          <div className="relative h-8 border-y border-line">
            <div className="absolute inset-0 flex">
              {Array.from({ length: 48 }).map((_, i) => (
                <span key={i} className={`flex-1 border-r ${i % 6 === 0 ? 'border-paper/30' : 'border-paper/10'}`} />
              ))}
            </div>
            <motion.div style={{ width: bar }} className="absolute inset-y-0 left-0 bg-accent/20" />
            <motion.div style={{ left: bar }} className="absolute -top-2 bottom-0 w-px bg-accent">
              <span className="absolute -left-1.5 -top-1 h-3 w-3 rotate-45 bg-accent" />
            </motion.div>
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            <span>V1 · Featured</span>
            <span>{pad(projects.length)} clips</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- SERVICES */
const SERVICES = [
  { n: '01', t: 'Edit & Story', d: 'Narrative structure, pacing and rhythm — from rough assembly to picture lock.' },
  { n: '02', t: 'Color Grading', d: 'Look development and shot matching in DaVinci Resolve. Moods you can feel.' },
  { n: '03', t: 'Motion Design', d: 'Titles, kinetic type and graphics that move with the cut, not on top of it.' },
  { n: '04', t: 'Sound Design', d: 'Mix, SFX and music edit. Half of what you see is what you hear.' },
];

function ServicesTeaser() {
  return (
    <section className="px-5 py-32 md:px-10">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <Scramble text="[ 03 — What we do ]" />
          </p>
          <h2 className="mt-3 text-5xl font-bold tracking-[-0.04em] md:text-7xl">
            <SplitText text="Post-production," by="word" />
            <br />
            <span className="font-serif font-normal italic text-paper/70">
              <SplitText text="end to end." by="word" delay={0.2} />
            </span>
          </h2>
        </div>
        <Link to="/services" className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-paper">
          All services <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
        </Link>
      </div>
      <div className="border-t border-line">
        {SERVICES.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <Link to="/services" className="group relative block overflow-hidden border-b border-line">
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100" />
              <div className="relative grid grid-cols-12 items-center gap-4 py-7 transition-colors duration-500 group-hover:text-ink md:py-10">
                <span className="col-span-2 font-mono text-xs md:col-span-1">{s.n}</span>
                <h3 className="col-span-10 text-3xl font-bold tracking-tight transition-transform duration-500 group-hover:translate-x-4 md:col-span-5 md:text-6xl">{s.t}</h3>
                <p className="col-span-12 text-sm text-muted transition-colors duration-500 group-hover:text-ink/80 md:col-span-5 md:text-base">{s.d}</p>
                <ArrowUpRight className="col-span-1 hidden h-8 w-8 -rotate-45 justify-self-end opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100 md:block" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- STATS */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: EASE_OUT, onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v}
      {suffix}
    </span>
  );
}

function Stats({ projects }: { projects: Project[] }) {
  const clients = useMemo(() => new Set(projects.map((p) => p.client).filter(Boolean)).size, [projects]);
  const cats = useMemo(() => new Set(projects.map((p) => p.category)).size, [projects]);
  const years = useMemo(() => {
    const ys = projects.map((p) => p.year).filter((y): y is number => !!y);
    return ys.length ? new Date().getFullYear() - Math.min(...ys) + 1 : 0;
  }, [projects]);
  const items = [
    { v: projects.length, s: '', l: 'Projects in the showcase' },
    { v: clients, s: '', l: 'Clients & collaborators' },
    { v: cats, s: '', l: 'Disciplines covered' },
    { v: years, s: '+', l: 'Years in the timeline' },
  ];
  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-10">
      <div className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.l} delay={i * 0.08} className="border-b border-r border-line p-6 md:p-10">
            <div className="text-6xl font-extrabold tracking-[-0.05em] md:text-8xl">
              <Counter to={it.v} suffix={it.s} />
            </div>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{it.l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- TESTIMONIALS */
function Testimonials() {
  const { data, loading } = useFetch<Testimonial[]>('/api/testimonials', []);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (data.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % data.length), 6000);
    return () => clearInterval(t);
  }, [data.length]);
  if (!loading && data.length === 0) return null;
  const cur = data[i];
  return (
    <section className="relative px-5 py-32 md:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        <Scramble text="[ 04 — Kind words ]" />
      </p>
      <div className="relative mt-10 min-h-[340px] md:min-h-[300px]">
        <Quote className="absolute -left-2 -top-6 h-24 w-24 text-accent/20" />
        {loading ? (
          <div className="h-40 animate-pulse rounded bg-ink-3" />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={cur.id} initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }} transition={{ duration: 0.7, ease: EASE_OUT }}>
              <blockquote className="relative max-w-5xl font-serif text-4xl leading-[1.1] md:text-6xl">“{cur.quote}”</blockquote>
              <div className="mt-8 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-bold text-ink">{cur.author.charAt(0)}</span>
                <div>
                  <p className="font-semibold">{cur.author}</p>
                  <p className="text-sm text-muted">{cur.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div className="mt-10 flex gap-2">
        {data.map((t, n) => (
          <button key={t.id} onClick={() => setI(n)} className="relative h-1 w-14 overflow-hidden rounded-full bg-line" aria-label={`Testimonial ${n + 1}`}>
            {n === i && <motion.span key={i} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 6, ease: 'linear' }} className="absolute inset-y-0 left-0 bg-accent" />}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CTA */
function CTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-15%', '5%']);
  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32">
      <motion.div style={{ x: x1 }} className="whitespace-nowrap text-[12vw] md:text-[10vw] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
        Let’s cut <span className="font-serif font-normal normal-case italic text-accent">something</span>
      </motion.div>
      <motion.div style={{ x: x2 }} className="text-outline whitespace-nowrap text-[12vw] md:text-[10vw] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
        unforgettable • unforgettable
      </motion.div>
      <div className="mt-14 flex justify-center">
        <Magnetic strength={0.5}>
          <Link to="/contact" data-cursor="Hello" className="group relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-accent text-ink md:h-56 md:w-56">
            <span className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0" />
            <span className="relative text-center text-xl font-bold leading-tight md:text-2xl">
              Start a<br />
              <span className="font-serif text-3xl font-normal italic md:text-4xl">project</span>
            </span>
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- PAGE */
export default function Home({ ready }: { ready: boolean }) {
  const { data: projects, loading, error } = useProjects();
  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <Page label="Index">
      <Hero ready={ready} featured={featured} />
      <Manifesto />
      <Marquee />
      {error && <p className="px-10 text-center font-mono text-sm text-accent">Couldn’t load the reel: {error}</p>}
      <FeaturedReel projects={featured.length ? featured : projects.slice(0, 5)} loading={loading} onOpen={setOpen} />
      <ServicesTeaser />
      <Stats projects={projects} />
      <Testimonials />
      <CTA />
      <div className="flex justify-center pb-10">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-paper">
          Rewind <ArrowDown className="h-3.5 w-3.5 rotate-180" />
        </button>
      </div>
      <VideoModal project={open} onClose={() => setOpen(null)} />
    </Page>
  );
}
