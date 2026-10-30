import type { FastifyPluginAsync } from 'fastify';

export const rutasWebhookStripe: FastifyPluginAsync = async (app) => {
  app.post('/api/webhooks/stripe', {
    config: {
      // Deshabilita el body parser de Fastify para webhooks de Stripe
      rawBody: true,
    },
    schema: {
      body: { type: 'object' },
    },
  }, async (request, reply) => {
    const signature = request.headers['stripe-signature'] as string;
    const rawBody = request.rawBody;

    if (!signature || !rawBody) {
      return reply.code(400).send({ error: 'Firma o cuerpo faltante' });
    }

    try {
      // Aquí iría la validación real con Stripe SDK
      // const event = stripe.webhooks.constructEvent(...)
      
      return reply.code(200).send({ received: true });
    } catch (error) {
      console.error('[Webhook Stripe] Error:', error);
      return reply.code(400).send({ error: 'Firma inválida' });
    }
  });
};
