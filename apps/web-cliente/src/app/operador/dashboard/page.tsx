'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { obtenerSesion, cerrarSesion, listarReservasActivas, checkInReserva, checkOutReserva } from '@/lib/api';
import { Html5Qrcode } from 'html5-qrcode';

const SIN_SUSCRIPCION = () => () => {};
function alCliente() { return obtenerSesion(); }
function alServidor() { return null; }

export default function OperadorDashboardPage() {
  const router = useRouter();
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);
  const [reservas, setReservas] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const escanerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!sesion) router.replace('/iniciar-sesion');
  }, [sesion, router]);

  const cargarDatos = useCallback(async () => {
    if (sesion) {
      const data = await listarReservasActivas('default-sede');
      setReservas(data);
    }
  }, [sesion]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const iniciarEscaner = async () => {
    const escaner = new Html5Qrcode('qr-reader');
    escanerRef.current = escaner;
    await escaner.start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, async (q) => {
      await checkInReserva(q);
      await cargarDatos();
      await escaner.stop();
    }, () => {});
  };

  return (
    <main className="min-h-screen bg-[oklch(98%_0.01_255)] p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <header className="flex justify-between items-center glass p-6 rounded-3xl">
            <h1 className="text-2xl font-black">Operador</h1>
            <button onClick={cargarDatos} className="bg-azul-acero text-white px-6 py-2 rounded-xl font-bold text-sm">Actualizar</button>
          </header>

          <div className="glass p-6 rounded-3xl">
            <h2 className="font-bold mb-4">Vehículos en Sede</h2>
            <table className="w-full text-sm">
              <thead className="text-grafito/40 border-b border-grafito/10"><tr className="text-left"><th className="pb-4">Placa</th><th className="pb-4">Tiempo</th><th className="pb-4">Acción</th></tr></thead>
              <tbody>
                {reservas.map(r => (
                  <tr key={r.id} className="border-b border-grafito/5">
                    <td className="py-4 font-mono font-bold">{r.codigoQr}</td>
                    <td className="py-4">{r.duracionMinutos} min</td>
                    <td className="py-4"><button onClick={() => checkOutReserva(r.id).then(cargarDatos)} className="text-red-600 font-bold">Check-out</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="glass p-6 rounded-3xl h-fit">
          <h2 className="font-bold mb-4">Escáner QR</h2>
          <div id="qr-reader" className="aspect-square bg-grafito/5 rounded-2xl mb-4 overflow-hidden" />
          <button onClick={iniciarEscaner} className="w-full bg-verde-esmeralda text-white py-4 rounded-2xl font-black">Activar Cámara</button>
        </aside>
      </div>
    </main>
  );
}
