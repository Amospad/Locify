'use client';

import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Conductores",
    price: "Gratis",
    desc: "Acceso completo a reservas, QR y pagos sin costo.",
    features: ["Búsqueda en tiempo real", "Reserva instantánea", "Acceso QR", "Soporte por chat"],
    cta: "Comenzar",
    href: "/buscar",
    highlight: false,
  },
  {
    name: "Operadores",
    price: "Suscripción mensual",
    desc: "Gestiona tu parqueadero con herramientas premium.",
    features: ["Panel de gestión", "Analytics de ocupación", "Pagos automáticos", "Soporte prioritario"],
    cta: "Registrar parqueadero",
    href: "/operador/kyb",
    highlight: true,
  },
];

export default function Pricing() {
  return (
    <section className="relative z-10 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl"
        >
          Planes
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 glass p-8 backdrop-blur-xl"
              style={{
                backgroundColor: plan.highlight
                  ? "color-mix(in oklch, var(--primary) 20%, transparent)"
                  : "color-mix(in oklch, var(--surface) 70%, transparent)",
              }}
            >
              <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-4xl font-bold text-white">{plan.price}</p>
              <p className="mt-2 text-white/70">{plan.desc}</p>
              <ul className="mt-6 space-y-2 text-white/80">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[oklch(65%_0.22_150)]">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className="mt-8 inline-flex rounded-full px-6 py-3 font-semibold text-white glass backdrop-blur-xl transition hover:scale-105"
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
