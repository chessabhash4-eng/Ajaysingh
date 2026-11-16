import { useCallback, useEffect, useState } from 'react';
import supabase from './supabase';
import { INITIAL_PROJECTS, INITIAL_TESTIMONIALS, INITIAL_MESSAGES, INITIAL_ADMINS, INITIAL_SETTINGS } from './mockData';
import type { SiteSettings } from './mockData';

export type { SiteSettings };

export type Project = {
  id: number;
  title: string;
  slug: string;
  category: string;
  client: string | null;
  year: number | null;
  role: string | null;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Message = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  project_type: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Testimonial = {
  id: number;
  quote: string;
  author: string;
  role: string | null;
  created_at: string;
};

export type AdminRow = { id: number; email: string; created_at: string };

const STORAGE_KEYS = {
  projects: 'fc_local_projects',
  testimonials: 'fc_local_testimonials',
  messages: 'fc_local_messages',
  admins: 'fc_local_admins',
  settings: 'fc_local_settings',
};

function getLocal<T>(key: string, def: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(def));
      return def;
    }
    return JSON.parse(val);
  } catch {
    return def;
  }
}

function setLocal<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const method = (opts.method ?? 'GET').toUpperCase();
  const [cleanPath, queryStr] = path.split('?');
  const query = new URLSearchParams(queryStr || '');

  // Handle Mocked Local Endpoints
  if (cleanPath === '/api/projects') {
    let projs = getLocal<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
    if (method === 'GET') {
      const slug = query.get('slug');
      const featured = query.get('featured');
      if (slug) {
        const found = projs.find((p) => p.slug === slug);
        if (!found) throw new Error('Project not found');
        return found as T;
      }
      if (featured === 'true') projs = projs.filter((p) => p.featured);
      projs.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      return projs as T;
    }
    if (method === 'POST') {
      const body = (opts.body || {}) as Partial<Project>;
      const newProj: Project = {
        id: Date.now(),
        title: body.title || 'Untitled',
        slug: body.slug || String(body.title || 'project').toLowerCase().replace(/\s+/g, '-'),
        category: body.category || 'General',
        client: body.client || null,
        year: Number(body.year) || new Date().getFullYear(),
        role: body.role || 'Editor',
        description: body.description || null,
        video_url: body.video_url || '/media/reel.mp4',
        thumbnail_url: body.thumbnail_url || null,
        duration: body.duration || '01:00',
        featured: !!body.featured,
        sort_order: Number(body.sort_order) || projs.length + 1,
        created_at: new Date().toISOString(),
      };
      projs.push(newProj);
      setLocal(STORAGE_KEYS.projects, projs);
      return newProj as T;
    }
    if (method === 'PUT') {
      const body = (opts.body || {}) as Partial<Project> & { id: number };
      projs = projs.map((p) => (p.id === body.id ? { ...p, ...body } : p));
      setLocal(STORAGE_KEYS.projects, projs);
      return projs.find((p) => p.id === body.id) as T;
    }
    if (method === 'DELETE') {
      const id = Number(query.get('id') || (opts.body as { id?: number })?.id);
      projs = projs.filter((p) => p.id !== id);
      setLocal(STORAGE_KEYS.projects, projs);
      return { ok: true } as T;
    }
  }

  if (cleanPath === '/api/testimonials') {
    let tests = getLocal<Testimonial[]>(STORAGE_KEYS.testimonials, INITIAL_TESTIMONIALS);
    if (method === 'GET') return tests as T;
    if (method === 'POST') {
      const body = (opts.body || {}) as Partial<Testimonial>;
      const newT: Testimonial = {
        id: Date.now(),
        quote: body.quote || '',
        author: body.author || 'Anonymous',
        role: body.role || null,
        created_at: new Date().toISOString(),
      };
      tests.push(newT);
      setLocal(STORAGE_KEYS.testimonials, tests);
      return newT as T;
    }
    if (method === 'DELETE') {
      const id = Number(query.get('id') || (opts.body as { id?: number })?.id);
      tests = tests.filter((t) => t.id !== id);
      setLocal(STORAGE_KEYS.testimonials, tests);
      return { ok: true } as T;
    }
  }

  if (cleanPath === '/api/messages') {
    let msgs = getLocal<Message[]>(STORAGE_KEYS.messages, INITIAL_MESSAGES);
    if (method === 'GET') {
      msgs.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      return msgs as T;
    }
    if (method === 'POST') {
      const body = (opts.body || {}) as Partial<Message>;
      const newM: Message = {
        id: Date.now(),
        name: body.name || 'Anonymous',
        email: body.email || 'anon@example.com',
        company: body.company || null,
        budget: body.budget || null,
        project_type: body.project_type || null,
        message: body.message || '',
        is_read: false,
        created_at: new Date().toISOString(),
      };
      msgs.unshift(newM);
      setLocal(STORAGE_KEYS.messages, msgs);
      return { ok: true, id: newM.id } as T;
    }
    if (method === 'PUT') {
      const body = (opts.body || {}) as Partial<Message> & { id: number };
      msgs = msgs.map((m) => (m.id === body.id ? { ...m, ...body } : m));
      setLocal(STORAGE_KEYS.messages, msgs);
      return msgs.find((m) => m.id === body.id) as T;
    }
    if (method === 'DELETE') {
      const id = Number(query.get('id') || (opts.body as { id?: number })?.id);
      msgs = msgs.filter((m) => m.id !== id);
      setLocal(STORAGE_KEYS.messages, msgs);
      return { ok: true } as T;
    }
  }

  if (cleanPath === '/api/admins') {
    let admins = getLocal<AdminRow[]>(STORAGE_KEYS.admins, INITIAL_ADMINS);
    if (method === 'GET') {
      if (query.get('me')) {
        return { email: 'tungtungbaje', isAdmin: true } as T;
      }
      return admins as T;
    }
    if (method === 'POST') {
      const body = (opts.body || {}) as { email?: string };
      const newA: AdminRow = {
        id: Date.now(),
        email: (body.email || '').toLowerCase().trim(),
        created_at: new Date().toISOString(),
      };
      admins.push(newA);
      setLocal(STORAGE_KEYS.admins, admins);
      return newA as T;
    }
    if (method === 'DELETE') {
      const id = Number(query.get('id') || (opts.body as { id?: number })?.id);
      admins = admins.filter((a) => a.id !== id);
      setLocal(STORAGE_KEYS.admins, admins);
      return { ok: true } as T;
    }
  }

  if (cleanPath === '/api/settings') {
    let settings = getLocal<SiteSettings>(STORAGE_KEYS.settings, INITIAL_SETTINGS);
    if (method === 'GET') {
      return settings as T;
    }
    if (method === 'PUT' || method === 'POST') {
      const body = (opts.body || {}) as Partial<SiteSettings>;
      settings = { ...settings, ...body };
      setLocal(STORAGE_KEYS.settings, settings);
      window.dispatchEvent(new Event('site-settings-changed'));
      return settings as T;
    }
  }

  // Fallback to network request if not intercepted
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.auth) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(path, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string }).error || `Request failed (${res.status})`);
  return json as T;
}

