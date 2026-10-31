'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="max-w-4xl"
      >
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-7xl">
          <span className="bg-gradient-to-r from-white via-white to-[oklch(62%_0.21_255)] bg-clip-text text-transparent">
            El futuro del
          </span>
          <br />
          <span className="text-white">estacionamiento urbano</span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80"
        >
          Conectamos conductores con parqueaderos en tiempo real. Reserva, paga y accede sin fricciones con una experiencia premium inspirada en Velora UI.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
      >
        <Link
          href="/buscar"
          className="group relative rounded-full glass px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{ backgroundColor: "color-mix(in oklch, var(--primary) 40%, transparent)" }}
        >
          Soy Conductor
        </Link>
        <Link
          href="/operador/kyb"
          className="group relative rounded-full glass px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{ backgroundColor: "color-mix(in oklch, var(--accent) 40%, transparent)" }}
        >
          Soy Parqueadero
        </Link>
      </motion.div>
    </section>
  );
}
