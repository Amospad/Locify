'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import { obtenerSesion, type SesionIniciada, obtenerEstadoKYB, subirDocumentosKYB, type EstadoKYB } from '@/lib/api';

const SIN_SUSCRIPCION = () => () => {};

function alCliente(): SesionIniciada | null {
  return obtenerSesion();
}

function alServidor(): SesionIniciada | null {
  return null;
}

export default function PaginaKYB() {
  const router = useRouter();
  const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);
  const [estado, setEstado] = useState<EstadoKYB | null>(null);
  const [urlRut, setUrlRut] = useState('');
  const [urlCamara, setUrlCamara] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    if (!sesion) { router.replace('/iniciar-sesion'); return; }
    if (sesion.usuario.rol !== 'OPERADOR') { router.replace('/dashboard'); return; }
    const cargar = async () => {
      try {
        const est = await obtenerEstadoKYB(sesion.usuario.id);
        setEstado(est);
      } catch {}
    };
    cargar();
  }, [sesion, router]);

  if (!sesion || sesion.usuario.rol !== 'OPERADOR') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sesion) return;
    setEnviando(true);
    setMensaje(null);
    try {
      await subirDocumentosKYB(sesion.usuario.id, urlRut, urlCamara);
      setMensaje('Documentos enviados correctamente. Están en revisión.');
      const est = await obtenerEstadoKYB(sesion.usuario.id);
      setEstado(est);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'Error al enviar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col px-6 py-8 md:px-10 md:py-12">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-grafito">Verificación KYB</h1>
          <p className="mt-1 text-grafito/60">Estado actual de tu verificación</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }} className="rounded-2xl border border-grafito/10 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-grafito">Estado</h2>
            <p className="mt-2">{estado ? `${estado.estado} - ${estado.mensaje || ''}` : 'Cargando...'}</p>
          </div>

          <div className="space-y-4 border-t border-grafito/10 pt-6">
            <h2 className="text-lg font-semibold text-grafito">Subir documentos</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="url" placeholder="URL del RUT" value={urlRut} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlRut(e.target.value)} className="w-full rounded-lg border border-grafito/20 px-3 py-2" required />
              <input type="url" placeholder="URL Cámara de Comercio" value={urlCamara} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlCamara(e.target.value)} className="w-full rounded-lg border border-grafito/20 px-3 py-2" required />
              <button type="submit" disabled={enviando} className="w-full rounded-full bg-azul-acero px-6 py-3 font-semibold text-white">{enviando ? 'Enviando...' : 'Enviar Documentos'}</button>
            </form>
            {mensaje && <p className="text-sm text-red-600">{mensaje}</p>}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
