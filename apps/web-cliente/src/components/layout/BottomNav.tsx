'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { obtenerSesion, type SesionIniciada } from '@/lib/api';

const SIN_SUSCRIPCION = () => () => {};
function alCliente() { return obtenerSesion(); }
function alServidor() { return null; }

export default function BottomNav() {
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);
  const rol = sesion?.usuario.rol ?? null;
  const pathname = usePathname();

  if (rol !== 'CONDUCTOR') return null;

  const items = [
    { href: '/buscar', label: 'Buscar', icon: '🔍' },
    { href: '/dashboard', label: 'Inicio', icon: '🏠' },
    { href: '/reservas', label: 'Reservas', icon: '📄' },
    { href: '/perfil', label: 'Perfil', icon: '👤' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-grafito/10 bg-white/90 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={`flex flex-col items-center justify-center py-3 text-xs ${isActive(i.href) ? 'text-acero' : 'text-grafito/60'}`}
          >
            <span className="text-lg">{i.icon}</span>
            <span>{i.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
