import supabase from './db-client.js';
import { cors, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { name, email, company, budget, project_type, message } = req.body || {};
      if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name is required' });
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'A valid email is required' });
      if (!message || String(message).trim().length < 10) return res.status(400).json({ error: 'Message should be at least 10 characters' });
      const { data, error } = await supabase
        .from('messages')
        .insert({
          name: String(name).trim().slice(0, 120),
          email: String(email).trim().slice(0, 200),
          company: company ? String(company).slice(0, 120) : null,
          budget: budget || null,
          project_type: project_type || null,
          message: String(message).trim().slice(0, 5000),
          is_read: false,
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ ok: true, id: data.id });
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method === 'GET') {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { id, is_read } = req.body || {};
      const { data, error } = await supabase.from('messages').update({ is_read: !!is_read }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || req.body?.id;
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
