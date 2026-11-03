'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useSyncExternalStore } from 'react';
import { obtenerSesion, listarMisReservas, obtenerReservaActiva, type SesionIniciada, type ReservaUsuario, type ReservaActivaUsuario } from '@/lib/api';

const SIN_SUSCRIPCION = () => () => {};
let cachedSesion: SesionIniciada | null = null;
function alCliente(): SesionIniciada | null {
  const fresh = obtenerSesion();
  if (!fresh) { cachedSesion = null; return null; }
  if (cachedSesion && cachedSesion.usuario?.id === fresh.usuario?.id) return cachedSesion;
  cachedSesion = fresh;
  return cachedSesion;
}
function alServidor(): SesionIniciada | null { return null; }

function BadgeEstado({ estado }: { estado: ReservaUsuario['estado'] }) {
  const estilos: Record<string, string> = {
    ACTIVA: 'bg-azul-acero/10 text-azul-acero',
    FINALIZADA: 'bg-verde-esmeralda/10 text-verde-esmeralda',
    CANCELADA: 'bg-red-500/10 text-red-700',
    EXPIRADA: 'bg-amber-500/10 text-amber-800',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${estilos[estado] || ''}`}>{estado}</span>;
}

function MisVehiculosCard() {
  const vehiculos = [{ placa: 'ABC-123', modelo: 'Mazda CX-30' }, { placa: 'XYZ-789', modelo: 'Renault Kwid' }];
  return (
    <div className="glass p-6 rounded-3xl border border-white/20 shadow-xl">
      <h3 className="text-lg font-bold text-grafito mb-4">Mis Vehículos</h3>
      <div className="space-y-3">
        {vehiculos.map(v => (
          <div key={v.placa} className="bg-white/50 p-3 rounded-xl flex justify-between items-center border border-white/50">
            <span className="font-mono font-bold text-grafito">{v.placa}</span>
            <span className="text-xs text-grafito/60">{v.modelo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PaginaDashboard() {
  const router = useRouter();
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);
  const [reservas, setReservas] = useState<ReservaUsuario[]>([]);
  const [reservaActiva, setReservaActiva] = useState<ReservaActivaUsuario | null>(null);
  const [filtro, setFiltro] = useState<'TODAS' | 'FINALIZADA' | 'CANCELADA' | 'EXPIRADA'>('TODAS');
  const [pagina, setPagina] = useState(1);
  const pageSize = 5;

  useEffect(() => { if (!sesion) router.replace('/iniciar-sesion'); }, [sesion, router]);

  const cargarDatos = useCallback(async () => {
    if (!sesion) return;
    const [historial, activa] = await Promise.all([listarMisReservas(), obtenerReservaActiva()]);
    setReservas(historial);
    setReservaActiva(activa);
  }, [sesion]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const historialFiltrado = useMemo(() => {
    return reservas.filter(r => filtro === 'TODAS' || r.estado === filtro);
  }, [reservas, filtro]);

  const paginado = historialFiltrado.slice((pagina - 1) * pageSize, pagina * pageSize);

  return (
    <main className="min-h-screen p-8 bg-[oklch(98%_0.01_255)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
        <section className="space-y-8">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-grafito">Dashboard</h1>
            <button onClick={() => { window.localStorage.removeItem('locify.sesion'); router.replace('/iniciar-sesion'); }} className="text-sm font-bold text-grafito/50">Cerrar Sesión</button>
          </header>

          {reservaActiva && (
            <div className="glass p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-sm font-bold uppercase tracking-widest text-azul-acero mb-2">Reserva Activa</h2>
                <p className="text-2xl font-black text-grafito">{reservaActiva.nombreSede}</p>
                <p className="text-grafito/60">{reservaActiva.direccionSede}</p>
              </div>
              <div className="bg-white p-2 rounded-2xl"><QRCodeSVG value={reservaActiva.codigoQr} size={100} /></div>
            </div>
          )}

          <div className="glass p-8 rounded-3xl border border-white/20">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-bold">Historial</h3>
              <select onChange={(e) => setFiltro(e.target.value as any)} className="bg-transparent text-sm font-bold">
                <option value="TODAS">Todas</option>
                <option value="FINALIZADA">Completadas</option>
              </select>
            </div>
            <table className="w-full text-sm text-grafito">
              <thead><tr className="text-grafito/40 border-b border-grafito/10"><th className="pb-4 text-left">Sede</th><th className="pb-4 text-left">Estado</th></tr></thead>
              <tbody>
                {paginado.map(r => (
                  <tr key={r.id} className="border-b border-grafito/5 hover:bg-black/2">
                    <td className="py-4 font-bold">{r.nombreSede}</td>
                    <td className="py-4"><BadgeEstado estado={r.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-6">
          <MisVehiculosCard />
        </aside>
      </div>
    </main>
  );
}
