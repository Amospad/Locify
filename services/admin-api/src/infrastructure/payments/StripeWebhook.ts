import Stripe from 'stripe';

export async function procesarWebhookStripe(rawBody: Buffer, signature: string, webhookSecret: string) {
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET no configurado');
  }

  const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] ?? '', {
    apiVersion: '2026-10-28.endive',
  });

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    return event;
  } catch (error) {
    console.error('[Webhook Stripe] Firma inválida:', error);
    throw error;
  }
}
