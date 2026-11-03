import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { procesarWebhookStripe } from '../../src/infrastructure/payments/StripeWebhookProcessor.js';

describe('StripeWebhookProcessor.procesarWebhookStripe', () => {
  const originalEnv = process.env.STRIPE_WEBHOOK_SECRET;

  beforeEach(() => {
    // Reset env before each test
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
  });

  it('construye evento con firma válida', async () => {
    const rawBody = JSON.stringify({ id: 'evt_test', object: 'event' });
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const secret = process.env.STRIPE_WEBHOOK_SECRET!;
    const signatureHash = crypto.createHmac('sha256', secret).update(timestamp + '.' + rawBody).digest('hex');
    const signature = `t=${timestamp},v1=${signatureHash}`;

    const event = await procesarWebhookStripe(Buffer.from(rawBody), signature);
    assert.ok(event);
    assert.equal(event.id, 'evt_test');
  });

  it('lanza error si la firma es inválida', async () => {
    const rawBody = JSON.stringify({ id: 'evt_test' });
    const signature = 't=12345,v1=invalid';

    await assert.rejects(
      async () => {
        await procesarWebhookStripe(Buffer.from(rawBody), signature);
      },
      /Firma inválida|invalid signature/i
    );
  });

  it('lanza error si falta STRIPE_WEBHOOK_SECRET', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const rawBody = Buffer.from('{}');
    const signature = 't=123,v1=abc';

    await assert.rejects(
      async () => {
        await procesarWebhookStripe(rawBody, signature);
      },
      /STRIPE_WEBHOOK_SECRET/
    );
  });
});
