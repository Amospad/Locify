import type { PaymentGateway } from '../../domain/ports/PaymentGateway.js';

/**
 * Adaptador mock de Wompi para desarrollo y pruebas.
 * Implementa el puerto PaymentGateway con respuestas estáticas exitosas.
 */
export class WompiMockGateway implements PaymentGateway {
  async crearPaymentIntent(
    reservaId: string,
    monto: number,
    moneda: string,
    metadata?: Record<string, unknown>
  ): Promise<{ clientSecret: string }> {
    // Simula latencia mínima
    await new Promise(resolve => setTimeout(resolve, 10));
    // Respuesta estática para tests
    return { clientSecret: 'wompi_mock_client_secret' };
  }

  async reembolsar(
    paymentIntentId: string,
    monto?: number
  ): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 10));
    // Siempre exitoso en mock
    return { success: true };
  }
}
