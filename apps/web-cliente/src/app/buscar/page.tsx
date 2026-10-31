'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { type Sede } from '@/types/sede';
import ListaParqueaderos from '@/components/ListaParqueaderos';

const MapaParqueaderos = dynamic(() => import('@/components/MapaParqueaderos'), { ssr: false });

/**
 * Búsqueda de parqueaderos (RF-11: mapa interactivo con ubicación de sedes).
 */
export default function PaginaBuscar() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
        const res = await fetch(`${base}/api/sedes`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const datos = (await res.json()) as Sede[];
        setSedes(datos);
      } catch (e) {
        console.error('[Buscar] Error cargando sedes', e);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  return (
    <main className="flex flex-col h-screen w-full">
      <div className="h-[50vh] relative">
        <MapaParqueaderos sedes={sedes} />
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <ListaParqueaderos sedes={sedes} />
      </div>
    </main>
  );
}
