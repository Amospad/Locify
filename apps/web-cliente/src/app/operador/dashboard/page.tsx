'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { obtenerSesion, cerrarSesion, type SesionIniciada } from '@/lib/api';
import {
  listarReservasActivas,
  checkInReserva,
  checkOutReserva,
  type ReservaActiva,
  type CheckInResultado,
  type CheckOutResultado,
} from '@/lib/api';

const SIN_SUSCRIPCION = () => () => {};

function alCliente(): SesionIniciada | null {
  return obtenerSesion();
}

function alServidor(): SesionIniciada | null {
  return null;
}

function formatearHora(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

function formatearDuracion(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function getRolBadgeClass(rol: string): string {
  switch (rol) {
    case 'OPERADOR':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-grafito/10 text-grafito/70 border-grafito/20';
  }
}

function getModalidadBadgeClass(modalidad: 'GARANTIZADA' | 'EXPRES'): string {
  return modalidad === 'EXPRES'
    ? 'bg-amber-100 text-amber-800 border-amber-200'
    : 'bg-emerald-100 text-emerald-800 border-emerald-200';
}

function getModalidadIcon(modalidad: 'GARANTIZADA' | 'EXPRES') {
  return modalidad === 'EXPRES' ? (
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function OperadorDashboardPage() {
  const router = useRouter();
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);

  // Redirigir si no hay sesión o rol no es OPERADOR/ADMIN
  useEffect(() => {
    if (!sesion) {
      router.replace('/iniciar-sesion');
    } else if (sesion.usuario.rol === 'CONDUCTOR') {
      router.replace('/dashboard');
    }
  }, [sesion, router]);

  const esOperador = sesion?.usuario.rol === 'OPERADOR' || sesion?.usuario.rol === 'ADMIN';

  // Estado
  const [sedes, setSedes] = useState<Array<{ id: string; nombre: string }>>([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<string>('');
  const [reservasActivas, setReservasActivas] = useState<ReservaActiva[]>([]);
  const [cargandoReservas, setCargandoReservas] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);

  // Escáner QR
  const [escaneando, setEscaneando] = useState(false);
  const [errorEscaner, setErrorEscaner] = useState<string | null>(null);
  const [ultimoCheckIn, setUltimoCheckIn] = useState<CheckInResultado | null>(null);
  const escanerRef = useRef<Html5Qrcode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Alertas
  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null);

  // Cargar sedes al montar
  useEffect(() => {
    if (!esOperador) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/api/sedes`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSedes(data.map((s) => ({ id: s.id, nombre: s.nombre })));
          setSedeSeleccionada(data[0].id);
        }
      })
      .catch(() => {});
  }, [esOperador]);

  // Cargar reservas activas
  const cargarReservasActivas = useCallback(async () => {
    if (!sedeSeleccionada || !esOperador) return;

    setCargandoReservas(true);
    try {
      const data = await listarReservasActivas(sedeSeleccionada);
      setReservasActivas(data);
      setUltimaActualizacion(new Date());
    } catch (error) {
      console.error('Error cargando reservas activas:', error);
    } finally {
      setCargandoReservas(false);
    }
  }, [sedeSeleccionada, esOperador]);

  // Actualizar automáticamente cada 30 segundos
  useEffect(() => {
    if (!esOperador || !sedeSeleccionada) return;
    cargarReservasActivas();
    const intervalo = setInterval(cargarReservasActivas, 30000);
    return () => clearInterval(intervalo);
  }, [cargarReservasActivas, esOperador, sedeSeleccionada]);

  // Iniciar escáner QR
  const iniciarEscaner = async () => {
    if (escaneando || !videoRef.current) return;

    try {
      setErrorEscaner(null);
      const escaner = new Html5Qrcode('qr-reader');
      escanerRef.current = escaner;

      await escaner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (codigoQr) => {
          if (!codigoQr) return;
          
          // Detener escáner después de detectar
          await detenerEscaner();
          
          try {
            const resultado = await checkInReserva(codigoQr);
            setUltimoCheckIn(resultado);
            setAlerta({ tipo: 'exito', mensaje: `Check-in OK: ${resultado.codigoQr}` });
            await cargarReservasActivas();
          } catch (error) {
            setAlerta({ tipo: 'error', mensaje: error instanceof Error ? error.message : 'Error en check-in' });
          }
        },
        (error) => {
          // Ignorar errores de escaneo (no se detectó QR en este frame)
        },
      );

      setEscaneando(true);
    } catch (error) {
      setErrorEscaner('No se pudo acceder a la cámara. Verifica los permisos.');
      console.error('Error iniciando escáner:', error);
    }
  };

  // Detener escáner
  const detenerEscaner = async () => {
    if (escanerRef.current && escaneando) {
      try {
        await escanerRef.current.stop();
      } catch {}
      escanerRef.current = null;
      setEscaneando(false);
    }
  };

  // Limpiar alerta
  const limpiarAlerta = () => setAlerta(null);

  // Manejar check-out
  const manejarCheckOut = async (reservaId: string) => {
    try {
      const resultado = await checkOutReserva(reservaId);
      setAlerta({ tipo: 'exito', mensaje: `Check-out OK: ${resultado.codigoQr} (${resultado.duracionMinutos} min)` });
      await cargarReservasActivas();
    } catch (error) {
      setAlerta({ tipo: 'error', mensaje: error instanceof Error ? error.message : 'Error en check-out' });
    }
  };

  const salir = () => {
    detenerEscaner();
    cerrarSesion();
    router.replace('/iniciar-sesion');
  };

  if (!esOperador) return null;

  return (
    <main className="flex flex-1 flex-col min-h-screen bg-fondo">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-grafito/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <svg className="size-8 text-acero" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path
                d="M8 12h16M8 16h12M8 20h8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <h1 className="text-xl font-bold text-grafito">Dashboard Operador</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${getRolBadgeClass(sesion!.usuario.rol)}`}>
              {sesion!.usuario.rol}
            </span>
            <span className="text-sm text-grafito/70">{sesion!.usuario.email}</span>
            <button
              type="button"
              onClick={salir}
              className="rounded-full border border-grafito/20 bg-white px-4 py-2 text-sm font-medium text-grafito transition-colors hover:border-acero hover:text-acero"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Selector de sede */}
        <div className="border-t border-grafito/10 px-4 py-3">
          <div className="mx-auto max-w-7xl flex items-center gap-4">
            <label htmlFor="sede-select" className="text-sm font-medium text-grafito">
              Sede:
            </label>
            <select
              id="sede-select"
              value={sedeSeleccionada}
              onChange={(e) => setSedeSeleccionada(e.target.value)}
              className="flex-1 max-w-xs rounded-xl border border-grafito/20 bg-white px-3 py-2 text-sm text-grafito focus:outline-2 focus:outline-acero"
            >
              {sedes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={cargarReservasActivas}
              disabled={cargandoReservas}
              className="rounded-xl border border-grafito/20 bg-white px-4 py-2 text-sm font-medium text-grafito transition-colors hover:border-acero hover:text-acero disabled:opacity-60"
            >
              {cargandoReservas ? 'Actualizando…' : 'Actualizar'}
            </button>
            {ultimaActualizacion && (
              <span className="text-xs text-grafito/50">
                Actualizado: {ultimaActualizacion.toLocaleTimeString('es-CO')}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
        {/* Alerta */}
        {alerta && (
          <div
            className={`mb-6 rounded-xl p-4 flex items-center justify-between animate-slide-down ${
              alerta.tipo === 'exito'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
            role="alert"
          >
            <div className="flex items-center gap-3">
              {alerta.tipo === 'exito' ? (
                <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="font-medium">{alerta.mensaje}</span>
            </div>
            <button
              type="button"
              onClick={limpiarAlerta}
              className="rounded-lg p-1 hover:bg-black/5 transition-colors"
              aria-label="Cerrar alerta"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Panel izquierdo: Escáner QR */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-grafito/10 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-grafito">
                <svg className="size-5 text-acero" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Escáner QR - Check-in
              </h2>
              <p className="mt-1 text-sm text-grafito/60">
                Apunta la cámara al código QR del conductor para registrar su ingreso
              </p>

              <div id="qr-reader" className="mt-4 relative aspect-video rounded-xl overflow-hidden bg-grafito/5">
                {escaneando && videoRef.current ? (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                    aria-label="Vista de cámara para escanear QR"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <svg className="size-16 text-grafito/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="mt-3 text-grafito/70">Cámara apagada</p>
                    <p className="text-sm text-grafito/50">Pulsa "Iniciar escáner" para activar</p>
                  </div>
                )}
                
                {/* Marco de escaneo decorativo */}
                {escaneando && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative size-64">
                      <div className="absolute inset-0 border-2 border-acero/50 rounded-lg" />
                      <div className="absolute -top-2 -left-2 size-6 border-t-4 border-l-4 border-acero rounded-tl-lg" />
                      <div className="absolute -top-2 -right-2 size-6 border-t-4 border-r-4 border-acero rounded-tr-lg" />
                      <div className="absolute -bottom-2 -left-2 size-6 border-b-4 border-l-4 border-acero rounded-bl-lg" />
                      <div className="absolute -bottom-2 -right-2 size-6 border-b-4 border-r-4 border-acero rounded-br-lg" />
                    </div>
                  </div>
                )}
              </div>

              {errorEscaner && (
                <p className="mt-3 text-sm text-red-700 bg-red-50 rounded-lg p-3" role="alert">
                  {errorEscaner}
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={escaneando ? detenerEscaner : iniciarEscaner}
                  disabled={escaneando && escanerRef.current === null}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-acero px-6 py-3 font-semibold text-white transition-colors hover:bg-azul-profundo disabled:opacity-60"
                >
                  {escaneando ? (
                    <>
                      <svg className="animate-spin size-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Detener escáner
                    </>
                  ) : (
                    <>
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Iniciar escáner
                    </>
                  )}
                </button>
              </div>

              {/* Último check-in exitoso */}
              {ultimoCheckIn && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 animate-slide-down">
                  <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Último check-in registrado
                  </p>
                  <dl className="mt-2 grid grid-cols-2 gap-1 text-sm">
                    <dt className="text-emerald-700/80">Código QR:</dt>
                    <dd className="font-mono font-semibold text-emerald-800">{ultimoCheckIn.codigoQr}</dd>
                    <dt className="text-emerald-700/80">Modalidad:</dt>
                    <dd className="font-medium text-emerald-800">{ultimoCheckIn.modalidad}</dd>
                    <dt className="text-emerald-700/80">Hora:</dt>
                    <dd className="font-medium text-emerald-800">{formatearHora(ultimoCheckIn.fechaEntrada)}</dd>
                  </dl>
                </div>
              )}
            </div>
          </section>

          {/* Panel derecho: Vehículos activos */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-grafito">
                <svg className="size-5 text-acero" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Vehículos en sede ({reservasActivas.length})
              </h2>
            </div>

            {cargandoReservas ? (
              <div className="rounded-2xl border border-grafito/10 bg-white p-8 text-center">
                <svg className="animate-spin mx-auto size-8 text-acero" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="mt-3 text-grafito/60">Cargando vehículos…</p>
              </div>
            ) : reservasActivas.length === 0 ? (
              <div className="rounded-2xl border border-grafito/10 bg-white p-8 text-center">
                <svg className="mx-auto size-12 text-grafito/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="mt-3 text-grafito/60">No hay vehículos en esta sede</p>
                <p className="text-sm text-grafito/50">Los vehículos aparecerán aquí al hacer check-in</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-grafito/10 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full" role="table">
                    <thead className="bg-fondo">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-grafito/70 uppercase tracking-wider">Placa / QR</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-grafito/70 uppercase tracking-wider">Ingreso</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-grafito/70 uppercase tracking-wider">Tiempo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-grafito/70 uppercase tracking-wider">Modalidad</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-grafito/70 uppercase tracking-wider pr-4">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-grafito/10">
                      {reservasActivas.map((reserva) => (
                        <tr key={reserva.id} className="hover:bg-fondo/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-mono text-base font-semibold text-grafito">{reserva.codigoQr}</span>
                              <span className="text-xs text-grafito/50">ID: {reserva.id.slice(0, 8)}…</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-grafito">
                            {formatearHora(reserva.fechaEntrada)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-mono font-medium text-amber-700">
                              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {formatearDuracion(reserva.duracionMinutos)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${getModalidadBadgeClass(reserva.modalidad)}`}>
                              {getModalidadIcon(reserva.modalidad)}
                              {reserva.modalidad}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right pr-4">
                            <button
                              type="button"
                              onClick={() => manejarCheckOut(reserva.id)}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 hover:border-red-300"
                            >
                              Check-out
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}