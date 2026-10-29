'use client';

import MapaParqueaderos from '@/components/MapaParqueaderos';

/**
 * Búsqueda de parqueaderos (RF-11: mapa interactivo con ubicación de sedes).
 *
 * El componente del mapa es Client por naturaleza (WebGL + MapLibre) y aquí
 * solo lo abrimos a pantalla completa. Los overlays (búsqueda, centrado y
 * estado) viven dentro de `MapaParqueaderos` porque comparten la instancia.
 */
export default function PaginaBuscar() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <MapaParqueaderos />
    </main>
  );
}
