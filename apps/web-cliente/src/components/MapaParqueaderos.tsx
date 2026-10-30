'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Map as MapaGL, Marker, NavigationControl, Popup, ScaleControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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
const ESTILO_OPENFREEMAP = 'https://tiles.openfreemap.org/styles/liberty';

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** Pin circular sin cabeza: verde con el check de la marca si hay celdas, gris si está lleno. */
function crearPin(sede: Sede): HTMLDivElement {
  const pin = document.createElement('div');
  pin.className =
    'flex size-9 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 cursor-pointer';
  pin.style.backgroundColor =
    sede.capacidadTotal > 0 ? '#00C853' : '#6B7280';
  pin.setAttribute('role', 'button');
  pin.setAttribute('tabindex', '0');
  pin.setAttribute(
    'aria-label',
    sede.capacidadTotal > 0
      ? `${sede.nombre}: ${sede.capacidadTotal} celdas totales`
      : `${sede.nombre}: sin celdas disponibles`,
  );
  // Check blanco (el check de la marca, verde solo aparece de fondo)
  pin.innerHTML =
    '<svg viewBox="0 0 24 24" class="size-5" fill="none" aria-hidden="true">' +
    '<path d="M6 12.5 L10.5 17 L18 8" stroke="white" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return pin;
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

  useEffect(() => {
    if (!contenedorRef.current) return;

    const mapa = new MapaGL({
      container: contenedorRef.current,
      style: ESTILO_OPENFREEMAP,
      center: CENTRO_MEDELLIN,
      zoom: 13,
      locale: { 'NavigationControl.Reset Bearing': 'Reorientar al norte' },
    });

    mapaRef.current = mapa;
    mapa.addControl(new NavigationControl({ showCompass: true }), 'bottom-right');
    mapa.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

    mapa.on('load', () => setCargando(false));
    mapa.on('error', (evento) => {
      if (!mapa.loaded()) setCargando(false);
      console.error('[MapaParqueaderos]', evento);
    });

    for (const sede of sedes) {
      const pin = crearPin(sede);
      const marker = new Marker({ element: pin })
        .setLngLat([sede.longitud, sede.latitud])
        .addTo(mapa);

      // Creamos el popup pero no lo asignamos al marker aún;
      // lo haremos dinámicamente al hacer clic para poder adjuntar el handler.
      pin.addEventListener('click', () => {
        abrirPopupReserva(mapa, marker, sede);
      });
      // Accesibilidad: Enter/Space en el pin
      pin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirPopupReserva(mapa, marker, sede);
        }
      });
    }

    return () => {
      mapa.remove();
      mapaRef.current = null;
    };
  }, [sedes]);

  /** Abre un popup personalizado con botón de reserva funcional. */
  function abrirPopupReserva(mapa: MapaGL, marker: Marker, sede: Sede) {
    const contenido = document.createElement('div');
    contenido.className = 'min-w-56 space-y-1.5 font-sans';
    contenido.innerHTML = `
      <p class="text-sm font-semibold text-grafito">${sede.nombre}</p>
      <p class="text-xs text-grafito/70">${sede.direccion}</p>
      <p class="text-sm"><span class="font-semibold text-acero">${COP.format(sede.precioHora)}</span><span class="text-xs text-grafito/60"> /hora</span></p>
      <p class="text-xs ${sede.capacidadTotal > 0 ? 'text-green-700' : 'text-grafito/60'}">
        ${sede.capacidadTotal > 0 ? `${sede.capacidadTotal} celdas totales` : 'Sin celdas disponibles'}
      </p>
      ${sede.capacidadTotal > 0 ? '<button type="button" id="btn-reservar-popup" class="mt-1 w-full rounded-full bg-acero px-4 py-2 text-xs font-semibold text-white hover:bg-azul-profundo transition-colors">Reservar</button>' : ''}
    `;

    const popup = new Popup({ maxWidth: '240px', closeButton: true })
      .setLngLat([sede.longitud, sede.latitud])
      .setDOMContent(contenido)
      .addTo(mapa);

    // Adjuntar handler al botón del popup después de que esté en el DOM
    if (sede.capacidadTotal > 0) {
      const btn = contenido.querySelector('#btn-reservar-popup') as HTMLButtonElement;
      if (btn) {
        btn.addEventListener('click', () => {
          popup.remove();
          abrirModalReserva(sede);
        });
      }
    }
  }

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

      {/* Barra de búsqueda flotante (estilo Google Maps) */}
      <form
        onSubmit={alBuscar}
        className="absolute left-1/2 top-4 z-20 flex w-[92%] max-w-md -translate-x-1/2 items-center gap-2 rounded-full border border-grafito/10 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur"
      >
        <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-grafito/50" fill="none" aria-hidden>
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
          className="w-full bg-transparent text-sm text-grafito placeholder:text-grafito/40 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-acero px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-azul-profundo"
        >
          Buscar
        </button>
      </form>

      {/* Volver al inicio */}
      <Link
        href="/"
        className="absolute left-4 top-20 z-20 rounded-full border border-grafito/10 bg-white/95 px-4 py-2 text-xs font-semibold text-grafito shadow-lg backdrop-blur transition-colors hover:text-acero sm:top-[4.5rem]"
      >
        ← Inicio
      </Link>

      {/* Centrar en mi ubicación (botón flotante) */}
      <button
        type="button"
        onClick={centrarEnMiUbicacion}
        disabled={ubicandose}
        aria-label="Centrar el mapa en mi ubicación"
        className="absolute bottom-24 right-4 z-20 grid size-11 place-items-center rounded-full border border-grafito/10 bg-white/95 text-acero shadow-lg backdrop-blur transition-colors hover:bg-acero hover:text-white disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <path d="M12 2v3.2M12 18.8V22M2 12h3.2M18.8 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Mensaje de estado (búsqueda / geolocalización) */}
      {mensaje ? (
        <p
          role="status"
          className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 rounded-full border border-grafito/10 bg-white/95 px-4 py-1.5 text-xs font-medium text-grafito shadow-md backdrop-blur"
        >
          {mensaje}
        </p>
      ) : null}

      {/* Modal de confirmación de reserva (modalidad) */}
      {reservaModal.abierto && reservaModal.sede && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titulo"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 id="modal-titulo" className="text-xl font-semibold text-grafito">
              Confirmar reserva
            </h2>
            <p className="mt-2 text-sm text-grafito/70">
              Sede: <span className="font-medium text-grafito">{reservaModal.sede.nombre}</span>
            </p>
            <p className="mt-1 text-sm text-grafito/70">
              Precio: <span className="font-semibold text-acero">{COP.format(reservaModal.sede.precioHora)}</span> / hora
            </p>

            {reservaModal.error ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800" role="alert">
                {reservaModal.error}
              </p>
            ) : null}
            <p className="mt-4 text-sm text-grafito/70">
              Elige la modalidad de tu reserva:
            </p>
            <div className="mt-3 grid gap-3">
              <button
                type="button"
                onClick={() => confirmarReserva('GARANTIZADA')}
                disabled={reservaModal.cargando}
                className="rounded-xl border border-grafito/20 bg-white p-4 text-left hover:border-acero hover:bg-fondo transition-colors disabled:opacity-60"
              >
                <p className="font-semibold text-grafito">Reserva Garantizada</p>
                <p className="text-xs text-grafito/60">Tu celda queda reservada exclusivamente para ti.</p>
              </button>
              <button
                type="button"
                onClick={() => confirmarReserva('EXPRES')}
                disabled={reservaModal.cargando}
                className="rounded-xl border border-grafito/20 bg-white p-4 text-left hover:border-acero hover:bg-fondo transition-colors disabled:opacity-60"
              >
                <p className="font-semibold text-grafito">Reserva Exprés</p>
                <p className="text-xs text-grafito/60">Llegas y te asignamos una celda disponible al momento.</p>
              </button>
            </div>
            {reservaModal.cargando && (
              <p className="mt-3 text-center text-sm text-acero">Creando reserva…</p>
            )}
            <button
              type="button"
              onClick={cerrarModalReserva}
              disabled={reservaModal.cargando}
              className="mt-4 w-full rounded-full border border-grafito/20 bg-white px-6 py-2.5 font-semibold text-grafito hover:border-acero hover:text-acero transition-colors disabled:opacity-60"
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