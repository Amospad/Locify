'use client';

import { useState, useEffect } from 'react';
import { listarSedesOperador, crearSedeOperador, eliminarSedeOperador, type SedeOperador } from '@/lib/api';

export default function SedesPage() {
  const [sedes, setSedes] = useState<SedeOperador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarSedes();
  }, []);

  async function cargarSedes() {
    try {
      setLoading(true);
      const data = await listarSedesOperador();
      setSedes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar sedes');
    } finally {
      setLoading(false);
    }
  }

  async function eliminarSede(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta sede?')) return;
    try {
      await eliminarSedeOperador(id);
      await cargarSedes();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-grafito">Mis Sedes (Operador)</h1>
        <button 
          onClick={() => alert('Formulario de creación en desarrollo')}
          className="px-4 py-2 bg-grafito text-fondo rounded-lg hover:opacity-90 transition"
        >
          + Nueva Sede
        </button>
      </div>

      {loading && <p>Cargando sedes desde el backend...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && sedes.length === 0 && (
        <div className="text-center py-12 bg-acero/10 rounded-xl">
          <p className="text-grafito/60">No tienes sedes registradas aún.</p>
        </div>
      )}

      <div className="grid gap-4">
        {sedes.map((sede) => (
          <div key={sede.id} className="p-6 bg-white border border-acero/20 rounded-xl shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{sede.nombre}</h3>
              <p className="text-sm text-grafito/60">{sede.direccion}</p>
              <div className="mt-2 text-xs flex gap-4">
                <span>Capacidad: {sede.capacidadTotal} celdas</span>
                <span>Precio: ${sede.precioHora}/h</span>
                <span className="font-semibold text-emerald-600">Estado: {sede.estado}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => eliminarSede(sede.id)}
                className="px-3 py-1 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
