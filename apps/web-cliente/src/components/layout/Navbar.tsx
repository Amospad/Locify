'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { obtenerSesion, type SesionIniciada } from '@/lib/api';

const SIN_SUSCRIPCION = () => () => {};
function alCliente() { return obtenerSesion(); }
function alServidor() { return null; }

type Rol = SesionIniciada['usuario']['rol'] | null;

export default function Navbar() {
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);
  const rol = sesion?.usuario.rol ?? null;
  const pathname = usePathname();

  const navItems = {
    CONDUCTOR: [
      { href: '/buscar', label: 'Buscar' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/reservas', label: 'Reservas' },
      { href: '/perfil', label: 'Perfil' },
    ],
    OPERADOR: [
      { href: '/operador/dashboard', label: 'Dashboard' },
      { href: '/operador/kyb', label: 'KYB' },
    ],
    ADMIN: [
      { href: '/admin/dashboard', label: 'Dashboard' },
      { href: '/admin/operadores', label: 'Operadores' },
      { href: '/admin/kyb', label: 'KYB' },
      { href: '/admin/configuracion', label: 'Configuración' },
    ],
  };

  const items = rol ? navItems[rol] : [];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 border-b border-grafito/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="rounded-lg bg-acero px-2 py-1 text-white">L</span>
          Locify
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`text-sm font-medium transition-colors ${isActive(i.href) ? 'text-acero' : 'text-grafito/60 hover:text-grafito'}`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:block text-sm text-grafito/60">
            {sesion?.usuario.email ?? 'Invitado'}
          </span>
          <span className="rounded-full bg-grafito/10 px-2 py-1 text-xs uppercase">
            {rol ?? '—'}
          </span>
        </div>
      </div>
    </header>
  );
}
