'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ThreeScene from "@/components/ThreeScene";

/**
 * Landing futurista con escena 3D interactiva y efectos glassmorphism.
 * Diseño moderno con profundidad visual y animaciones avanzadas.
 */
export default function PaginaInicio() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 3D Scene Background */}
      <ThreeScene />
      
      {/* Content Overlay */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <Image
            src="/logo.svg"
            alt="LOCIFY — celda con puerta abierta y tick verde de disponibilidad confirmada"
            width={271}
            height={48}
            priority
            unoptimized
            className="drop-shadow-2xl"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-7xl">
            <span className="bg-gradient-to-r from-white via-white to-acero bg-clip-text text-transparent">
              Encuentra tu parqueadero
            </span>
            <br />
            <span className="text-acero">en segundos</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 backdrop-blur-sm"
          >
            Celdas reales en tiempo real con tecnología avanzada.
            Reserva garantizada con check-in por QR y pago automático,
            o pide una reserva exprés antes de llegar.
          </motion.p>
        </motion.div>

        {/* CTA Buttons with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/buscar"
            className="group relative rounded-full bg-acero/90 px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-acero hover:scale-105 hover:shadow-2xl hover:shadow-acero/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acero"
          >
            <span className="relative z-10">Buscar parqueadero</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-acero to-azul-profundo opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          
          <Link
            href="/iniciar-sesion"
            className="group relative rounded-full border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="relative z-10">Iniciar sesión</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { icon: "✓", text: "Reserva garantizada" },
            { icon: "⚡", text: "Exprés con QR" },
            { icon: "↩", text: "Cancelación flexible" }
          ].map((feature, i) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-4 shadow-2xl"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm font-medium text-white/90">{feature.text}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 text-sm text-white/40 backdrop-blur-sm"
        >
          Powered by LOCIFY Technology • Medellín, Colombia
        </motion.p>
      </main>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-fondo to-transparent" />
    </div>
  );
}
