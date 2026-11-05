'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isSupabaseDummy = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy');

  useEffect(() => {
    if (isSupabaseDummy) {
      // Demo mode: fake authenticated user
      setSession({ user: { id: 'demo-operador', email: 'operador1@test.com' } } as any);
      setUser({ id: 'demo-operador', email: 'operador1@test.com' } as any);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [isSupabaseDummy]);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
