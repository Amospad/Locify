# Tareas — Integración Stripe Payments

Ordenadas por dependencia: Backend → Frontend → Pruebas.

## Backend — Arquitectura y configuración

- [x] **T1. Actualizar .env.example con variables Stripe**
  - RF: RF-39, RF-40, RF-41, RF-42, RF-43
  - Hecho cuando: `.env.example` contiene `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` con comentarios indicando ámbito servidor/cliente y se valida que no se commitea `.env`.

- [x] **T2. Documentar contrato del puerto PaymentGateway para PaymentIntent y reembolso**
  - RF: RF-39, RF-42
  - Hecho cuando: interfaz `PaymentGateway` documenta métodos `crearPaymentIntent` y `reembolsar` con parámetros de dominio y se alinea con spec.md.

- [x] **T3. Implementar adaptador StripePaymentGateway con inyección de secretKey**
  - RF: RF-39, RF-42
  - Hecho cuando: clase `StripePaymentGateway` implementa `PaymentGateway`, recibe `secretKey` por constructor, usa SDK Stripe y maneja conversión a centavos COP.

- [x] **T4. Configurar plugin Fastify payments con inyección de dependencias**
  - RF: RF-39
  - Hecho cuando: `rutasPagos` recibe `reservaRepository` y `paymentGateway` por options, sin instanciación interna.

- [x] **T5. Implementar endpoint POST /api/payments/create-intent con validación Zod**
  - RF: RF-39, RF-43
  - Hecho cuando: endpoint valida `reservaId`, crea PaymentIntent con metadata `reservaId`, devuelve `clientSecret` y usa clave de idempotencia.

- [x] **T6. Implementar adaptador StripeWebhook con validación de firma**
  - RF: RF-40
  - Hecho cuando: `procesarWebhookStripe` construye evento con `stripe.webhooks.constructEvent` y lanza error si firma es inválida o falta `STRIPE_WEBHOOK_SECRET`.

- [x] **T7. Implementar endpoint POST /api/webhooks/stripe con rawBody**
  - RF: RF-40
  - Hecho cuando: ruta está configurada con `rawBody: true`, extrae `stripe-signature`, valida y responde 200 para evento válido, 400 para firma inválida.

- [x] **T8. Conectar caso de uso ConfirmarPagoPorWebhook a actualización de reserva**
  - RF: RF-40, RF-43
  - Hecho cuando: al recibir `payment_intent.succeeded`, se busca reserva por metadata, estado pasa a `PAGADA` y se persiste `paymentIntentId`.

- [x] **T9. Implementar caso de uso ReembolsarReserva y flujo operativo**
  - RF: RF-42
  - Hecho cuando: al cancelar reserva dentro de periodo, se invoca `paymentGateway.reembolsar` con `paymentIntentId` y monto, y se actualiza estado de reserva.

- [x] **T10. Añadir manejo de errores y backoff exponencial en adaptador**
  - RF: RF-39, RF-42
  - Hecho cuando: adaptador captura errores de red, reintenta con backoff y devuelve resultado consistente.

## Frontend — Stripe Elements y UX

- [x] **T11. Instalar dependencias @stripe/stripe-js y @stripe/react-stripe-js**
  - RF: RF-41
  - Hecho cuando: `package.json` incluye ambas dependencias con versiones compatibles y `pnpm install` completa sin errores.

- [x] **T12. Crear provider Stripe en layout de pago con clave publicable**
  - RF: RF-41
  - Hecho cuando: componente raíz monta `<Elements stripe={stripePromise}>` usando `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` y no expone secret key.

- [x] **T13. Implementar componente PaymentForm con CardElement**
  - RF: RF-41
  - Hecho cuando: formulario obtiene `clientSecret` desde `/api/payments/create-intent`, renderiza `CardElement`, confirma pago con Stripe.js y muestra estados de carga/éxito/error.

- [x] **T14. Mostrar mensaje de error específico para card_declined**
  - RF: RF-39
  - Hecho cuando: UI muestra mensaje en español al usuario cuando Stripe retorna `card_declined` y reserva permanece en estado pendiente.

## Pruebas y validación

- [x] **T15. Test unitario adaptador StripePaymentGateway con mock de Stripe**
  - RF: RF-39, RF-42
  - Hecho cuando: test verifica creación de PaymentIntent y reembolso sin llamadas reales a Stripe.

- [x] **T16. Test integración webhook con payload firmado**
  - RF: RF-40
  - Hecho cuando: test genera payload firmado, invoca endpoint webhook y verifica actualización de estado de reserva.

- [x] **T17. Test E2E flujo completo de pago con tarjetas de prueba Stripe**
  - RF: RF-39, RF-40, RF-41
  - Hecho cuando: flujo reserva → pago con tarjeta test 4242 → webhook → reserva marcada como PAGADA pasa en Playwright.

- [ ] **T18. Verificar auditoría de payment_intent_id en base de datos**
  - RF: RF-43
  - Hecho cuando: consulta directa muestra `paymentIntentId` persistido en registro de reserva tras pago exitoso.
