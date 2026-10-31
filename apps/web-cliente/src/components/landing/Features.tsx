'use client';

import { motion } from "framer-motion";

const features = [
  {
    title: "Reserva en tiempo real",
    desc: "Celdas disponibles al instante en el mapa de Medellín con actualización en vivo.",
  },
  {
    title: "Acceso QR",
    desc: "Códigos QR inmutables para ingreso y salida rápida sin contacto.",
  },
  {
    title: "Gestión Inteligente",
    desc: "Control de ocupación y pagos automáticos para operadores con analytics.",
  },
];

export default function Features() {
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
          ¿Qué hace LOCIFY?
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 glass p-8 backdrop-blur-xl"
            >
              <div className="mb-4 text-xl font-semibold text-white">{item.title}</div>
              <p className="text-white/80">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
