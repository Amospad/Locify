import type { PaymentGateway, PagoResultado } from '../../domain/ports/PaymentGateway.js';

/**
 * Adaptador mock para simulación de pagos en desarrollo/testing.
 * Simula éxito salvo cuando el monto es cero o negativo.
 */
export class MockPaymentGateway implements PaymentGateway {
  async procesarPago(monto: number, moneda: string, tokenTarjeta: string): Promise<PagoResultado> {
    if (monto <= 0) {
      return { exitoso: false, transaccionId: `mock-fail-${Date.now()}` };
    }

    // Simula latencia de red
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      exitoso: true,
      transaccionId: `mock-tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
  }

  async reembolsar(transaccionId: string, monto: number): Promise<PagoResultado> {
    if (monto <= 0) {
      return { exitoso: false, transaccionId: `mock-refund-fail-${Date.now()}` };
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      exitoso: true,
      transaccionId: `mock-refund-${Date.now()}-${transaccionId.slice(-8)}`,
    };
  }
}
