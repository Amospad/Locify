---
sidebar_position: 6
title: Integraciones
---

# Integraciones

## Stripe Pagos

### Backend
- `npm install stripe` en `services/admin-api`
- `StripePaymentGateway.ts` reemplaza `MockPaymentGateway`.
- `POST /api/payments/create-intent`
  - Input: `{ reservaId }`
  - Output: `{ clientSecret }`
- `POST /api/payments/webhook`
  - Escucha `payment_intent.succeeded` y actualiza reserva a `PAGADA`.

Variables:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Frontend
- `@stripe/stripe-js` + `@stripe/react-stripe-js`
- `StripePaymentModal.tsx` con `<Elements>` y `<PaymentElement>`
- Modal de reserva GARANTIZADA → pago → QR.

## Apex Dashboard

Estilo premium con glassmorphism OKLCH.

- **Conductor** `/dashboard`
  - Widget Reserva Activa con QR + cronómetro
  - Historial con paginación y filtros por estado
  - Tarjeta Mis Vehículos

- **Operador** `/operador/dashboard`
  - Gráfico ocupación 24h con Recharts
  - Tabla Vehículos Activos con Check-out
  - Escáner QR modal flotante

- **Admin KYB** `/admin/kyb`
  - Tabla Tickets KYB con badges y botones Aprobar/Rechazar
  - Gráfico circular distribución sedes por estado

Clases: `glass`, variables OKLCH `--primary`, `--accent`, `--bg`, `--surface`, `--fg`.
