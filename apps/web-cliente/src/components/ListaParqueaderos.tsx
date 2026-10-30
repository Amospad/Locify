'use client';

import { motion } from 'framer-motion';
import { type Sede } from '@/types/sede';

export default function ListaParqueaderos({ sedes }: { sedes: Sede[] }) {
  const formatPrecio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

  return (
    <div className="p-4 pb-24 space-y-4 flex flex-col gap-4 [scroll-snap-type:y_mandatory] overflow-y-auto">
      {sedes.length === 0 && (
        <div className="text-center text-grafito/60 py-10">No hay parqueaderos cercanos.</div>
      )}
      {sedes.map((sede, i) => (
        <motion.div
          key={sede.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/70 backdrop-blur-xl p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] [scroll-snap-align:start]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-bold text-[17px] leading-tight text-grafito truncate">{sede.nombre}</h3>
              <p className="text-[13px] text-grafito/70 mt-1 line-clamp-2">{sede.direccion}</p>
              <span className="inline-flex items-center gap-1 mt-3 rounded-full bg-verde-esmeralda/10 text-verde-esmeralda px-2.5 py-1 text-[11px] font-semibold">
                <span className="size-1.5 rounded-full bg-verde-esmeralda" />
                {sede.capacidadTotal} cupos
              </span>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[22px] font-bold tracking-tight text-acero">{formatPrecio.format(sede.precioHora)}<span className="text-[13px] font-medium text-grafito/60">/h</span></p>
              <button className="mt-3 rounded-[999px] bg-verde-esmeralda px-5 py-2.5 text-white text-sm font-semibold shadow-[0_8px_20px_-8px_rgba(0,200,83,0.6)] active:scale-[0.98] transition">
                Reservar
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
