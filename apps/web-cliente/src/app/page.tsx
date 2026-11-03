'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";

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

      <Hero />
      <Features />
      <Pricing />
      <FAQ />

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
