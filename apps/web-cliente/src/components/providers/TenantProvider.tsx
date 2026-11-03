'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type TenantContextType = {
  tenantId: string | null;
  setTenantId: (id: string | null) => void;
  loading: boolean;
};

export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicialización básica del tenant. Se puede extender a subdominio, metadata de usuario o localStorage.
    const stored = typeof window !== 'undefined' ? localStorage.getItem('tenantId') : null;
    setTenantIdState(stored);
    setLoading(false);
  }, []);

  const setTenantId = (id: string | null) => {
    if (typeof window !== 'undefined' && id) {
      localStorage.setItem('tenantId', id);
    }
    setTenantIdState(id);
  };

  return (
    <TenantContext.Provider value={{ tenantId, setTenantId, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return ctx;
}
