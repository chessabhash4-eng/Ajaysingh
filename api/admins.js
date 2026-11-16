import supabase from './db-client.js';
import { cors, getUser, isAdminEmail, requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET' && req.query.me) {
      const user = await getUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      return res.status(200).json({ email: user.email, isAdmin: await isAdminEmail(user.email) });
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method === 'GET') {
      const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const email = String(req.body?.email || '').trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'A valid email is required' });
      if (await isAdminEmail(email)) return res.status(400).json({ error: 'That email already has access' });
      const { data, error } = await supabase.from('admins').insert({ email }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || req.body?.id;
      const { data: row } = await supabase.from('admins').select('*').eq('id', id).maybeSingle();
      if (row && row.email === admin.email?.toLowerCase()) {
        return res.status(400).json({ error: "You can't remove your own access" });
      }
      const { error } = await supabase.from('admins').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
