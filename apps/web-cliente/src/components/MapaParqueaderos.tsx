'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Map as MapaGL, Marker, NavigationControl, ScaleControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { obtenerSedes, crearReserva, ErrorDeReserva, type Sede, type ReservaCreada } from '@/lib/api';
import ReservaExitosaModal, { type ReservaModalProps } from './ReservaExitosaModal';

/*
 * Mapa de sedes (RF-11). MapLibre GL JS (BSD-3-Clause) sobre OpenFreeMap
 * (tiles vectoriales sin API key). El «check» verde del marcador es el color
 * de ESTADO de la identidad LOCIFY: celda DISPONIBLE confirmada.
 *
 * Nota HIG/recorrido: el mapa es la única superficie enfocable nueva; los
 * overlays (búsqueda y geolocalización) quedan dentro de este componente
 * porque comparten la instancia del mapa (flyTo).
 */

const CENTRO_MEDELLIN: [number, number] = [-75.5636, 6.2442];
const ESTILO_OPENFREEMAP = 'https://tiles.openfreemap.org/styles/positron';

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** Pill flotante estilo Apple Maps / EV charging */
function crearPin(sede: Sede): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'marker-pill';
  el.style.cssText = `
    transform: translate(-50%, -100%);
    cursor: pointer;
    pointer-events: auto;
  `;
  el.innerHTML = `
    <div style="
      background: rgba(20,20,20,0.85);
      color: white;
      padding: 6px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.15);
    ">
      ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(sede.precioHora)}/h
    </div>
  `;
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', `${sede.nombre}: ${sede.precioHora} por hora`);
  return el;
}

