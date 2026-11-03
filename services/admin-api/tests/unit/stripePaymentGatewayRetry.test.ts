import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StripePaymentGateway } from '../../src/infrastructure/payments/StripePaymentGateway.js';

test('crearPaymentIntent reintenta 3 veces con backoff exponencial ante errores de red y luego falla si persiste', async () => {
  const gateway = new StripePaymentGateway('sk_test_dummy');

  let attempts = 0;
  const mockPaymentIntents = {
    create: async () => {
      attempts++;
      const err: any = new Error('Network error');
      err.type = 'StripeConnectionError';
      err.code = 'ECONNRESET';
      throw err;
    },
  };

  // @ts-ignore
  (gateway as any).stripe = {
    paymentIntents: mockPaymentIntents,
  };

  const start = Date.now();
  let threw = false;
  try {
    await gateway.crearPaymentIntent('res-1', 1000, 'COP');
  } catch (e) {
    threw = true;
  }
  const duration = Date.now() - start;

  assert.ok(threw, 'Debe fallar tras reintentos');
  assert.equal(attempts, 3, 'Debe intentar 3 veces');

  // Backoff exponencial mínimo: 100 + 200 ms ~ 300ms, permitimos margen
  assert.ok(duration >= 250, `Duración esperada >=250ms por backoff, fue ${duration}ms`);
});

test('crearPaymentIntent tiene éxito tras reintentos transitorios', async () => {
  const gateway = new StripePaymentGateway('sk_test_dummy');

  let attempts = 0;
  const mockPaymentIntents = {
    create: async () => {
      attempts++;
      if (attempts < 3) {
        const err: any = new Error('Network error');
        err.type = 'StripeConnectionError';
        throw err;
      }
      return { client_secret: 'secret_test' };
    },
  };

  // @ts-ignore
  (gateway as any).stripe = {
    paymentIntents: mockPaymentIntents,
  };

  const result = await gateway.crearPaymentIntent('res-1', 1000, 'COP');
  assert.equal(result.clientSecret, 'secret_test');
  assert.equal(attempts, 3, 'Debe reintentar 2 veces y triunfar en la tercera');
});

test('reembolsar reintenta con backoff ante errores de red', async () => {
  const gateway = new StripePaymentGateway('sk_test_dummy');

  let attempts = 0;
  const mockRefunds = {
    create: async () => {
      attempts++;
      const err: any = new Error('Network error');
      err.type = 'StripeConnectionError';
      throw err;
    },
  };

  // @ts-ignore
  (gateway as any).stripe = {
    refunds: mockRefunds,
  };

  const result = await gateway.reembolsar('pi_123', 1000);
  assert.equal(result.success, false, 'Debe devolver success false tras reintentos fallidos');
  assert.equal(attempts, 3, 'Debe intentar 3 veces');
});
