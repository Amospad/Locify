# Plan Técnico — Integración Stripe Payments

> Spec: `specs/002-stripe-payments/spec.md`
> Constitución: `docs/constitution.md`
> Principios aplicados: Simplicidad y Reutilización, Arquitectura Hexagonal, Separación Lógica/UI, TDD, Seguridad Cero Confianza, Convención Lingüística.

## 1. Principios y decisiones alineadas a la Constitución

**Simplicidad y Reutilización (P1)**  
Se usa Stripe como servicio gestionado maduro. No se implementa lógica de tarjetas ni PCI en la aplicación. Las dependencias frontend son solo `@stripe/stripe-js` y `@stripe/react-stripe-js`. Todo el manejo de datos sensibles queda en Stripe Elements.

**Arquitectura Hexagonal (P3)**  
El dominio define puertos puros. `PaymentGateway` es el puerto de salida para procesar pagos y reembolsos. `StripePaymentGateway` es un adaptador externo inyectado. Los casos de uso del dominio no conocen Stripe, Fastify ni Prisma.

**Separación Lógica y UI (P4)**  
Backend Fastify orquesta dominio, validaciones y reglas de negocio. Frontend Next.js solo presenta UI y gestiona estado de formulario. Comunicación mediante contratos de API tipados.

**Seguridad Cero Confianza (P6)**  
Validación de firma de webhook con `stripe-signature`. Validación de esquemas con Zod en todos los puntos de entrada. Variables secretas nunca expuestas al cliente. RLS de Supabase mantiene aislamiento de datos.

**Convención Lingüística (P8)**  
Código en inglés, documentación y mensajes de usuario en español es-CO.

## 2. Arquitectura Hexagonal — inyección en Fastify

### Capas
- **Dominio**: `entities/Reserva`, `use-cases/CrearPaymentIntent`, `ConfirmarPagoPorWebhook`, `ReembolsarReserva`, `ports/PaymentGateway`, `ports/ReservaRepository`.
- **Aplicación**: Servicios de aplicación que orquestan casos de uso.
- **Infraestructura / Adaptadores**:
  - `infrastructure/payments/StripePaymentGateway` implementa `PaymentGateway`.
  - `infrastructure/payments/StripeWebhook` valida firma y parsea evento.
  - `infrastructure/persistence/PostgresReservaRepository`.
- **Interfaces**: `interfaces/http/routes/payments.ts`, `interfaces/http/routes/webhooks.ts`.

### Inyección
Fastify plugins reciben dependencias por `options`. El contenedor de aplicación crea instancias:
- `stripeGateway = new StripePaymentGateway(process.env.STRIPE_SECRET_KEY)`
- Se inyecta en casos de uso vía constructor.
- Los plugins Fastify registran rutas con `reservaRepository` y `paymentGateway` inyectados. No hay `new` dentro de handlers.

### Puertos y adaptadores
**Puerto**: `PaymentGateway` con operaciones de dominio:
- `crearPaymentIntent(reservaId, monto, moneda, metadata) -> clientSecret`
- `reembolsar(paymentIntentId, monto) -> PagoResultado`

**Adaptador Stripe**: traduce a SDK Stripe `paymentIntents.create`, `refunds.create`, maneja conversión a centavos COP, idempotencia con `Idempotency-Key`, reintentos con exponential backoff.

**Adaptador Webhook**: `procesarWebhookStripe(rawBody, signature, webhookSecret)` usa `stripe.webhooks.constructEvent`. Retorna evento tipado para el caso de uso.

## 3. Manejo de Webhooks

- Endpoint: `POST /api/webhooks/stripe`
- Fastify configurado con `rawBody: true` para preservar buffer.
- Validación de firma con `stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)`.
- Solo eventos relevantes: `payment_intent.succeeded`, `payment_intent.payment_failed`.
- Actualización de estado de reserva a `PAGADA` vía repositorio.
- Respuesta 200 inmediata para evitar reintentos de Stripe.
- Caso límite webhook perdido: cron job consulta `PaymentIntents` pendientes y sincroniza estado. Idempotencia por `event.id`.

## 4. Dependencias Frontend exactas

- `@stripe/stripe-js` — carga Stripe.js en cliente.
- `@stripe/react-stripe-js` — providers y hooks React para Elements.
No se añaden dependencias adicionales de pago. El formulario usa `CardElement` de Stripe Elements para que datos de tarjeta nunca toquen servidores de LOCIFY.

## 5. Variables de entorno

Backend (servicio admin-api):
- `STRIPE_SECRET_KEY` — clave secreta de Stripe, acceso solo servidor.
- `STRIPE_WEBHOOK_SECRET` — secreto del endpoint webhook.

Frontend / Next.js:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — clave publicable, expuesta al cliente.
- `NEXT_PUBLIC_SUPABASE_URL` — existente, para contexto multi-tenant.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — existente.

`.env.example` debe documentar todas las variables y su ámbito.

## 6. Flujos por RF

**RF-39 Procesamiento de Pagos**  
Frontend solicita `clientSecret` → Backend crea `PaymentIntent` con monto en COP, metadata `reservaId`, clave de idempotencia. Retorna `clientSecret` para confirmación con Stripe Elements.

**RF-40 Confirmación Webhook**  
Stripe envía `payment_intent.succeeded` → validación firma → caso de uso actualiza reserva a Pagado y persiste `payment_intent_id`.

**RF-41 Validación Frontend**  
Componente cliente usa `Elements` + `CardElement`. Datos de tarjeta procesados por Stripe, nunca llegan a backend.

**RF-42 Gestión de Reembolsos**  
Operador cancela reserva → caso de uso `ReembolsarReserva` llama `PaymentGateway.reembolsar` con `payment_intent_id` y monto.

**RF-43 Auditoría**  
Campo `paymentIntentId` se guarda en registro de reserva para trazabilidad y conciliación.

## 7. Seguridad y no funcionales

- Idempotencia en creación de PaymentIntent con clave única por reserva.
- Reintentos con exponential backoff ante fallos de red a Stripe.
- Logging estructurado sin registrar datos sensibles de tarjeta.
- Tests TDD: unidad para adaptador con mock de Stripe, integración para webhook con payload firmado.
