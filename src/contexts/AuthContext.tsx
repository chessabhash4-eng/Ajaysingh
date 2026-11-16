import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import supabase from '../lib/supabase';

type MockUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  aud?: string;
  created_at?: string;
};

type Ctx = {
  user: User | MockUser | null;
  session: Session | { user: MockUser; access_token: string } | null;
  loading: boolean;
  loginAsDemo: () => void;
  logoutDemo: () => void;
};

const AuthContext = createContext<Ctx>({
  user: null,
  session: null,
  loading: true,
  loginAsDemo: () => {},
  logoutDemo: () => {},
});

const LOCAL_AUTH_KEY = 'fc_local_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [session, setSession] = useState<Session | { user: MockUser; access_token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if local mock user is stored
    const localUser = localStorage.getItem(LOCAL_AUTH_KEY);
    if (localUser) {
      try {
        const u = JSON.parse(localUser);
        setUser(u);
        setSession({ user: u, access_token: 'mock_token' });
        setLoading(false);
        return;
      } catch {}
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (localStorage.getItem(LOCAL_AUTH_KEY)) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loginAsDemo = () => {
    const mockUser: MockUser = {
      id: 'tungtungbaje-id',
      email: 'tungtungbaje',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setSession({ user: mockUser, access_token: 'mock_token' });
  };

  const logoutDemo = () => {
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
    setSession(null);
    try {
      supabase.auth.signOut();
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, loginAsDemo, logoutDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
