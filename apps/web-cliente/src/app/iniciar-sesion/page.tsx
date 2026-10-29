'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ErrorDeLogin, guardarSesion, login } from '@/lib/api';

/**
 * Pantalla de inicio de sesión (RF-07 del admin-api: `POST /api/auth/login`).
 *
 * El error de credenciales es el mismo para email inexistente y contraseña
 * incorrecta por diseño del backend (no revela cuentas); la UI no intenta
 * distinguirlos.
 */
export default function PaginaIniciarSesion() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    setMensajeError(null);
    setEnviando(true);

    try {
      const sesion = await login(email.trim(), contrasena);
      guardarSesion(sesion);
      router.replace('/dashboard');
    } catch (error) {
      setMensajeError(
        error instanceof ErrorDeLogin
          ? error.message
          : 'Error inesperado. Inténtalo de nuevo.',
      );
      setEnviando(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-grafito/10 bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-medium text-grafito/60 transition-colors hover:text-acero"
        >
          ← Volver al inicio
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight text-grafito">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-sm text-grafito/60">
          Entra con la cuenta de tu rol: operador, conductor o administración.
        </p>

        <form onSubmit={alEnviar} className="mt-6 flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-grafito">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.co"
              className="rounded-xl border border-grafito/20 bg-white px-3.5 py-2.5 text-grafito placeholder:text-grafito/40 focus:border-acero focus:outline-2 focus:outline-offset-2 focus:outline-acero"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-grafito">
            Contraseña
            <input
              type="password"
              required
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border border-grafito/20 bg-white px-3.5 py-2.5 text-grafito placeholder:text-grafito/40 focus:border-acero focus:outline-2 focus:outline-offset-2 focus:outline-acero"
            />
          </label>

          {mensajeError ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
            >
              {mensajeError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={enviando}
            className="mt-1 rounded-full bg-acero px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-azul-profundo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acero disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  );
}
