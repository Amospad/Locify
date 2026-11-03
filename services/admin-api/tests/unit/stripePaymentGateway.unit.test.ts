import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StripePaymentGateway } from '../../src/infrastructure/payments/StripePaymentGateway.js';

describe('StripePaymentGateway - unit', () => {
  it('crea PaymentIntent con mock de Stripe sin llamada real', async () => {
    const gateway = new StripePaymentGateway('sk_test_dummy');

    const mockPaymentIntents = {
      create: async (params: any, opts?: any) => {
        // Validar parámetros
        assert.equal(params.amount, 10000 * 100);
        assert.equal(params.currency, 'cop');
        assert.equal(params.metadata?.reservaId, 'res-001');
        // idempotency key verification
        assert.equal(opts?.idempotencyKey, 'pi_res-001');
        return { client_secret: 'cs_test_123' };
      },
    };

    (gateway as any).stripe = { paymentIntents: mockPaymentIntents };

    const result = await gateway.crearPaymentIntent('res-001', 10000, 'COP', { origin: 'web' });
    assert.equal(result.clientSecret, 'cs_test_123');
  });

  it('reembolsa PaymentIntent con mock de Stripe sin llamada real', async () => {
    const gateway = new StripePaymentGateway('sk_test_dummy');

    const mockRefunds = {
      create: async (params: any) => {
        assert.equal(params.payment_intent, 'pi_abc123');
        assert.equal(params.amount, 5000 * 100);
        return { status: 'succeeded', id: 're_123' };
      },
    };

    (gateway as any).stripe = { refunds: mockRefunds };

    const result = await gateway.reembolsar('pi_abc123', 5000);
    assert.equal(result.success, true);
  });

  it('reembolsa total cuando monto no se proporciona', async () => {
    const gateway = new StripePaymentGateway('sk_test_dummy');

    const mockRefunds = {
      create: async (params: any) => {
        assert.equal(params.payment_intent, 'pi_xyz');
        assert.equal(params.amount, undefined);
        return { status: 'succeeded' };
      },
    };

    (gateway as any).stripe = { refunds: mockRefunds };

    const result = await gateway.reembolsar('pi_xyz');
    assert.equal(result.success, true);
  });
});
