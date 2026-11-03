/**
 * Puerto de salida para procesar pagos y reembolsos.
 *
 * Sigue la Arquitectura Hexagonal: el dominio define el puerto y
 * los adaptadores externos lo implementan.
 */
export interface PaymentGateway {
  /**
   * Crea un PaymentIntent para procesar un pago.
   * RF-39: Integración de pagos con Stripe PaymentIntents.
   * 
   * @param reservaId - ID de la reserva en el sistema.
   * @param monto - Cantidad a cobrar.
   * @param moneda - Código de moneda (ej: "COP").
   * @param metadata - Datos adicionales para Stripe.
   * @returns El secret del cliente para completar el pago.
   */
  crearPaymentIntent(
    reservaId: string,
    monto: number,
    moneda: string,
    metadata?: Record<string, unknown>
  ): Promise<{ clientSecret: string }>;

  /**
   * Reembolsa un pago previo mediante su PaymentIntent ID.
   * RF-42: Reembolso de pagos procesados.
   * 
   * @param paymentIntentId - ID del PaymentIntent original.
   * @param monto - Cantidad a reembolsar (opcional, reembolsa todo si no se indica).
   * @returns Éxito del reembolso.
   */
  reembolsar(
    paymentIntentId: string,
    monto?: number
  ): Promise<{ success: boolean }>;
}
