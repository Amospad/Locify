import Stripe from 'stripe';

export async function procesarWebhookStripe(rawBody: Buffer | string, signatureHeader: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET no configurado');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-10-28.endive',
  });

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signatureHeader, webhookSecret);
    return event;
  } catch (error) {
    console.error('[StripeWebhookProcessor] Firma inválida:', error);
    throw new Error('Firma inválida');
  }
}
