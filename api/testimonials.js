import supabase from './db-client.js';
import { cors, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method === 'POST') {
      const { quote, author, role } = req.body || {};
      if (!quote || !author) return res.status(400).json({ error: 'Quote and author are required' });
      const { data, error } = await supabase.from('testimonials').insert({ quote, author, role: role || null }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || req.body?.id;
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
