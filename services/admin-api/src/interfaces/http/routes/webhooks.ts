import type { FastifyPluginAsync } from 'fastify';
import { procesarWebhookStripe } from '../../../infrastructure/payments/StripeWebhook.js';
import { ConfirmarPagoPorWebhookUseCase } from '../../../domain/use-cases/ConfirmarPagoPorWebhook.js';

interface OpcionesWebhook {
  reservaRepository: any;
}

export const rutasWebhookStripe: FastifyPluginAsync<OpcionesWebhook> = async (app, opciones) => {
  app.post('/api/webhooks/stripe', {
    config: {
      rawBody: true,
    },
    schema: {
      body: { type: 'object' },
    },
  }, async (request, reply) => {
    const signature = request.headers['stripe-signature'] as string;
    const rawBodyFromRequest = (request as any).rawBody as Buffer | undefined;
    const rawBodyBuffer = rawBodyFromRequest ?? Buffer.from(JSON.stringify(request.body));

    if (!signature || !rawBodyBuffer || rawBodyBuffer.length === 0) {
      return reply.code(400).send({ error: 'Firma o cuerpo faltante' });
    }

    try {
      const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'] ?? '';
      const event = await procesarWebhookStripe(rawBodyBuffer, signature, webhookSecret);
      
      if (event.type === 'payment_intent.succeeded') {
        const useCase = new ConfirmarPagoPorWebhookUseCase(opciones.reservaRepository);
        await useCase.ejecutar({
          type: event.type,
          data: {
            object: {
              id: event.data.object.id,
              metadata: event.data.object.metadata,
            },
          },
        });
      }
      
      return reply.code(200).send({ received: true });
    } catch (error) {
      console.error('[Webhook Stripe] Error:', error);
      return reply.code(400).send({ error: 'Firma inválida' });
    }
  });
};
