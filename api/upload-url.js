import supabase from './db-client.js';
import { cors, requireAdmin } from './_auth.js';

// Issues a signed upload URL so large video files go straight from the browser
// to Supabase Storage (bypassing the serverless body-size limit).
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { fileName, folder } = req.body || {};
    if (!fileName) return res.status(400).json({ error: 'fileName is required' });
    const dir = folder === 'thumbs' ? 'thumbs' : 'videos';
    const ext = (String(fileName).split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
    const base = String(fileName).replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const path = `${dir}/${Date.now()}-${base}.${ext}`;

    const { data, error } = await supabase.storage.from('showcase').createSignedUploadUrl(path);
    if (error) throw error;
    const { data: pub } = supabase.storage.from('showcase').getPublicUrl(path);

    return res.status(200).json({ path, token: data.token, signedUrl: data.signedUrl, publicUrl: pub.publicUrl });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
