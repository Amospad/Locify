'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useSyncExternalStore } from 'react';
import {
  obtenerSesion,
  type SesionIniciada,
  listarMisReservas,
  obtenerReservaActiva,
  type ReservaUsuario,
  type ReservaActivaUsuario,
} from '@/lib/api';

/* Sesión en localStorage vía useSyncExternalStore (SSR-safe). */
const SIN_SUSCRIPCION = () => () => {};

let cachedSesion: SesionIniciada | null = null;

function alCliente(): SesionIniciada | null {
  const fresh = obtenerSesion();
  if (!fresh) {
    if (cachedSesion !== null) {
      cachedSesion = null;
    }
    return cachedSesion;
  }
  // Mantener referencia estable comparando identificador único
  if (cachedSesion && cachedSesion.usuario?.id === fresh.usuario?.id) {
    return cachedSesion;
  }
  cachedSesion = fresh;
  return cachedSesion;
}

function alServidor(): SesionIniciada | null {
  return null;
}

/* Formatea fecha ISO a "DD/MM/YYYY HH:mm" en zona local. */
function formatearFecha(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/* Calcula tiempo transcurrido desde fechaEntrada ISO. */
function calcularTranscurrido(fechaEntradaISO: string): string {
  const inicio = new Date(fechaEntradaISO).getTime();
  const ahora = Date.now();
  const diffMs = ahora - inicio;
  if (diffMs < 0) return '00:00:00';
  const h = Math.floor(diffMs / 3_600_000);
  const m = Math.floor((diffMs % 3_600_000) / 60_000);
  const s = Math.floor((diffMs % 60_000) / 1000);
  return [h, m, s].map((n) => n.toString().padStart(2, '0')).join(':');
}

/* Badge de estado con colores LOCIFY. */
function BadgeEstado({ estado }: { estado: ReservaUsuario['estado'] }) {
  const estilos: Record<
    ReservaUsuario['estado'],
    string
  > = {
    ACTIVA: 'bg-azul-acero/10 text-grafito',
    FINALIZADA: 'bg-verde-esmeralda/10 text-grafito',
    CANCELADA: 'bg-red-500/10 text-red-700',
    EXPIRADA: 'bg-amber-500/10 text-amber-800',
  };
  const etiquetas: Record<ReservaUsuario['estado'], string> = {
    ACTIVA: 'Activa',
    FINALIZADA: 'Completada',
    CANCELADA: 'Cancelada',
    EXPIRADA: 'Expirada',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estilos[estado]}`}
    >
      {etiquetas[estado]}
    </span>
  );
}

/* Tarjeta de reserva activa (estado ACTIVA). */
function TarjetaReservaActiva({
  reserva,
}: {
  reserva: ReservaActivaUsuario;
}) {
  const [transcurrido, setTranscurrido] = useState(() =>
    calcularTranscurrido(reserva.fechaEntrada)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTranscurrido(calcularTranscurrido(reserva.fechaEntrada));
    }, 1000);
    return () => clearInterval(id);
  }, [reserva.fechaEntrada]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-azul-acero/5 via-white to-azul-acero/5 border border-azul-acero/20 p-6 shadow-lg"
    >
      {/* Acento decorativo superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-azul-acero to-azul-acero/50" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-grafito/60 mb-1">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-medium text-grafito">{reserva.nombreSede}</span>
          </div>
          <p className="text-grafito/70 text-sm">{reserva.direccionSede}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <BadgeEstado estado={reserva.estado} />
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {reserva.modalidad === 'EXPRES' ? '⚡ Exprés' : 'Garantizada'}
            </span>
          </div>
        </div>

        {/* QR + Cronómetro */}
        <div className="flex flex-col items-center gap-4 md:ml-8">
          <div className="bg-white p-3 rounded-xl border border-grafito/10 shadow-sm">
            <QRCodeSVG value={reserva.codigoQr} size={96} level="M" includeMargin={true} />
          </div>
          <p className="text-xs text-grafito/60 font-mono tracking-wider">
            Código: {reserva.codigoQr}
          </p>

          {/* Cronómetro en tiempo real */}
          <div className="flex items-center gap-2 rounded-xl bg-grafito px-4 py-2.5 text-white font-mono text-lg font-semibold tabular-nums">
            <svg className="size-5 text-azul-acero/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{transcurrido}</span>
            <span className="text-xs text-grafito/40 uppercase tracking-wider">transcurrido</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-grafito/50 text-center">
        Muestra este código QR al operador al ingresar y al salir del parqueadero.
      </p>
    </motion.div>
  );
}

/* Tarjeta de reserva en historial (FINALIZADA, CANCELADA, EXPIRADA). */
function TarjetaHistorial({
  reserva,
  index,
}: {
  reserva: ReservaUsuario;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className="rounded-xl border border-grafito/10 bg-white p-4 hover:border-azul-acero/30 hover:shadow-md transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-grafito/60 mb-1">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-medium text-grafito">{reserva.nombreSede}</span>
          </div>
          <p className="text-grafito/70 text-sm">{reserva.direccionSede}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <BadgeEstado estado={reserva.estado} />
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              reserva.modalidad === 'EXPRES'
                ? 'bg-amber-500/10 text-amber-700'
                : 'bg-grafito/10 text-grafito/70'
            }">
              {reserva.modalidad === 'EXPRES' ? '⚡ Exprés' : 'Garantizada'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right md:ml-6">
          <p className="text-sm text-grafito/70 font-mono">
            {formatearFecha(reserva.fechaEntrada)}
          </p>
          {reserva.fechaSalida && (
            <p className="text-xs text-grafito/50">
              Salida: {formatearFecha(reserva.fechaSalida)}
            </p>
          )}
          <p className="text-xs text-grafito/50 font-mono">{reserva.codigoQr}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* Estado vacío cuando no hay reservas. */
function EstadoVacio() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl rounded-2xl border-2 border-dashed border-grafito/20 bg-grafito/5 p-12 text-center"
    >
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-azul-acero/10 text-grafito">
        <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 15h6" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-grafito">No tienes reservas aún</h2>
      <p className="mt-2 text-grafito/60">
        Cuando reserves un cupo, aparecerá aquí tu reserva activa y el
        historial de tus estancias.
      </p>
      <button
        type="button"
        onClick={() => router.push('/buscar')}
        className="mt-6 rounded-full bg-azul-acero px-6 py-2.5 font-semibold text-white transition-colors hover:bg-azul-acero/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-acero"
      >
        Buscar parqueadero
      </button>
    </motion.div>
  );
}

/* Componente principal del Dashboard. */
export default function PaginaDashboard() {
  const router = useRouter();
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);
  const [reservas, setReservas] = useState<ReservaUsuario[]>([]);
  const [reservaActiva, setReservaActiva] = useState<ReservaActivaUsuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Redirige si no hay sesión. */
  useEffect(() => {
    if (!sesion) {
      router.replace('/iniciar-sesion');
    }
  }, [sesion, router]);

  /* Carga datos al montar y cuando cambia la sesión. */
  const cargarDatos = useCallback(async () => {
    if (!sesion) return;
    // Evitar estados de carga inconsistentes que disparen bucles
    try {
      const [historial, activa] = await Promise.all([
        listarMisReservas(),
        obtenerReservaActiva(),
      ]);
      setReservas(historial);
      setReservaActiva(activa);
      setError(null);
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : 'Error al cargar el dashboard';
      setError(mensaje);
      console.error('Error cargando dashboard:', e);
    } finally {
      setCargando(false);
    }
  }, [sesion]);

  useEffect(() => {
    // Asegurar que solo se ejecute una vez al cambiar sesion
    cargarDatos();
  }, [cargarDatos]);

  /* Separa historial (sin la activa si ya está en reservaActiva). */
  const historial = reservas.filter(
    (r) => r.estado !== 'ACTIVA' || (reservaActiva && r.id !== reservaActiva.id)
  );

  const tieneContenido = reservaActiva || historial.length > 0;

  if (cargando) {
    return (
      <main className="flex flex-1 flex-col px-6 py-8 md:px-10 md:py-12">
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-8 w-48 bg-grafito/10 rounded"></div>
          <div className="h-64 bg-grafito/10 rounded-2xl"></div>
          <div className="space-y-3">
            <div className="h-6 w-40 bg-grafito/10 rounded"></div>
            <div className="h-24 bg-grafito/10 rounded-xl"></div>
            <div className="h-24 bg-grafito/10 rounded-xl"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <svg className="mx-auto size-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h2 className="mt-3 text-lg font-semibold text-red-600">Error al cargar</h2>
          <p className="mt-1 text-sm text-red-500">{error}</p>
          <button
            type="button"
            onClick={cargarDatos}
            className="mt-4 rounded-full border border-red-500/30 bg-white px-4 py-2 font-medium text-red-600 hover:bg-red-500/5"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8 md:px-10 md:py-12">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-grafito">
                Mi Dashboard
              </h1>
              <p className="mt-1 text-grafito/60">
                {sesion?.usuario.email}
                {' '}
                <span className="inline-flex items-center gap-1 rounded-full bg-grafito/10 px-2 py-0.5 text-xs font-medium text-grafito/70">
                  {sesion?.usuario.rol}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem('locify.sesion');
                router.replace('/iniciar-sesion');
              }}
              className="rounded-full border border-grafito/20 bg-white px-4 py-2 font-medium text-grafito transition-colors hover:border-azul-acero hover:text-azul-acero focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-acero"
            >
              Cerrar sesión
            </button>
          </div>
        </motion.div>

        {/* Sección: Reserva Activa */}
        <AnimatePresence mode="wait">
          {reservaActiva ? (
            <motion.section
              key="activa"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-grafito flex items-center gap-2">
                  <span className="inline-flex size-2 rounded-full bg-azul-acero" aria-hidden="true" />
                  Reserva activa
                </h2>
              </div>
              <TarjetaReservaActiva reserva={reservaActiva} />
            </motion.section>
          ) : null}
        </AnimatePresence>

        {/* Sección: Historial */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: reservaActiva ? 0.1 : 0, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-grafito flex items-center gap-2">
              <svg className="size-5 text-grafito/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Historial de reservas
            </h2>
            {historial.length > 0 && (
              <span className="text-sm text-grafito/50">
                {historial.length} {' '}
                {historial.length === 1 ? 'reserva' : 'reservas'}
              </span>
            )}
          </div>

          {historial.length > 0 ? (
            <div className="space-y-3" role="list" aria-label="Historial de reservas">
              {historial.map((reserva, i) => (
                <TarjetaHistorial key={reserva.id} reserva={reserva} index={i} />
              ))}
            </div>
          ) : !reservaActiva ? (
            <EstadoVacio />
          ) : null}
        </motion.section>
      </div>
    </main>
  );
}