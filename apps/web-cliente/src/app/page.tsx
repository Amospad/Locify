import Image from "next/image";

/**
 * Landing (HU-12 como objetivo posterior): por ahora es el Hero del MVP con
 * los dos caminos del producto: buscar parqueadero (RF-11) e iniciar sesión
 * (login RF-07 del backend). Los enlaces son placeholders hasta que existan
 * las rutas reales.
 */
export default function PaginaInicio() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:py-32">
      <Image
        src="/logo.svg"
        alt="LOCIFY — celda con puerta abierta y tick verde de disponibilidad confirmada"
        width={271}
        height={48}
        priority
        unoptimized
        className="mb-10"
      />

      <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-grafito sm:text-5xl">
        Encuentra tu parqueadero en segundos
      </h1>

      <p className="mt-4 max-w-xl text-lg leading-8 text-grafito/70">
        Celdas reales en tiempo real: reserva garantizada con check-in por QR y
        pago automático, o pide una reserva exprés antes de llegar.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <a
          href="#buscar"
          className="rounded-full bg-acero px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-azul-profundo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acero"
        >
          Buscar parqueadero
        </a>
        <a
          href="#iniciar-sesion"
          className="rounded-full border border-grafito/20 bg-white px-8 py-3 font-semibold text-grafito shadow-sm transition-colors hover:border-acero hover:text-acero focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acero"
        >
          Iniciar sesión
        </a>
      </div>

      <p className="mt-14 text-sm text-grafito/50">
        Reserva garantizada · Exprés con QR · Cancelación con ventana de gratuidad
      </p>
    </main>
  );
}