export default function MapaParqueaderos() {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<MapaGL | null>(null);
  const [cargando, setCargando] = useState(true);
  const [consulta, setConsulta] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [ubicandose, setUbicandose] = useState(false);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [errorSedes, setErrorSedes] = useState<string | null>(null);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<Sede | null>(null);
  // Estado para el modal de reserva (confirmación de modalidad)
  const [reservaModal, setReservaModal] = useState<{
    abierto: boolean;
    sede: Sede | null;
    cargando: boolean;
    error: string | null;
  }>({ abierto: false, sede: null, cargando: false, error: null });

  // Estado para el modal premium de reserva exitosa
  const [reservaExitosa, setReservaExitosa] = useState<ReservaModalProps | null>(null);

  // Cargar sedes del backend
  useEffect(() => {
    async function cargarSedes() {
      try {
        setCargando(true);
        const datos = await obtenerSedes();
        setSedes(datos);
        setErrorSedes(null);
      } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al cargar las sedes';
        setErrorSedes(mensaje);
        console.error('[MapaParqueaderos]', error);
      } finally {
        setCargando(false);
      }
    }
    cargarSedes();
  }, []);

  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!contenedorRef.current) return;

    const mapa = new MapaGL({
      container: contenedorRef.current,
      style: ESTILO_OPENFREEMAP,
      center: CENTRO_MEDELLIN,
      zoom: 13,
      pitch: 45,
      bearing: -17.6,
      locale: { 'NavigationControl.Reset Bearing': 'Reorientar al norte' },
    });

    mapaRef.current = mapa;
    mapa.addControl(new NavigationControl({ showCompass: true }), 'bottom-right');
    mapa.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

    mapa.on('load', () => setCargando(false));
    mapa.on('error', (evento) => {
      if (!mapa.loaded()) setCargando(false);
      console.error('[MapaParqueaderos] Error:', (evento as any)?.error?.message || (evento as any)?.message || evento);
    });

    return () => {
      mapa.remove();
      mapaRef.current = null;
    };
  }, []);

  // Añadir marcadores cuando cambian las sedes y el mapa está listo
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa || !mapa.loaded()) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    for (const sede of sedes) {
      const pin = crearPin(sede);
      const marker = new Marker({ element: pin })
        .setLngLat([sede.longitud, sede.latitud])
        .addTo(mapa);

      pin.addEventListener('click', () => {
        setSedeSeleccionada(sede);
        mapa.flyTo({ center: [sede.longitud, sede.latitud], zoom: 15, duration: 1200 });
      });
      pin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSedeSeleccionada(sede);
        }
      });
      markersRef.current.push(marker);
    }
  }, [sedes]);

  /** Abre el modal de confirmación de reserva. */
  function abrirModalReserva(sede: Sede) {
    setReservaModal({
      abierto: true,
      sede,
      cargando: false,
      error: null,
    });
  }

  function cerrarModalReserva() {
    setReservaModal({ abierto: false, sede: null, cargando: false, error: null });
  }

  function cerrarReservaExitosa() {
    setReservaExitosa(null);
  }

  async function confirmarReserva(modalidad: 'GARANTIZADA' | 'EXPRES') {
    const sede = reservaModal.sede;
    if (!sede) return;

    setReservaModal((prev) => ({ ...prev, cargando: true, error: null }));

    try {
      const reserva = await crearReserva(sede.id, modalidad);
      // Abrir el modal premium con todos los datos
      setReservaExitosa({
        id: reserva.id,
        codigoQr: reserva.codigoQr,
        modalidad: reserva.modalidad,
        sede: {
          id: sede.id,
          nombre: sede.nombre,
          direccion: sede.direccion,
          precioHora: sede.precioHora,
        },
      });
      setReservaModal({ abierto: false, sede: null, cargando: false, error: null });
    } catch (error) {
      const mensaje =
        error instanceof ErrorDeReserva
          ? error.message
          : 'Error inesperado al crear la reserva. Inténtalo de nuevo.';
      setReservaModal((prev) => ({ ...prev, cargando: false, error: mensaje }));
    }
  }

  async function alBuscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!consulta.trim() || !mapaRef.current) return;

    setMensaje('Buscando…');
    try {
      const hallado = await buscarDireccion(consulta.trim());
      if (!hallado) {
        setMensaje('Sin resultados para esa dirección.');
        return;
      }
      mapaRef.current.flyTo({ center: [hallado.lng, hallado.lat], zoom: 16, duration: 1800 });
      setMensaje(hallado.etiqueta.split(',')[0]);
    } catch {
      setMensaje('No se pudo contactar el buscador de direcciones.');
    }
  }

  function centrarEnMiUbicacion() {
    if (!('geolocation' in navigator) || !mapaRef.current) {
      setMensaje('Tu navegador no soporta geolocalización.');
      return;
    }
    setUbicandose(true);
    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        setUbicandose(false);
        setMensaje(null);
        mapaRef.current?.flyTo({
          center: [posicion.coords.longitude, posicion.coords.latitude],
          zoom: 16,
          duration: 1500,
        });
      },
      (error) => {
        setUbicandose(false);
        setMensaje(
          error.code === error.PERMISSION_DENIED
            ? 'Permiso de ubicación denegado; hazlo desde la barra del navegador.'
            : 'No se pudo obtener tu ubicación.',
        );
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Lienzo del mapa */}
      <div ref={contenedorRef} className="absolute inset-0" aria-label="Mapa de parqueaderos" />

      {cargando ? (
        <p
          role="status"
          className="absolute inset-0 z-10 grid place-items-center bg-fondo text-sm font-medium text-grafito/70"
        >
          Cargando el mapa de sedes…
        </p>
      ) : null}

      {errorSedes ? (
        <p
          role="alert"
          className="absolute inset-0 z-10 grid place-items-center bg-red-50 text-sm font-medium text-red-800 p-4"
        >
          {errorSedes}
        </p>
      ) : null}

      {/* Barra de búsqueda flotante con glassmorphism */}
      <form
        onSubmit={alBuscar}
        className="absolute left-1/2 top-4 z-20 flex w-[92%] max-w-md -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl"
      >
        <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-white/60" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20 L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <label className="sr-only" htmlFor="buscar-direccion">
          Buscar dirección
        </label>
        <input
          id="buscar-direccion"
          type="text"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Buscar dirección o barrio…"
          className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-acero/90 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-acero hover:scale-105"
        >
          Buscar
        </button>
      </form>

      {/* Volver al inicio */}
      <Link
        href="/"
        className="absolute left-4 top-20 z-20 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-white/20 hover:scale-105"
      >
        ← Inicio
      </Link>

      {/* Centrar en mi ubicación (botón flotante) con glassmorphism */}
      <button
        type="button"
        onClick={centrarEnMiUbicacion}
        disabled={ubicandose}
        aria-label="Centrar el mapa en mi ubicación"
        className="absolute bottom-24 right-4 z-20 grid size-12 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-white/20 hover:scale-110 disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <path d="M12 2v3.2M12 18.8V22M2 12h3.2M18.8 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Mensaje de estado con glassmorphism */}
      {mensaje ? (
        <p
          role="status"
          className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white shadow-2xl backdrop-blur-xl"
        >
          {mensaje}
        </p>
      ) : null}

      {/* Modal de confirmación de reserva (modalidad) con glassmorphism */}
      {reservaModal.abierto && reservaModal.sede && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titulo"
        >
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl p-6 shadow-2xl">
            <h2 id="modal-titulo" className="text-xl font-semibold text-white">
              Confirmar reserva
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Sede: <span className="font-medium text-white">{reservaModal.sede.nombre}</span>
            </p>
            <p className="mt-1 text-sm text-white/80">
              Precio: <span className="font-semibold text-acero">{COP.format(reservaModal.sede.precioHora)}</span> / hora
            </p>

            {reservaModal.error ? (
              <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/20 px-3.5 py-2.5 text-sm text-red-200 backdrop-blur-xl" role="alert">
                {reservaModal.error}
              </p>
            ) : null}
            <p className="mt-4 text-sm text-white/80">
              Elige la modalidad de tu reserva:
            </p>
            <div className="mt-3 grid gap-3">
              <button
                type="button"
                onClick={() => confirmarReserva('GARANTIZADA')}
                disabled={reservaModal.cargando}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 text-left backdrop-blur-xl transition-all duration-300 hover:border-acero hover:bg-acero/20 hover:scale-105 disabled:opacity-60"
              >
                <p className="font-semibold text-white">Reserva Garantizada</p>
                <p className="text-xs text-white/60">Tu celda queda reservada exclusivamente para ti.</p>
              </button>
              <button
                type="button"
                onClick={() => confirmarReserva('EXPRES')}
                disabled={reservaModal.cargando}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 text-left backdrop-blur-xl transition-all duration-300 hover:border-acero hover:bg-acero/20 hover:scale-105 disabled:opacity-60"
              >
                <p className="font-semibold text-white">Reserva Exprés</p>
                <p className="text-xs text-white/60">Llegas y te asignamos una celda disponible al momento.</p>
              </button>
            </div>
            {reservaModal.cargando && (
              <p className="mt-3 text-center text-sm text-acero animate-pulse">Creando reserva…</p>
            )}
            <button
              type="button"
              onClick={cerrarModalReserva}
              disabled={reservaModal.cargando}
              className="mt-4 w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20 hover:scale-105 disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal premium de reserva exitosa con QR */}
      <ReservaExitosaModal
        isOpen={reservaExitosa !== null}
        onClose={cerrarReservaExitosa}
        reserva={reservaExitosa}
      />

      {/* Bottom Sheet de detalle de sede */}
      <AnimatePresence>
        {sedeSeleccionada && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 flex justify-center p-4"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="w-full max-w-lg rounded-t-3xl border border-white/20 bg-white/95 backdrop-blur-2xl shadow-2xl p-5 text-grafito">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-grafito/20" />
              <h3 className="text-xl font-bold">{sedeSeleccionada.nombre}</h3>
              <p className="text-sm text-grafito/70">{sedeSeleccionada.direccion}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-grafito/60">Precio por hora</p>
                  <p className="text-2xl font-bold text-azul-acero">{COP.format(sedeSeleccionada.precioHora)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-grafito/60">Disponibilidad</p>
                  <p className="text-lg font-semibold">{sedeSeleccionada.capacidadTotal} celdas</p>
                </div>
              </div>
              <button
                onClick={() => abrirModalReserva(sedeSeleccionada)}
                disabled={sedeSeleccionada.capacidadTotal <= 0}
                className="mt-5 w-full rounded-full bg-azul-acero px-6 py-3 font-semibold text-white transition hover:bg-azul-profundo disabled:opacity-60"
              >
                Reservar
              </button>
              <button
                onClick={() => setSedeSeleccionada(null)}
                className="mt-2 w-full text-sm text-grafito/60 hover:text-grafito"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

/** Geocodificación pública de OSM (Nominatim): libre, sin API key, exige User-Agent corto. */
async function buscarDireccion(consulta: string): Promise<{ lat: number; lng: number; etiqueta: string } | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', consulta);

  const respuesta = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!respuesta.ok) return null;
  const hallados = (await respuesta.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  const primero = hallados[0];
  if (!primero) return null;
  return { lat: Number(primero.lat), lng: Number(primero.lon), etiqueta: primero.display_name };
}