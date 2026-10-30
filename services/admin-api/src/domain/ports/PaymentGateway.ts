export interface PagoResultado {
  exitoso: boolean;
  transaccionId: string;
}

/**
 * Puerto de salida para procesar pagos y reembolsos.
 * 
 * Sigue la Arquitectura Hexagonal: el dominio define el puerto y
 * los adaptadores externos lo implementan.
 */
export interface PaymentGateway {
  /**
   * Procesa un pago con tarjeta.
   * @param monto - Cantidad a cobrar en COP.
   * @param moneda - Código de moneda (ej: "COP").
   * @param tokenTarjeta - Token generado por el frontend.
   */
  procesarPago(monto: number, moneda: string, tokenTarjeta: string): Promise<PagoResultado>;

  /**
   * Reembolsa un pago previo.
   * @param transaccionId - ID de la transacción original.
   * @param monto - Cantidad a reembolsar.
   */
  reembolsar(transaccionId: string, monto: number): Promise<PagoResultado>;
}
