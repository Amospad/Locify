import Stripe from 'stripe';
import type { PaymentGateway } from '../../domain/ports/PaymentGateway.js';

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

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isNetworkError(error: unknown): boolean {
    const err = error as any;
    return (
      err?.type === 'StripeConnectionError' ||
      err?.code === 'ECONNRESET' ||
      err?.code === 'ETIMEDOUT' ||
      err?.code === 'ENOTFOUND' ||
      (typeof err?.message === 'string' && /network/i.test(err.message))
    );
  }

  async crearPaymentIntent(
    reservaId: string,
    monto: number,
    moneda: string,
    metadata?: Record<string, unknown>
  ): Promise<{ clientSecret: string }> {
    const amountCents = Math.round(monto * 100);
    const idempotencyKey = `pi_${reservaId}`;
    const params = {
      amount: amountCents,
      currency: moneda.toLowerCase(),
      metadata: {
        reservaId,
        ...metadata,
      },
    };

    const maxAttempts = 3;
    let attempt = 0;

    while (true) {
      try {
        const intent = await this.stripe.paymentIntents.create(params, { idempotencyKey });
        return { clientSecret: intent.client_secret ?? '' };
      } catch (error) {
        attempt++;
        const isNet = this.isNetworkError(error);
        if (!isNet || attempt >= maxAttempts) {
          console.error('[StripePaymentGateway] Error creando PaymentIntent:', error);
          throw error;
        }
        const delay = 100 * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }
  }

  async reembolsar(
    paymentIntentId: string,
    monto?: number
  ): Promise<{ success: boolean }> {
    const params: Stripe.RefundsCreateParams = {
      payment_intent: paymentIntentId,
    };

    if (monto !== undefined && monto !== null) {
      params.amount = Math.round(monto * 100);
    }

    const maxAttempts = 3;
    let attempt = 0;

    while (true) {
      try {
        const refund = await this.stripe.refunds.create(params);
        return { success: refund.status === 'succeeded' };
      } catch (error) {
        attempt++;
        const isNet = this.isNetworkError(error);
        if (!isNet || attempt >= maxAttempts) {
          console.error('[StripePaymentGateway] Error reembolsando:', error);
          return { success: false };
        }
        const delay = 100 * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }
  }
}
