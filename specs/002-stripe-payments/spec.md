# Especificación Técnica: Integración de Stripe Payments

## 1. Contexto y objetivo
Actualmente, el sistema utiliza un `MockPaymentGateway` para simular transacciones financieras. Para avanzar a una fase de producción, es imperativo integrar una pasarela de pagos real, robusta y compatible con los estándares de seguridad (PCI DSS). La integración con Stripe permitirá:
- **Profesionalización:** Habilitar el procesamiento real de pagos con tarjeta de crédito/débito.
- **Seguridad:** Delegar el manejo de datos sensibles de tarjetas a Stripe (Stripe Elements).
- **Conciliación:** Automatizar el seguimiento de transacciones y estados de pago mediante Webhooks.

## 2. Historias de usuario
- **Como Conductor:** Quiero pagar con tarjeta de crédito/débito al realizar mi reserva, para garantizar mi cupo inmediatamente y no tener que preocuparme por efectivo al momento del servicio.
- **Como Operador:** Quiero recibir el dinero de mis reservas de forma segura y transparente, centralizando los pagos en mi cuenta bancaria a través de la plataforma.

## 3. Requisitos funcionales
- **RF-39 (Procesamiento de Pagos):** Cuando el usuario confirma una reserva garantizada, el sistema debe generar un `PaymentIntent` de Stripe por el monto total del servicio.
- **RF-40 (Confirmación Webhook):** Cuando Stripe procesa exitosamente un pago, el sistema debe recibir y validar el evento `payment_intent.succeeded` vía Webhook para actualizar el estado de la reserva a "Pagado".
- **RF-41 (Validación Frontend):** Cuando el usuario ingresa sus datos de tarjeta, la interfaz debe utilizar Stripe Elements para asegurar que los datos no toquen los servidores de la aplicación.
- **RF-42 (Gestión de Reembolsos):** Cuando un operador cancela una reserva dentro del periodo permitido, el sistema debe solicitar a Stripe la devolución del cargo asociado al `PaymentIntent` original.
- **RF-43 (Auditoría de Transacciones):** El sistema debe registrar en la base de datos el `payment_intent_id` de Stripe asociado a cada reserva para propósitos de auditoría y conciliación futura.

## 4. Requisitos no funcionales
- **Seguridad:** Los endpoints de Webhooks deben ser protegidos verificando la firma del evento (`stripe-signature`) para evitar ataques de suplantación.
- **Idempotencia:** El sistema debe manejar la idempotencia enviando una clave única (Key de Idempotencia) en las solicitudes de pago para evitar cargos duplicados por reintentos de red.
- **Manejo de errores:** Ante fallos de conexión con Stripe, el sistema debe reintentar la operación con un esquema de *exponential backoff* antes de informar al usuario.

## 5. Casos límite
- **Tarjeta rechazada:** Si Stripe retorna un error de pago (`card_declined`), el sistema debe informar al usuario el motivo específico del rechazo y mantener la reserva en estado "Pendiente de pago" sin confirmar el cupo.
- **Webhook perdido/fallido:** Si el Webhook falla o se pierde, el sistema debe implementar una tarea programada (cron job) que consulte periódicamente el estado de los `PaymentIntent` pendientes en Stripe para sincronizar el estado en nuestra base de datos.

## 6. Fuera de alcance
- No se implementará el soporte para suscripciones recurrentes (Billing) en esta iteración.
- No se manejarán pagos divididos (*Split Payments*) ni transferencias automáticas a cuentas bancarias de terceros vía Stripe Connect por el momento.
