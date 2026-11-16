import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Page from '../components/Page';
import SplitText from '../components/SplitText';
import Reveal from '../components/Reveal';
import Scramble from '../components/Scramble';
import { CloudMark } from '../components/Logo';

const TIMELINE = [
  { y: '2017', t: 'First cut', d: 'Started as a one-person bedroom suite editing skate clips and friends’ band videos.' },
  { y: '2019', t: 'Going commercial', d: 'First agency brief. A 30-second spot that ran nationally — we haven’t stopped since.' },
  { y: '2021', t: 'Ajay Singh Studio is born', d: 'Named after the soft way we treat footage and the heavy way the work lands.' },
  { y: '2024', t: 'Color & sound in-house', d: 'Added a grading bay and a sound room so every film leaves finished.' },
  { y: '2026', t: 'Today', d: 'A remote-first studio cutting for brands, artists and filmmakers worldwide.' },
];

const TOOLS = ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Avid Media Composer', 'Cinema 4D', 'Pro Tools', 'Frame.io', 'Final Cut Pro'];

const VALUES = [
  { t: 'Rhythm first', d: 'We edit to a pulse. Music, breath, footsteps — every cut lands on something.' },
  { t: 'Less, but louder', d: 'The best frame is often the one you leave out. We’re ruthless so your story isn’t.' },
  { t: 'Soft on people', d: 'Hard on the timeline, easy to work with. Clear notes, fast turnarounds, zero ego.' },
];

export default function About() {
  const img = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: img, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const clip = useTransform(scrollYProgress, [0, 0.4], ['inset(18% 12% 18% 12%)', 'inset(0% 0% 0% 0%)']);

  return (
    <Page label="About">
      <section className="px-5 pb-20 pt-36 md:px-10 md:pt-48">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <Scramble text="[ About the studio ]" />
        </p>
        <h1 className="mt-6 max-w-[16ch] text-[12vw] font-bold leading-[0.9] tracking-[-0.05em] md:text-[7.5vw]">
          <SplitText text="We’re the quiet ones behind the" by="word" stagger={0.06} />{' '}
          <span className="font-serif font-normal italic text-accent">
            <SplitText text="loud edits." by="word" delay={0.5} />
          </span>
        </h1>
      </section>

      <section className="px-5 md:px-10">
        <motion.div ref={img} style={{ clipPath: clip }} className="relative h-[60vh] overflow-hidden rounded-lg md:h-[85vh]">
          <motion.img style={{ y }} src="/media/studio.jpg" alt="Ajay Singh edit suite" className="absolute inset-0 h-[130%] w-full -translate-y-[10%] object-cover" />
          <div className="absolute inset-0 bg-ink/20" />
          <div className="absolute bottom-6 left-6 font-mono text-[11px] uppercase tracking-[0.2em]">Suite A — where the magic is mostly coffee</div>
        </motion.div>
      </section>

      <section className="grid gap-10 px-5 py-32 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">[ Our story ]</p>
          <CloudMark className="float-y mt-10 hidden h-24 w-36 text-accent md:block" />
        </div>
        <div className="space-y-8 text-xl leading-relaxed text-paper/85 md:col-span-8 md:text-3xl md:leading-snug">
          <Reveal>
            <p>
              Ajay Singh is an editing studio for people who care how a story <span className="font-serif italic text-amber">feels</span>, not just how it looks. We take
              hours of raw footage and shape it into something with a heartbeat.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted">
              Commercials, music videos, documentaries, social-first content — the format changes, the obsession doesn’t. We sit in the dark so your audience doesn’t have to.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10">
        <h2 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
          <SplitText text="The" /> <span className="font-serif font-normal italic"><SplitText text="timeline" delay={0.1} /></span>
        </h2>
        <div className="relative mt-16">
          <div className="absolute left-[7px] top-0 h-full w-px bg-line md:left-1/2" />
          {TIMELINE.map((e, i) => (
            <Reveal key={e.y} delay={0.05}>
              <div className={`relative mb-16 grid gap-4 pl-10 md:grid-cols-2 md:gap-20 md:pl-0 ${i % 2 ? 'md:[&>div:first-child]:order-2' : ''}`}>
                <span className="absolute left-0 top-3 h-[15px] w-[15px] rounded-full border-2 border-accent bg-ink md:left-1/2 md:-translate-x-1/2" />
                <div className={i % 2 ? 'md:pl-10' : 'md:pr-10 md:text-right'}>
                  <span className="text-outline-accent text-7xl font-extrabold tracking-tight md:text-9xl">{e.y}</span>
                </div>
                <div className={i % 2 ? 'md:pr-10 md:text-right' : 'md:pl-10'}>
                  <h3 className="text-2xl font-bold md:mt-6 md:text-3xl">{e.t}</h3>
                  <p className="mt-2 max-w-md text-muted md:inline-block">{e.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 py-24 md:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">[ What we believe ]</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.1}>
              <div className="group h-full rounded-lg border border-line p-8 transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-ink">
                <span className="font-mono text-xs">0{i + 1}</span>
                <h3 className="mt-16 text-3xl font-bold tracking-tight">{v.t}</h3>
                <p className="mt-3 text-muted transition-colors group-hover:text-ink/80">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="overflow-hidden py-24">
        <p className="px-5 font-mono text-xs uppercase tracking-[0.2em] text-muted md:px-10">[ In the toolkit ]</p>
        <div className="mt-10 flex flex-wrap gap-3 px-5 md:px-10">
          {TOOLS.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.6, rotate: i % 2 ? 6 : -6 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 180, damping: 14 }}
              className="rounded-full border border-line px-6 py-3 text-xl font-medium transition-colors hover:border-amber hover:text-amber md:text-3xl"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </section>
    </Page>
  );
}
