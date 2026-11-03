'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { obtenerSesion, type SesionIniciada } from '@/lib/api';

const SIN_SUSCRIPCION = () => () => {};
function alCliente() { return obtenerSesion(); }
function alServidor() { return null; }

export default function PaginaAdminKYB() {
  const router = useRouter();
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);
  const [tickets, setTickets] = useState<any[]>([{ id: 'tk-001', nombreSede: 'Poblado Central', estado: 'Pendiente' }]);

  useEffect(() => {
    if (!sesion || sesion.usuario.rol !== 'ADMIN') router.replace('/dashboard');
  }, [sesion, router]);

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
              {tickets.map(t => (
                <tr key={t.id} className="border-b border-grafito/5">
                  <td className="py-4 font-bold">{t.nombreSede}</td>
                  <td className="py-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">{t.estado}</span></td>
                  <td className="py-4 text-right space-x-2">
                    <button className="bg-verde-esmeralda text-white px-4 py-1.5 rounded-lg font-bold text-xs">Aprobar</button>
                    <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold text-xs">Rechazar</button>
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
