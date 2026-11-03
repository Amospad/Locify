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

## Wompi Pagos

### Backend
- `WompiMockGateway` para pruebas y `WompiPaymentGateway` para producción.
- `POST /api/payments/create-transaction`
  - Input: `{ reservaId }`
  - Output: `{ checkoutUrl }`
- `POST /api/webhooks/wompi`
  - Escucha `transaction.updated` y valida firma MD5 con `prv_test_`.
  - Actualiza reserva a `PAGADA` cuando estado = `APPROVED`.

Variables:
- `WOMPI_PUBLIC_KEY` = `pub_test_...`
- `WOMPI_PRIVATE_KEY` = `prv_test_...`
- `WOMPI_WEBHOOK_SECRET`

### Frontend
- Botón que redirige a `checkoutUrl` de Wompi.
- En modo mock, simula pago y devuelve éxito inmediatamente.

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
