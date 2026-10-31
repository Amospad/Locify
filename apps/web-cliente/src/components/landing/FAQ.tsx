'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "¿Cómo funciona la reserva en tiempo real?",
    a: "El mapa se actualiza cada pocos segundos con la ocupación real reportada por los operadores.",
  },
  {
    q: "¿El acceso QR es seguro?",
    a: "Sí, los códigos son únicos por reserva, con expiración y validación en la entrada.",
  },
  {
    q: "¿Qué incluye la suscripción para operadores?",
    a: "Panel de gestión, analytics, integración de pagos automáticos y soporte prioritario.",
  },
  {
    q: "¿Puedo usar LOCIFY sin crear cuenta?",
    a: "Puedes explorar el mapa como invitado, pero necesitarás cuenta para reservar y pagar.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative z-10 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
          Preguntas frecuentes
        </h2>
        <div className="space-y-4">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="rounded-3xl border border-white/10 glass p-6 backdrop-blur-xl">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-lg font-medium text-white">{item.q}</span>
                  <span className="text-white/60">{isOpen ? "−" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-white/80">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
