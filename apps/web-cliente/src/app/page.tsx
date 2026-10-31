'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false });

/**
 * Landing page oficial LOCIFY — punto de entrada para Conductores y Operadores.
 * Navbar glassmorphism, Hero 3D interactivo y sección Cómo funciona con dos caminos.
 */
export default function PaginaInicio() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B1220]">
      {/* 3D Scene Background */}
      <Hero3D />

      {/* Navbar Glassmorphism */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="LOCIFY"
              width={140}
              height={24}
              unoptimized
              priority
              className="drop-shadow-lg"
            />
          </Link>
          <nav className="hidden items-center gap-3 md:flex">
            <Link
              href="/buscar"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl transition hover:bg-white/10"
            >
              Soy Conductor
            </Link>
            <Link
              href="/operador/kyb"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl transition hover:bg-white/10"
            >
              Soy Parqueadero
            </Link>
            <Link
              href="/iniciar-sesion"
              className="rounded-full bg-acero/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-acero"
            >
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-7xl">
            <span className="bg-gradient-to-r from-white via-white to-acero bg-clip-text text-transparent">
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
            Conectamos conductores con parqueaderos en tiempo real. Reserva, paga y accede sin fricciones.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/buscar"
            className="group relative rounded-full bg-verde-esmeralda px-8 py-4 font-semibold text-grafito backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-verde-esmeralda/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-esmeralda"
          >
            Soy Conductor
          </Link>
          <Link
            href="/operador/kyb"
            className="group relative rounded-full bg-acero px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-acero/25"
          >
            Soy Parqueadero
          </Link>
          <Link
            href="/iniciar-sesion"
            className="text-sm text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white transition"
          >
            Iniciar Sesión
          </Link>
        </motion.div>
      </main>

      {/* Value Proposition */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl"
          >
            ¿Qué hace LOCIFY?
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: 'Reserva en tiempo real', desc: 'Celdas disponibles al instante en el mapa de Medellín.' },
              { title: 'Acceso sin contacto', desc: 'Códigos QR inmutables para ingreso y salida rápida.' },
              { title: 'Gestión inteligente', desc: 'Control de ocupación y pagos automáticos para operadores.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <div className="mb-4 text-xl font-semibold text-white">{item.title}</div>
                <p className="text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección ¿Cómo funciona? */}
      <section className="relative z-10 border-t border-white/10 bg-black/20 py-24 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl"
          >
            ¿Cómo funciona?
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Conductores */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="mb-4 text-2xl font-semibold text-white">Conductores</div>
              <p className="mb-6 text-white/80">Encuentra tu espacio en segundos</p>
              <Link
                href="/buscar"
                className="inline-flex rounded-full bg-acero/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-acero"
              >
                Ir al Mapa
              </Link>
            </motion.div>

            {/* Operadores */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="mb-4 text-2xl font-semibold text-white">Operadores</div>
              <p className="mb-6 text-white/80">Gestiona tu parqueadero de forma inteligente</p>
              <Link
                href="/operador/kyb"
                className="inline-flex rounded-full bg-verde-esmeralda px-6 py-3 text-sm font-semibold text-grafito transition hover:brightness-110"
              >
                Registrar mi Parqueadero
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 py-8 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-white/60 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="LOCIFY" width={100} height={18} unoptimized className="opacity-80" />
            <span>© 2026 LOCIFY</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/buscar" className="hover:text-white">Buscar</Link>
            <Link href="/operador/kyb" className="hover:text-white">Operadores</Link>
            <Link href="/iniciar-sesion" className="hover:text-white">Iniciar Sesión</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
