import supabase from './db-client.js';
import { cors, requireAdmin } from './_auth.js';

const FIELDS = ['title', 'slug', 'category', 'client', 'year', 'role', 'description', 'video_url', 'thumbnail_url', 'duration', 'featured', 'sort_order'];

function pick(body) {
  const out = {};
  for (const k of FIELDS) if (body[k] !== undefined) out[k] = body[k] === '' ? null : body[k];
  if (out.year !== undefined && out.year !== null) out.year = parseInt(out.year, 10) || null;
  if (out.sort_order !== undefined && out.sort_order !== null) out.sort_order = parseInt(out.sort_order, 10) || 0;
  return out;
}

function slugify(s) {
  return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, featured } = req.query;
      if (slug) {
        const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Project not found' });
        return res.status(200).json(data);
      }
      let q = supabase.from('projects').select('*');
      if (featured === 'true') q = q.eq('featured', true);
      const { data, error } = await q.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method === 'POST') {
      const row = pick(req.body || {});
      if (!row.title || !row.video_url || !row.category) {
        return res.status(400).json({ error: 'Title, category and video are required' });
      }
      row.slug = slugify(row.slug || row.title);
      const { data: existing } = await supabase.from('projects').select('id').eq('slug', row.slug).maybeSingle();
      if (existing) row.slug = `${row.slug}-${Date.now().toString(36).slice(-4)}`;
      const { data, error } = await supabase.from('projects').insert(row).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required' });
      const row = pick(req.body);
      if (row.slug) row.slug = slugify(row.slug);
      const { data, error } = await supabase.from('projects').update(row).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || req.body?.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
