'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { obtenerSesion, type SesionIniciada, listarTicketsKYBPendientes, cambiarEstadoTicketKYB, type TicketKYB } from '@/lib/api';

const SIN_SUSCRIPCION = () => () => {};
function alCliente() { return obtenerSesion(); }
function alServidor() { return null; }

export default function PaginaAdminKYB() {
  const router = useRouter();
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);
  const [tickets, setTickets] = useState<TicketKYB[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!sesion || sesion.usuario.rol !== 'ADMIN') { router.replace('/dashboard'); return; }
    const cargar = async () => {
      try {
        const data = await listarTicketsKYBPendientes();
        setTickets(data);
      } catch {}
      setCargando(false);
    };
    cargar();
  }, [sesion, router]);

  const handleCambiarEstado = async (id: string, estado: 'APROBADO' | 'RECHAZADO') => {
    try {
      await cambiarEstadoTicketKYB(id, estado);
      setTickets(tickets.filter(t => t.id !== id));
    } catch {}
  };

  if (!sesion || sesion.usuario.rol !== 'ADMIN') return null;

  return (
    <main className="min-h-screen bg-[oklch(98%_0.01_255)] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="glass p-8 rounded-3xl">
          <h1 className="text-3xl font-black">KYB Admin</h1>
          <p className="text-grafito/60">Gestión de documentos</p>
        </header>

        <div className="glass p-8 rounded-3xl">
          <table className="w-full text-sm">
            <thead><tr className="text-grafito/40 border-b"><th className="pb-4 text-left">Sede</th><th className="pb-4 text-left">Estado</th><th className="pb-4 text-right">Acción</th></tr></thead>
            <tbody>
              {cargando ? <tr><td colSpan={3}>Cargando...</td></tr> : tickets.map(t => (
                <tr key={t.id} className="border-b border-grafito/5">
                  <td className="py-4 font-bold">{t.nombreSede}</td>
                  <td className="py-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">{t.estado}</span></td>
                  <td className="py-4 text-right space-x-2">
                    <button className="bg-verde-esmeralda text-white px-4 py-1.5 rounded-lg font-bold text-xs" onClick={() => handleCambiarEstado(t.id, 'APROBADO')}>Aprobar</button>
                    <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold text-xs" onClick={() => handleCambiarEstado(t.id, 'RECHAZADO')}>Rechazar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
