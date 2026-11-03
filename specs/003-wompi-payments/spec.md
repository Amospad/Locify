# Especificación: Migración de Stripe a Wompi (LOCIFY)

## 1. Contexto
La plataforma LOCIFY requiere migrar su pasarela de pagos de Stripe a **Wompi** para optimizar costos transaccionales y mejorar la cobertura de métodos de pago locales en Colombia. Esta migración estratégica permitirá una integración más robusta con las necesidades específicas del mercado local.

## 2. Requisitos Funcionales
- **Creación de Transacciones**: Implementar el flujo para crear una transacción en Wompi (tipo 'checkout') y obtener la `checkoutUrl` para redirigir al usuario.
- **Webhooks**: Implementar un endpoint de recepción de webhooks de Wompi para procesar el evento `transaction.updated` y actualizar el estado de los pagos en la base de datos local.
- **Reembolsos**: Implementar la funcionalidad para solicitar reembolsos a través de la API oficial de Wompi.

## 3. Casos Límite
- **Pago Pendiente**: Manejo de estados de transacción que no han sido confirmados inmediatamente.
- **Pago Rechazado**: Gestión de errores en la transacción (fondos insuficientes, tarjeta expirada, etc.) y feedback al usuario.
- **Pago Aprobado**: Confirmación final y actualización correcta del estado del pedido/cita.

## 4. Implementación de Gateways
- **Interfaz Base**: Definir una interfaz `PaymentGateway` para abstraer la lógica de pago.
- **WompiMockGateway**: Implementar una versión mock para entornos de desarrollo y pruebas unitarias.
- **WompiPaymentGateway**: Implementar la integración real con la API de Wompi (para usar cuando se disponga de las llaves `prv_test_`).

## 5. Fuera de Alcance
- **Suscripciones**: Este desarrollo se limita únicamente a pagos únicos (pagos por servicios/citas). Las suscripciones no están contempladas en esta fase.
