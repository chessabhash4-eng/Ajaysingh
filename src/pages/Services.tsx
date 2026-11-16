import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Plus, ArrowUpRight } from 'lucide-react';
import Page from '../components/Page';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import Scramble from '../components/Scramble';
import Magnetic from '../components/Magnetic';
import { EASE } from '../lib/api';

const SERVICES = [
  { t: 'Editing & Storytelling', d: 'From a mountain of rushes to a picture-locked film. We build structure, find the emotional beats and cut with rhythm.', items: ['Commercials & spots', 'Music videos', 'Documentary & long-form', 'Brand films', 'Trailers & teasers'] },
  { t: 'Color Grading', d: 'Look development, shot matching and finishing in DaVinci Resolve. HDR and SDR deliverables.', items: ['Look design', 'Shot matching', 'Skin tone work', 'HDR / SDR finishing', 'Film emulation'] },
  { t: 'Motion Graphics', d: 'Kinetic typography, titles and animated graphics that feel native to the cut.', items: ['Title sequences', 'Lower thirds', 'Kinetic type', 'Logo animation', '2.5D parallax'] },
  { t: 'Sound Design & Mix', d: 'Dialogue clean-up, SFX design, music edit and final mix so the film hits in the ears too.', items: ['Dialogue edit', 'SFX & foley', 'Music edit', 'Stereo & 5.1 mix', 'Loudness compliance'] },
  { t: 'Social & Short Form', d: 'Vertical cutdowns, hooks in the first second and versions for every platform.', items: ['Reels / TikTok / Shorts', 'Aspect-ratio versioning', 'Captions & subtitles', 'A/B hook variants'] },
];

const PROCESS = [
  { n: 'Ingest', d: 'We receive, back up, sync and organise every clip.' },
  { n: 'Assembly', d: 'All the good stuff, in order. The story starts showing itself.' },
  { n: 'Rough cut', d: 'Structure and pacing. Your first round of notes.' },
  { n: 'Fine cut', d: 'Frame-level polish, music and rhythm locked.' },
  { n: 'Color & Sound', d: 'Grading, mix and graphics bring it to life.' },
  { n: 'Delivery', d: 'Masters and versions for every screen.' },
];

export default function Services() {
  const [open, setOpen] = useState<number | null>(0);
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 0.8', 'end 0.6'] });
  const head = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <Page label="Services">
      <section className="px-5 pb-20 pt-36 md:px-10 md:pt-48">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <Scramble text="[ Services ]" />
        </p>
        <h1 className="mt-6 text-[14vw] font-extrabold uppercase leading-[0.85] tracking-[-0.055em] md:text-[10vw]">
          <SplitText text="Everything" stagger={0.04} />
          <br />
          <span className="font-serif font-normal normal-case italic tracking-[-0.02em] text-accent">
            <SplitText text="after action." by="word" delay={0.4} />
          </span>
        </h1>
      </section>

      <section className="px-5 pb-24 md:px-10">
        <div className="border-t border-line">
          {SERVICES.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.t} className="border-b border-line">
                <button onClick={() => setOpen(isOpen ? null : i)} className="group grid w-full grid-cols-12 items-center gap-4 py-8 text-left md:py-10">
                  <span className="col-span-2 font-mono text-xs text-muted md:col-span-1">0{i + 1}</span>
                  <span className={`col-span-8 text-3xl font-bold tracking-tight transition-colors md:col-span-10 md:text-6xl ${isOpen ? 'text-accent' : 'group-hover:text-amber'}`}>{s.t}</span>
                  <span className="col-span-2 flex justify-end md:col-span-1">
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`flex h-12 w-12 items-center justify-center rounded-full border ${isOpen ? 'border-accent bg-accent text-ink' : 'border-line'}`}>
                      <Plus className="h-5 w-5" />
                    </motion.span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="overflow-hidden">
                      <div className="grid gap-8 pb-10 md:grid-cols-12">
                        <p className="text-lg text-paper/80 md:col-span-6 md:col-start-2 md:text-2xl">{s.d}</p>
                        <ul className="space-y-2 md:col-span-4 md:col-start-9">
                          {s.items.map((it) => (
                            <li key={it} className="flex items-center gap-3 border-b border-line pb-2 font-mono text-sm uppercase tracking-wider text-muted">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 py-24 md:px-10">
        <div className="flex items-end justify-between">
          <h2 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
            <SplitText text="How a" by="word" /> <span className="font-serif font-normal italic text-amber"><SplitText text="cut" delay={0.15} /></span> <SplitText text="comes together" by="word" delay={0.25} />
          </h2>
        </div>
        <div ref={track} className="relative mt-16">
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-line md:block" />
          <motion.div style={{ width: head }} className="absolute left-0 top-[22px] hidden h-px bg-accent md:block" />
          <div className="grid gap-10 md:grid-cols-6 md:gap-6">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08}>
                <div className="relative">
                  <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-accent bg-ink font-mono text-xs text-accent">0{i + 1}</span>
                  <div className="mt-6 h-16 rounded-sm bg-linear-to-r from-accent/80 to-amber/60" style={{ width: `${55 + ((i * 17) % 45)}%` }} />
                  <h3 className="mt-5 text-xl font-bold">{p.n}</h3>
                  <p className="mt-2 text-sm text-muted">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-32 text-center md:px-10">
        <h2 className="mx-auto max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-8xl">
          Not sure what you need? <span className="font-serif font-normal italic text-accent">Neither were they.</span>
        </h2>
        <Magnetic className="mt-12">
          <Link to="/contact" className="group inline-flex items-center gap-3 rounded-full bg-paper px-8 py-5 text-lg font-semibold text-ink transition-colors hover:bg-accent">
            Tell us about your footage <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </Link>
        </Magnetic>
      </section>
    </Page>
  );
}
