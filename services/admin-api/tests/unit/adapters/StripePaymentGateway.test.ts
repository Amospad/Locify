import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StripePaymentGateway } from '../../../src/infrastructure/payments/StripePaymentGateway.js';

describe('StripePaymentGateway', () => {
  it('crea PaymentIntent con monto convertido a centavos y metadata de reserva', async () => {
    const gateway = new StripePaymentGateway('sk_test_dummy');

    // Mock internals
    const mockPaymentIntents = {
      create: async (params: any) => {
        assert.equal(params.amount, 1000000);
        assert.equal(params.currency, 'cop');
        assert.equal(params.metadata?.reservaId, 'reserva-123');
        return { client_secret: 'pi_123_secret_abc' };
      },
    };

    (gateway as any).stripe = {
      paymentIntents: mockPaymentIntents,
    };

    const result = await gateway.crearPaymentIntent('reserva-123', 10000, 'COP', { origen: 'web' });

    assert.equal(result.clientSecret, 'pi_123_secret_abc');
  });

  it('construye los parámetros correctos para reembolso total', async () => {
    const gateway = new StripePaymentGateway('sk_test_dummy');

    const mockRefunds = {
      create: async (params: any) => {
        assert.equal(params.payment_intent, 'pi_123');
        assert.equal(params.amount, undefined); // reembolso total
        return { status: 'succeeded', id: 're_123' };
      },
    };

    (gateway as any).stripe = {
      refunds: mockRefunds,
    };

    const result = await gateway.reembolsar('pi_123');
    assert.equal(result.success, true);
  });

  it('construye los parámetros correctos para reembolso parcial en centavos', async () => {
    const gateway = new StripePaymentGateway('sk_test_dummy');

    const mockRefunds = {
      create: async (params: any) => {
        assert.equal(params.payment_intent, 'pi_456');
        assert.equal(params.amount, 250000); // 2500 *100
        return { status: 'succeeded', id: 're_456' };
      },
    };

    (gateway as any).stripe = {
      refunds: mockRefunds,
    };

    const result = await gateway.reembolsar('pi_456', 2500);
    assert.equal(result.success, true);
  });
});
