# Tasks: Integración Wompi (feat-003)

### Fase 1: Backend - Core & Mocks
- [ ] Crear contrato `PaymentGateway` en `domain/payments/ports.ts`.
- [x] Implementar `WompiMockGateway` (respuesta estática exitosa).
- [ ] Configurar factoría de adaptadores basada en `.env`.

### Fase 2: Backend - Integración Real
- [ ] Implementar `WompiPaymentGateway` (calls a Wompi API).
- [ ] Crear endpoint `api/webhooks/wompi` con validación HMAC/MD5.
- [ ] Implementar lógica de actualización de pagos (Prisma service).

### Fase 3: Frontend
- [ ] Crear `PaymentCheckoutButton` componente.
- [ ] Integrar redirección a `checkoutUrl`.
- [ ] Manejar estados de retorno (URL success/fail).

### Fase 4: Pruebas & Verificación
- [ ] Test unitario: Validación de firma webhook.
- [ ] Test integración: Mock flow exitoso.
