/**
 * Error lanzado cuando un pago es rechazado por el gateway.
 * Corresponde a HTTP 402 Payment Required.
 */
export class PagoRechazadoError extends Error {
  constructor(mensaje: string = 'El pago fue rechazado') {
    super(mensaje);
    this.name = 'PagoRechazadoError';
  }
}
