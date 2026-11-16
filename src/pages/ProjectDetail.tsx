import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react';
import Page from '../components/Page';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import { useProjects, pad, EASE_OUT } from '../lib/api';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: projects, loading, error } = useProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = idx >= 0 ? projects[idx] : null;
  const next = projects.length ? projects[(idx + 1) % projects.length] : null;
  const vRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'start 0.2'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);

  if (loading) {
    return (
      <Page footer={false}>
        <div className="flex min-h-screen items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-muted">
          <span className="blink mr-3 h-2 w-2 rounded-full bg-accent" /> Loading footage…
        </div>
      </Page>
    );
  }

  if (error || !project) {
    return (
      <Page>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Error 404 · Missing media</p>
          <h1 className="mt-4 text-6xl font-extrabold tracking-tight md:text-8xl">Clip offline.</h1>
          <p className="mt-4 text-muted">{error || 'This project couldn’t be found.'}</p>
          <Link to="/work" className="mt-8 rounded-full bg-paper px-6 py-3 text-ink">Back to work</Link>
        </div>
      </Page>
    );
  }

  const meta = [
    ['Client', project.client || 'Independent'],
    ['Year', project.year ?? '—'],
    ['Role', project.role || 'Edit'],
    ['Runtime', project.duration || '—'],
    ['Category', project.category],
  ];

  return (
    <Page label={project.title}>
      <section className="px-5 pt-32 md:px-10 md:pt-40" key={project.id}>
        <Link to="/work" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-paper">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> All work
        </Link>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Project {pad(idx + 1)} / {pad(projects.length)}
        </p>
        <h1 className="mt-3 text-[13vw] font-extrabold leading-[0.85] tracking-[-0.055em] md:text-[9vw]">
          <SplitText text={project.title} by="word" stagger={0.08} duration={1.1} />
        </h1>

        <div className="mt-12 grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-5">
          {meta.map(([k, v], i) => (
            <motion.div key={k} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08, ease: EASE_OUT, duration: 0.8 }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{k}</p>
              <p className="mt-1.5 text-lg font-medium">{v}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-5 py-14 md:px-10">
        <motion.div ref={frame} style={{ scale }} className="relative overflow-hidden rounded-lg bg-black">
          <video
            ref={vRef}
            src={project.video_url}
            poster={project.thumbnail_url ?? undefined}
            controls={playing}
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            className="aspect-video w-full bg-black object-cover"
          />
          {!playing && (
            <button
              data-cursor="Play"
              onClick={() => {
                setPlaying(true);
                vRef.current?.play();
              }}
              className="group absolute inset-0 flex items-center justify-center bg-ink/30"
            >
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-ink transition-transform duration-500 group-hover:scale-110 md:h-32 md:w-32">
                <Play className="ml-1 h-8 w-8 fill-ink md:h-10 md:w-10" />
              </span>
              <span className="absolute bottom-6 left-6 font-mono text-[11px] uppercase tracking-[0.2em]">▶ Play film · {project.duration}</span>
            </button>
          )}
        </motion.div>
      </section>

      <section className="grid gap-10 px-5 py-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">[ The brief & the cut ]</p>
        </div>
        <Reveal className="md:col-span-8">
          <p className="text-2xl leading-snug tracking-tight md:text-4xl">{project.description || 'An Ajay Singh edit.'}</p>
        </Reveal>
      </section>

      {next && next.id !== project.id && (
        <Link to={`/work/${next.slug}`} data-cursor="Next" className="group relative block overflow-hidden border-t border-line px-5 py-24 md:px-10 md:py-32">
          <video src={next.video_url} muted loop autoPlay playsInline className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-40" />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Next project</p>
            <h2 className="mt-3 flex items-center gap-6 text-[11vw] font-extrabold leading-[0.9] tracking-[-0.05em] md:text-[7vw]">
              {next.title}
              <ArrowUpRight className="h-[0.7em] w-[0.7em] shrink-0 transition-transform duration-500 group-hover:rotate-45 group-hover:text-accent" />
            </h2>
          </div>
        </Link>
      )}
    </Page>
  );
}