export function useFetch<T>(path: string, initial: T, auth = false) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setError(null);
      const d = await api<T>(path, { auth });
      setData(Array.isArray(d) ? (d as unknown as T) : (d || initial));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [path, auth]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}

export const useProjects = (featured = false) =>
  useFetch<Project[]>(featured ? '/api/projects?featured=true' : '/api/projects', []);

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() =>
    getLocal<SiteSettings>(STORAGE_KEYS.settings, INITIAL_SETTINGS)
  );

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getLocal<SiteSettings>(STORAGE_KEYS.settings, INITIAL_SETTINGS));
    };
    window.addEventListener('site-settings-changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('site-settings-changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return settings;
}

export function tc(seconds: number, fps = 24) {
  const f = Math.floor((seconds % 1) * fps);
  const s = Math.floor(seconds) % 60;
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600);
  return [h, m, s, f].map((n) => String(n).padStart(2, '0')).join(':');
}

export function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function videoSrc(url: string) {
  return url.includes('#') ? url : `${url}#t=0.6`;
}

export async function uploadFile(file: File, folder: 'videos' | 'thumbs', onProgress: (n: number) => void): Promise<string> {
  onProgress(20);
  await new Promise((r) => setTimeout(r, 300));
  onProgress(70);
  await new Promise((r) => setTimeout(r, 300));
  onProgress(100);
  return URL.createObjectURL(file);
}

export const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
