import { test } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import crypto from 'node:crypto';
import { rutasWebhookStripe } from '../../src/interfaces/http/routes/webhooks.js';

function crearReservaRepoMock() {
  return {
    async buscarPorId() { return null; },
    async guardar() {},
  };
}

test('POST /api/webhooks/stripe acepta rawBody y responde 200 con firma válida', async () => {
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';

  const app = Fastify();
  try {
    await app.register(rutasWebhookStripe, { reservaRepository: crearReservaRepoMock() });

    const rawBody = JSON.stringify({ id: 'evt_test', object: 'event' });
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const secret = process.env.STRIPE_WEBHOOK_SECRET!;
    const signatureHash = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
    const signature = `t=${timestamp},v1=${signatureHash}`;

    const res = await app.inject({
      method: 'POST',
      url: '/api/webhooks/stripe',
      headers: {
        'stripe-signature': signature,
        'content-type': 'application/json',
      },
      payload: rawBody,
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.equal(body.received, true);
  } finally {
    await app.close();
  }
});

test('POST /api/webhooks/stripe responde 400 con firma inválida', async () => {
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';

  const app = Fastify();
  try {
    await app.register(rutasWebhookStripe, { reservaRepository: crearReservaRepoMock() });

    const rawBody = JSON.stringify({ id: 'evt_test' });
    const signature = 't=12345,v1=invalid';

    const res = await app.inject({
      method: 'POST',
      url: '/api/webhooks/stripe',
      headers: {
        'stripe-signature': signature,
        'content-type': 'application/json',
      },
      payload: rawBody,
    });

    assert.equal(res.statusCode, 400);
    const body = JSON.parse(res.payload);
    assert.ok(body.error);
  } finally {
    await app.close();
  }
});

test('POST /api/webhooks/stripe responde 400 si falta firma o cuerpo', async () => {
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';

  const app = Fastify();
  try {
    await app.register(rutasWebhookStripe, { reservaRepository: crearReservaRepoMock() });

    const res = await app.inject({
      method: 'POST',
      url: '/api/webhooks/stripe',
      headers: {
        'content-type': 'application/json',
      },
      payload: '{}',
    });

    assert.equal(res.statusCode, 400);
  } finally {
    await app.close();
  }
});
