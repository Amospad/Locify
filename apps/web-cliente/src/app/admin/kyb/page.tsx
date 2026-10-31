'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import { obtenerSesion, type SesionIniciada } from '@/lib/api';

/* Sesión en localStorage vía useSyncExternalStore (SSR-safe). */
const SIN_SUSCRIPCION = () => () => {};

function alCliente(): SesionIniciada | null {
  return obtenerSesion();
}

function alServidor(): SesionIniciada | null {
  return null;
}

interface TicketKYB {
  id: string;
  sedeId: string;
  nombreSede: string;
  direccionSede: string;
  operadorId: string;
  urlRut: string;
  urlCamaraComercio: string;
  fechaCreacion: string;
}

export default function PaginaAdminKYB() {
  const router = useRouter();
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);
  const [tickets, setTickets] = useState<TicketKYB[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState<TicketKYB | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (!sesion) {
      router.replace('/iniciar-sesion');
      return;
    }
    if (sesion.usuario.rol !== 'ADMIN') {
      router.replace('/dashboard');
      return;
    }
    cargarTickets();
  }, [sesion, router]);

  const cargarTickets = async () => {
    setCargando(true);
    try {
      // Simulación de carga de tickets
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTickets([
        {
          id: 'tk-001',
          sedeId: 'sede-123',
          nombreSede: 'Parqueadero El Poblado',
          direccionSede: 'Carrera 43A #1-50, Medellín',
          operadorId: 'usr-999',
          urlRut: 'https://ejemplo.com/rut.pdf',
          urlCamaraComercio: 'https://ejemplo.com/cc.pdf',
          fechaCreacion: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error al cargar tickets', error);
    } finally {
      setCargando(false);
    }
  };

  const manejarEstado = async (estado: 'APROBADO' | 'RECHAZADO') => {
    if (!seleccionado) return;
    if (estado === 'RECHAZADO' && !motivoRechazo.trim()) {
      alert('Debe proporcionar un motivo de rechazo');
      return;
    }

    setProcesando(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setTickets(tickets.filter((t) => t.id !== seleccionado.id));
      setSeleccionado(null);
      setMotivoRechazo('');
      alert(`Ticket ${estado === 'APROBADO' ? 'aprobado' : 'rechazado'} con éxito`);
    } catch (error) {
      alert('Error al procesar la solicitud');
    } finally {
      setProcesando(false);
    }
  };

  if (!sesion || sesion.usuario.rol !== 'ADMIN') {
    return null;
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8 md:px-10 md:py-12">
      <div className="w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-grafito">
            Aprobación de Onboarding KYB
          </h1>
          <p className="mt-1 text-grafito/60">
            Revisa los documentos legales de los operadores para activar sus sedes
          </p>
        </motion.div>

        {cargando ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-azul-acero border-t-transparent" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-grafito/20 bg-grafito/5 py-16 text-center">
            <p className="text-grafito/60">No hay solicitudes pendientes de revisión</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-grafito/10 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-grafito/5 text-sm font-semibold text-grafito uppercase tracking-wider">
                  <th className="px-6 py-4">Sede</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grafito/10">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-grafito/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-grafito">{ticket.nombreSede}</div>
                      <div className="text-xs text-grafito/60">{ticket.direccionSede}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-grafito/80">
                      {new Date(ticket.fechaCreacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSeleccionado(ticket)}
                        className="rounded-lg bg-azul-acero/10 px-4 py-2 text-sm font-medium text-azul-acero hover:bg-azul-acero/20 transition-colors"
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Revisión */}
      <AnimatePresence>
        {seleccionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSeleccionado(null)}
              className="absolute inset-0 bg-grafito/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-grafito mb-4">Revisar Documentos</h2>
              
              <div className="space-y-4 mb-6">
                <div className="rounded-lg bg-grafito/5 p-4">
                  <p className="text-sm font-medium text-grafito/60">Sede</p>
                  <p className="text-grafito font-semibold">{seleccionado.nombreSede}</p>
                  <p className="text-sm text-grafito/80">{seleccionado.direccionSede}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <a
                    href={seleccionado.urlRut}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-grafito/10 p-3 hover:bg-grafito/5 transition-colors"
                  >
                    <span className="text-sm font-medium text-grafito">Ver RUT</span>
                    <svg className="h-5 w-5 text-grafito/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href={seleccionado.urlCamaraComercio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-grafito/10 p-3 hover:bg-grafito/5 transition-colors"
                  >
                    <span className="text-sm font-medium text-grafito">Ver Cámara de Comercio</span>
                    <svg className="h-5 w-5 text-grafito/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-medium text-grafito/80 mb-1">
                    Motivo de rechazo (obligatorio si rechaza)
                  </label>
                  <textarea
                    value={motivoRechazo}
                    onChange={(e) => setMotivoRechazo(e.target.value)}
                    className="w-full rounded-lg border border-grafito/20 p-3 text-sm focus:border-azul-acero focus:outline-none focus:ring-1 focus:ring-azul-acero"
                    rows={3}
                    placeholder="Ej: Documento RUT desactualizado o ilegible..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => manejarEstado('RECHAZADO')}
                  disabled={procesando}
                  className="flex-1 rounded-xl border border-red-500 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => manejarEstado('APROBADO')}
                  disabled={procesando}
                  className="flex-1 rounded-xl bg-verde-esmeralda px-4 py-3 text-sm font-semibold text-white hover:bg-verde-esmeralda/90 transition-colors disabled:opacity-50"
                >
                  {procesando ? 'Procesando...' : 'Aprobar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
