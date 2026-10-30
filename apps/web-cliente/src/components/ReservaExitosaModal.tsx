'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';

/** Datos de la reserva para el modal premium. */
export interface ReservaModalProps {
  id: string;
  codigoQr: string;
  modalidad: 'GARANTIZADA' | 'EXPRES';
  sede: {
    id: string;
    nombre: string;
    direccion: string;
    precioHora: number;
  };
}

/** Props del componente modal. */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  reserva: ReservaModalProps | null;
}

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function ReservaExitosaModal({ isOpen, onClose, reserva }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [tiempoRestante, setTiempoRestante] = useState<number>(5 * 60); // 5 minutos en segundos
  const [expirado, setExpirado] = useState(false);
  const [descargando, setDescargando] = useState(false);

  // Temporizador solo para Exprés
  useEffect(() => {
    if (!isOpen || !reserva) return;

    if (reserva.modalidad === 'EXPRES') {
      setTiempoRestante(5 * 60);
      setExpirado(false);

      const intervalo = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            setExpirado(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(intervalo);
    } else {
      // Garantizada no tiene temporizador
      setTiempoRestante(0);
      setExpirado(false);
    }
  }, [isOpen, reserva?.modalidad]);

  // Descargar QR como imagen PNG
  const descargarQR = async () => {
    if (!qrRef.current || descargando) return;

    setDescargando(true);
    try {
      const dataUrl = await toPng(qrRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        quality: 1,
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `LOCIFY-QR-${reserva?.id.slice(0, 8)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar QR:', error);
    } finally {
      setDescargando(false);
    }
  };

  // Formatear tiempo mm:ss
  const formatearTiempo = (segundos: number): string => {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const seg = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
  };

  if (!isOpen || !reserva) return null;

  const esExpres = reserva.modalidad === 'EXPRES';
  const badgeColor = esExpres ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
  const badgeIcon = esExpres ? (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  const badgeTexto = esExpres ? 'Reserva Exprés' : 'Reserva Garantizada';
  const subtituloTexto = esExpres
    ? 'Presenta este código en la entrada. Tienes 5 minutos para llegar.'
    : 'Presenta este código en la entrada. Tu celda está garantizada.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Badge de modalidad */}
        <div className="flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${badgeColor}`}
          >
            {badgeIcon}
            {badgeTexto}
          </span>
        </div>

        {/* Icono de éxito */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', damping: 15, stiffness: 200 }}
          className="mt-6 flex justify-center"
        >
          <div
            className={`flex size-16 items-center justify-center rounded-full border-4 ${
              expirado ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            {expirado ? (
              <svg className="size-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="size-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </motion.div>

        {/* Título y subtítulo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="mt-6 text-center"
        >
          <h2 id="modal-titulo" className="text-2xl font-bold text-grafito">
            {expirado ? 'Reserva Expirada' : '¡Reserva Confirmada!'}
          </h2>
          <p className="mt-2 text-sm text-grafito/70">{subtituloTexto}</p>
        </motion.div>

        {/* Info de la sede */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-6 rounded-xl bg-fondo p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-grafito">{reserva.sede.nombre}</p>
              <p className="text-xs text-grafito/60">{reserva.sede.direccion}</p>
            </div>
            <p className="text-sm font-semibold text-acero">{COP.format(reserva.sede.precioHora)} / hora</p>
          </div>
        </motion.div>

        {/* Contador regresivo para Exprés */}
        {esExpres && !expirado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: 'spring', damping: 20, stiffness: 150 }}
            className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-center"
          >
            <p className="text-xs font-medium text-amber-800 uppercase tracking-wider">
              Tiempo restante
            </p>
            <p className="mt-1 font-mono text-3xl font-bold text-amber-700 tabular-nums">
              {formatearTiempo(tiempoRestante)}
            </p>
            <p className="mt-1 text-xs text-amber-700/80">
              Llega antes de que el tiempo se agote
            </p>
          </motion.div>
        )}

        {expirado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-center"
          >
            <p className="text-sm font-medium text-red-800">Esta reserva Exprés ha expirado</p>
            <p className="mt-1 text-xs text-red-700/80">
              Crea una nueva reserva desde el mapa
            </p>
          </motion.div>
        )}

        {/* Código QR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-6"
        >
          <div ref={qrRef} className="flex justify-center">
            <QRCodeSVG
              value={reserva.codigoQr}
              size={180}
              level="M"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#1F2937"
            />
          </div>
          <p className="mt-4 font-mono text-base font-semibold text-grafito text-center break-all tracking-wide">
            {reserva.codigoQr}
          </p>
          <p className="mt-2 text-xs text-grafito/60 text-center">
            ID: {reserva.id}
          </p>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="mt-8 space-y-3"
        >
          <button
            type="button"
            onClick={descargarQR}
            disabled={descargando}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-acero px-6 py-3 font-semibold text-white transition-colors hover:bg-azul-profundo disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {descargando ? (
              <>
                <svg className="animate-spin size-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Preparando imagen…
              </>
            ) : (
              <>
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar QR
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-grafito/20 bg-white px-6 py-3 font-semibold text-grafito transition-colors hover:border-acero hover:text-acero hover:bg-fondo"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19l7-7 7 7" />
            </svg>
            Cerrar
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}