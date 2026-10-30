import Stripe from 'stripe';
import type { PaymentGateway, PagoResultado } from '../../domain/ports/PaymentGateway.js';

/**
 * Adaptador real para Stripe (modo sandbox).
 * Implementa el puerto PaymentGateway usando Stripe SDK.
 */
export class StripePaymentGateway implements PaymentGateway {
  private readonly stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-10-28.endive',
    });
  }

  async procesarPago(monto: number, moneda: string, tokenTarjeta: string): Promise<PagoResultado> {
    try {
      // Stripe usa centavos
      const charge = await this.stripe.charges.create({
        amount: Math.round(monto * 100),
        currency: moneda.toLowerCase(),
        source: tokenTarjeta,
        description: 'Reserva LOCIFY',
      });

      return {
        exitoso: charge.status === 'succeeded',
        transaccionId: charge.id,
      };
    } catch (error) {
      console.error('[StripePaymentGateway] Error procesando pago:', error);
      return {
        exitoso: false,
        transaccionId: `stripe-error-${Date.now()}`,
      };
    }
  }

  async reembolsar(transaccionId: string, monto: number): Promise<PagoResultado> {
    try {
      const refund = await this.stripe.refunds.create({
        charge: transaccionId.replace('ch_', ''),
        amount: Math.round(monto * 100),
      });

      return {
        exitoso: refund.status === 'succeeded',
        transaccionId: refund.id,
      };
    } catch (error) {
      console.error('[StripePaymentGateway] Error reembolsando:', error);
      return {
        exitoso: false,
        transaccionId: `stripe-refund-error-${Date.now()}`,
      };
    }
  }
}
