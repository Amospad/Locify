# Plan: Implementación de Integración Wompi

## 1. Objetivo
Integrar Wompi como pasarela de pagos en Korte, utilizando arquitectura hexagonal para permitir futuros cambios de pasarela o entornos de prueba.

## 2. Arquitectura (Hexagonal)
- **Dominio**: Definir contrato `PaymentGateway` en `domain/payments/`.
- **Adaptadores**:
  - `WompiPaymentGateway`: Implementa el gateway real usando la API v1/v2 de Wompi.
  - `WompiMockGateway`: Adaptador para entorno de desarrollo (simula estados).
- **Inyección**: Uso de un factory o DI simple basado en `process.env`.

## 3. Webhook (Api Boundary)
- **Endpoint**: `POST /api/webhooks/wompi`.
- **Seguridad**: Validación MD5 del evento (firma enviada por Wompi).
- **Lógica**: Actualizar `Appointment` / `Order` status en DB vía Prisma.

## 4. Frontend
- **Checkout Flow**: 
  - Generar transacción mediante `PaymentService`.
  - Redireccionar al usuario a la `checkoutUrl` proporcionada por Wompi.
- **Feedback**: Manejo de estados (pending, approved, declined).

## 5. Estrategia de Entrega
1. **Infraestructura**: Definir puerto y tipos base.
2. **Backend**: Implementar Mock -> Gateway -> Webhook.
3. **Frontend**: UI integración con checkout.
4. **Validación**: Smoke test en modo mock.
