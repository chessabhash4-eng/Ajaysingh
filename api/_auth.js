import supabase from './db-client.js';

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export async function getUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function isAdminEmail(email) {
  if (!email) return false;
  const { data } = await supabase
    .from('admins')
    .select('email')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  return !!data;
}

// Returns the user if they are an admin, otherwise writes the error response and returns null
export async function requireAdmin(req, res) {
  const user = await getUser(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  const ok = await isAdminEmail(user.email);
  if (!ok) {
    res.status(403).json({ error: 'This account does not have admin access' });
    return null;
  }
  return user;
}
