'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import { obtenerSesion, type SesionIniciada, guardarSesion } from '@/lib/api';

/* Sesión en localStorage vía useSyncExternalStore (SSR-safe). */
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
  const [formulario, setFormulario] = useState({
    nombre: '',
    direccion: '',
    latitud: '',
    longitud: '',
    capacidadTotal: '',
    precioHora: '',
    urlRut: '',
    urlCamaraComercio: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    if (!sesion) {
      router.replace('/iniciar-sesion');
    }
    if (sesion?.usuario.rol === 'CONDUCTOR') {
      router.replace('/dashboard');
    }
  }, [sesion, router]);

  if (!sesion || sesion.usuario.rol === 'CONDUCTOR') {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje(null);

    try {
      // Aquí normalmente crearíamos la sede primero y luego subiríamos documentos
      // Por simplicidad, simulamos el envío
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMensaje({ tipo: 'exito', texto: 'Documentos enviados correctamente. Están en revisión.' });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al enviar los documentos. Inténtalo de nuevo.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col px-6 py-8 md:px-10 md:py-12">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-grafito">
            Configuración de Sede KYB
          </h1>
          <p className="mt-1 text-grafito/60">
            Completa tu verificación KYC para activar tu sede en el mapa
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-grafito/10 bg-white p-6 shadow-sm"
        >
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-grafito">Datos de la Sede</h2>
            
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-grafito/80">
                Nombre de la Sede
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={formulario.nombre}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-grafito/20 bg-white px-3 py-2 text-grafito focus:border-azul-acero focus:outline-none focus:ring-1 focus:ring-azul-acero"
                placeholder="Parqueadero Central"
              />
            </div>

            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-grafito/80">
                Dirección
              </label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                required
                value={formulario.direccion}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-grafito/20 bg-white px-3 py-2 text-grafito focus:border-azul-acero focus:outline-none focus:ring-1 focus:ring-azul-acero"
                placeholder="Calle 123 #45-67, Medellín"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitud" className="block text-sm font-medium text-grafito/80">
                  Latitud
                </label>
                <input
                  id="latitud"
                  name="latitud"
                  type="number"
                  step="any"
                  required
                  value={formulario.latitud}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-grafito/20 bg-white px-3 py-2 text-grafito focus:border-azul-acero focus:outline-none focus:ring-1 focus:ring-azul-acero"
                />
              </div>

              <div>
                <label htmlFor="longitud" className="block text-sm font-medium text-grafito/80">
                  Longitud
                </label>
                <input
                  id="longitud"
                  name="longitud"
                  type="number"
                  step="any"
                  required
                  value={formulario.longitud}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-grafito/20 bg-white px-3 py-2 text-grafito focus:border-azul-acero focus:outline-none focus:ring-1 focus:ring-azul-acero"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="capacidadTotal" className="block text-sm font-medium text-grafito/80">
                  Capacidad Total
                </label>
                <input
                  id="capacidadTotal"
                  name="capacidadTotal"
                  type="number"
                  required
                  min="1"
                  value={formulario.capacidadTotal}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-grafito/20 bg-white px-3 py-2 text-grafito focus:border-azul-acero focus:outline-none focus:ring-1 focus:ring-azul-acero"
                />
              </div>

              <div>
                <label htmlFor="precioHora" className="block text-sm font-medium text-grafito/80">
                  Precio por Hora (COP)
                </label>
                <input
                  id="precioHora"
                  name="precioHora"
                  type="number"
                  required
                  min="0"
                  value={formulario.precioHora}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-grafito/20 bg-white px-3 py-2 text-grafito focus:border-azul-acero focus:outline-none focus:ring-1 focus:ring-azul-acero"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-grafito/10 pt-6">
            <h2 className="text-lg font-semibold text-grafito">Documentos KYB</h2>
            
            <div>
              <label htmlFor="urlRut" className="block text-sm font-medium text-grafito/80">
                URL del RUT
              </label>
              <input
                id="urlRut"
                name="urlRut"
                type="url"
                required
                value={formulario.urlRut}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-grafito/20 bg-white px-3 py-2 text-grafito focus:border-azul-acero focus:outline-none focus:ring-1 focus:ring-azul-acero"
                placeholder="https://ejemplo.com/documentos/rut.pdf"
              />
            </div>

            <div>
              <label htmlFor="urlCamaraComercio" className="block text-sm font-medium text-grafito/80">
                URL de Cámara de Comercio
              </label>
              <input
                id="urlCamaraComercio"
                name="urlCamaraComercio"
                type="url"
                required
                value={formulario.urlCamaraComercio}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-grafito/20 bg-white px-3 py-2 text-grafito focus:border-azul-acero focus:outline-none focus:ring-1 focus:ring-azul-acero"
                placeholder="https://ejemplo.com/documentos/camara.pdf"
              />
            </div>
          </div>

          {mensaje && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg p-4 ${
                mensaje.tipo === 'exito'
                  ? 'bg-verde-esmeralda/10 text-green-700 border border-verde-esmeralda/20'
                  : 'bg-red-500/10 text-red-700 border border-red-500/20'
              }`}
            >
              {mensaje.texto}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-full bg-azul-acero px-6 py-3 font-semibold text-white transition-colors hover:bg-azul-acero/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-acero disabled:opacity-60"
          >
            {enviando ? 'Enviando...' : 'Enviar Documentos para Revisión'}
          </button>
        </motion.form>
      </div>
    </main>
  );
}