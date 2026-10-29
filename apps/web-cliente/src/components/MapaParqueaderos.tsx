'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Map as MapaGL, Marker, NavigationControl, Popup, ScaleControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SEDES_MOCK, type SedeMock } from '@/lib/mockSedes';

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
function crearPin(sede: SedeMock): HTMLDivElement {
  const pin = document.createElement('div');
  pin.className =
    'flex size-9 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 cursor-pointer';
  pin.style.backgroundColor =
    sede.disponibles > 0 ? '#00C853' : '#6B7280';
  pin.setAttribute('role', 'button');
  pin.setAttribute('tabindex', '0');
  pin.setAttribute(
    'aria-label',
    sede.disponibles > 0
      ? `${sede.nombre}: ${sede.disponibles} celdas disponibles`
      : `${sede.nombre}: sin celdas disponibles`,
  );
  // Check blanco (el check de la marca, verde solo aparece de fondo)
  pin.innerHTML =
    '<svg viewBox="0 0 24 24" class="size-5" fill="none" aria-hidden="true">' +
    '<path d="M6 12.5 L10.5 17 L18 8" stroke="white" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return pin;
}

function crearPopup(sede: SedeMock): Popup {
  const contenido = document.createElement('div');
  contenido.className = 'min-w-56 space-y-1.5 font-sans';
  contenido.innerHTML = `
    <p class="text-sm font-semibold text-grafito">${sede.nombre}</p>
    <p class="text-xs text-grafito/70">${sede.direccion}</p>
    <p class="text-sm"><span class="font-semibold text-acero">${COP.format(sede.precioPorHora)}</span><span class="text-xs text-grafito/60"> /hora</span></p>
    <p class="text-xs ${sede.disponibles > 0 ? 'text-green-700' : 'text-grafito/60'}">
      ${sede.disponibles > 0 ? `${sede.disponibles} de ${sede.total} celdas disponibles` : 'Sin celdas disponibles'}
    </p>
    ${sede.disponibles > 0 ? '<button type="button" title="Próximamente" class="mt-1 w-full rounded-full bg-acero px-4 py-2 text-xs font-semibold text-white hover:bg-azul-profundo">Reservar</button>' : ''}
  `;

  const popup = new Popup({ maxWidth: '240px' }).setDOMContent(contenido);
  return popup;
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

export default function MapaParqueaderos() {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<MapaGL | null>(null);
  const [cargando, setCargando] = useState(true);
  const [consulta, setConsulta] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [ubicandose, setUbicandose] = useState(false);

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
      // Tiles caídos no deben dejar la pantalla muerta: el overlay sale con el load igual.
      if (!mapa.loaded()) setCargando(false);
      console.error('[MapaParqueaderos]', evento);
    });

    for (const sede of SEDES_MOCK) {
      new Marker({ element: crearPin(sede) })
        .setLngLat([sede.longitud, sede.latitud])
        .setPopup(crearPopup(sede))
        .addTo(mapa);
    }

    return () => {
      mapa.remove();
      mapaRef.current = null;
    };
  }, []);

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
    </div>
  );
}
