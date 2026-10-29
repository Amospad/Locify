import type { MetadataRoute } from 'next';

/**
 * Manifiesto de la PWA (App del Cliente, §2.2 del SRS).
 *
 * Next.js lo sirve como `/manifest.webmanifest` e inyecta el `<link
 * rel="manifest">` solo con este archivo; visita de escritorio e instalación
 * comparten la misma definición. Los iconos son los de la marca «Vía libre»
 * copiados desde `docs/static/img/`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LOCIFY — Reserva, check-in y pago',
    short_name: 'LOCIFY',
    description:
      'Reserva garantizada con check-in por QR y pago automático, o reserva exprés antes de llegar. Celdas reales en tiempo real.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F6F8',
    theme_color: '#2F5D9F',
    icons: [
      {
        src: '/android-chrome-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
