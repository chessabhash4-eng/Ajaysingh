import type { Project, Testimonial, Message, AdminRow } from './api';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Neon Nights · Cyberpunk Cinematic',
    slug: 'neon-nights',
    category: 'Commercial',
    client: 'Hyperion Media',
    year: 2026,
    role: 'Lead Editor & Colorist',
    description: 'A high-octane commercial cut featuring sharp transitions, neon grade, and sync sound design for urban nightlife.',
    video_url: '/media/p1.mp4',
    thumbnail_url: null,
    duration: '01:45',
    featured: true,
    sort_order: 1,
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 2,
    title: 'Echoes of Silence · Short Documentary',
    slug: 'echoes-of-silence',
    category: 'Documentary',
    client: 'Wild Earth Studio',
    year: 2025,
    role: 'Editor & Sound Designer',
    description: 'An intimate portrait of solitude and nature, paced with breathing room and nuanced color palette.',
    video_url: '/media/p2.mp4',
    thumbnail_url: null,
    duration: '03:20',
    featured: true,
    sort_order: 2,
    created_at: '2026-01-15T12:00:00Z',
  },
  {
    id: 3,
    title: 'Velocity · Streetwear Campaign',
    slug: 'velocity-streetwear',
    category: 'Fashion',
    client: 'AURA London',
    year: 2026,
    role: 'Editor',
    description: 'Rhythmic, syncopated editorial with match cuts and speed ramps showcasing contemporary youth couture.',
    video_url: '/media/p3.mp4',
    thumbnail_url: null,
    duration: '00:58',
    featured: true,
    sort_order: 3,
    created_at: '2026-02-01T15:00:00Z',
  },
  {
    id: 4,
    title: 'Midnight Mirage · Music Video',
    slug: 'midnight-mirage',
    category: 'Music Video',
    client: 'Astral Records',
    year: 2025,
    role: 'Director & Editor',
    description: 'Surreal narrative blended with performance art and fluid analog video glitches.',
    video_url: '/media/p4.mp4',
    thumbnail_url: null,
    duration: '04:12',
    featured: false,
    sort_order: 4,
    created_at: '2026-02-10T18:00:00Z',
  },
  {
    id: 5,
    title: 'Horizon Bound · Auto Brand Film',
    slug: 'horizon-bound',
    category: 'Commercial',
    client: 'Vanguard Motors',
    year: 2026,
    role: 'Colorist & Editor',
    description: 'Expansive landscapes meeting cutting-edge EV engineering through dynamic lens flares and sweeping cuts.',
    video_url: '/media/p5.mp4',
    thumbnail_url: null,
    duration: '02:05',
    featured: true,
    sort_order: 5,
    created_at: '2026-02-20T20:00:00Z',
  },
  {
    id: 6,
    title: 'Solitude Bay · Narrative Teaser',
    slug: 'solitude-bay',
    category: 'Narrative',
    client: 'Nordic Pictures',
    year: 2025,
    role: 'Assembly & Finishing Editor',
    description: 'Tense psychological thriller teaser built around suspenseful micro-cuts and deep bass undertones.',
    video_url: '/media/p6.mp4',
    thumbnail_url: null,
    duration: '01:30',
    featured: false,
    sort_order: 6,
    created_at: '2026-02-25T21:00:00Z',
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: 'Ajay Singh turned raw rushes into pure cinema. Their pacing and instinctive rhythm brought our vision to life.',
    author: 'Elena Rostova',
    role: 'Director, Hyperion',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    quote: 'The sharpest edit suite in the industry. Turnaround was blazing fast without compromising a single frame of quality.',
    author: 'Marcus Vance',
    role: 'Creative Director, AURA',
    created_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 3,
    quote: 'Exceptional attention to color fidelity and audio nuances. They elevated our brand film to film festival standards.',
    author: 'Sarah Jenkins',
    role: 'Head of Brand, Vanguard',
    created_at: '2026-01-03T00:00:00Z',
  },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    name: 'Aarav Patel',
    email: 'aarav@creativehub.com',
    company: 'Creative Hub',
    budget: '$5k - $10k',
    project_type: 'Music Video',
    message: 'Looking for an editor to handle color grading and final cut for our upcoming indie single.',
    is_read: false,
    created_at: '2026-03-01T10:00:00Z',
  },
];

export const INITIAL_ADMINS: AdminRow[] = [
  {
    id: 1,
    email: 'tungtungbaje',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    email: 'admin@fluffycloud.studio',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export type SiteSettings = {
  email: string;
  phone: string;
  location?: string;
};

export const INITIAL_SETTINGS: SiteSettings = {
  email: 'hello@fluffycloud.studio',
  phone: '+91 98765 43210',
  location: 'Remote-first edit suite / Worldwide',
};

