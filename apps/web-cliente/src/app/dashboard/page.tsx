'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { cerrarSesion, obtenerSesion, type SesionIniciada } from '@/lib/api';

/*
 * La sesión vive en localStorage (sistema externo a React): se lee con
 * useSyncExternalStore, que resuelve servidor (null) e hidratación sin
 * efectos con setState (regla react-hooks/set-state-in-effect).
 */
const SIN_SUSCRIPCION = () => () => {};

function alCliente(): SesionIniciada | null {
  return obtenerSesion();
}

function alServidor(): SesionIniciada | null {
  return null;
}

/**
 * Placeholder del dashboard del cliente: confirma la sesión y expone el
 * cierre. Las pantallas reales llegan con RF-09 (reserva activa) y RF-10
 * (cronómetro del check-in).
 */
export default function PaginaDashboard() {
  const router = useRouter();
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);

  useEffect(() => {
    if (!sesion) {
      router.replace('/iniciar-sesion');
    }
  }, [sesion, router]);

  const activo = sesion !== null;

  function salir() {
    cerrarSesion();
    router.replace('/iniciar-sesion');
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-grafito/10 bg-white p-8 shadow-sm text-center">
        <p
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
            activo
              ? 'bg-verde-esmeralda/10 text-green-700'
              : 'bg-grafito/10 text-grafito/70'
          }`}
        >
          <span
            className={`inline-block size-2 rounded-full ${
              activo ? 'bg-verde-esmeralda' : 'bg-grafito/40'
            }`}
            aria-hidden
          />
          {activo ? 'Sesión activa' : 'Verificando sesión…'}
        </p>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-grafito">
          Dashboard
        </h1>

        {sesion ? (
          <dl className="mt-3 space-y-1 text-sm text-grafito/70">
            <div>
              <dt className="inline font-medium text-grafito">Email: </dt>
              <dd className="inline">{sesion.usuario.email}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-grafito">Rol: </dt>
              <dd className="inline">{sesion.usuario.rol}</dd>
            </div>
          </dl>
        ) : null}

        <p className="mt-4 text-sm text-grafito/60">
          Aquí verás tu reserva activa y el cronómetro del check-in (RF-09/RF-10).
        </p>

        <button
          type="button"
          onClick={salir}
          disabled={!activo}
          className="mt-6 rounded-full border border-grafito/20 bg-white px-6 py-2.5 font-semibold text-grafito transition-colors hover:border-acero hover:text-acero focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acero disabled:opacity-60"
        >
          Cerrar sesión
        </button>

        <p className="mt-4 text-sm">
          <Link href="/" className="text-sm text-acero hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
