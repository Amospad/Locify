/**
 * Datos mock de sedes para el mapa (RF-11, dashboard de búsqueda).
 *
 * Cuando exista el módulo `operador-api` (RF-25) y su endpoint
 * `GET /api/sedes?lat=…&lng=…`, este array se reemplaza por el consumo real
 * con la misma forma de `SedeMock`. Coordenadas de Medellín (Bogotá en UTC-5).
 */
export interface SedeMock {
  id: string;
  nombre: string;
  direccion: string;
  /** Latitud en grados decimales (EPSG:4326). */
  latitud: number;
  /** Longitud en grados decimales (EPSG:4326). */
  longitud: number;
  /** Precio por hora en COP. */
  precioPorHora: number;
  /** Celdas DISPONIBLES ahora mismo. */
  disponibles: number;
  /** Celdas totales de la sede. */
  total: number;
}

export const SEDES_MOCK: SedeMock[] = [
  {
    id: 'sede-el-poblado',
    nombre: 'LOCIFY El Poblado — Plaza mayor',
    direccion: 'Cra. 43A #6 Sur-15, El Poblado',
    latitud: 6.2085,
    longitud: -75.5655,
    precioPorHora: 4500,
    disponibles: 12,
    total: 30,
  },
  {
    id: 'sede-centro',
    nombre: 'LOCIFY Centro — Parque Berrío',
    direccion: 'Cra. 50 #52-40, La Candelaria',
    latitud: 6.2476,
    longitud: -75.5694,
    precioPorHora: 3500,
    disponibles: 0,
    total: 24,
  },
  {
    id: 'sede-laureles',
    nombre: 'LOCIFY Laureles — Primer Parque',
    direccion: 'Circular 4 #73-30, Laureles',
    latitud: 6.2558,
    longitud: -75.5917,
    precioPorHora: 4000,
    disponibles: 5,
    total: 18,
  },
  {
    id: 'sede-belen',
    nombre: 'LOCIFY Belén — Calle 30',
    direccion: 'Cl. 30 #73-120, Belén',
    latitud: 6.2338,
    longitud: -75.5962,
    precioPorHora: 3000,
    disponibles: 9,
    total: 15,
  },
  {
    id: 'sede-envigado',
    nombre: 'LOCIFY Envigado — Calle Real',
    direccion: 'Cl. 37 Sur #39-11, Envigado',
    latitud: 6.1699,
    longitud: -75.58,
    precioPorHora: 3800,
    disponibles: 20,
    total: 25,
  },
];
