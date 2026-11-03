import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { EstadoReserva } from '../../../domain/entities/Reserva.js';
import type { ReservaRepository } from '../../../domain/ports/ReservaRepository.js';
import type { SedeRepository } from '../../../domain/ports/SedeRepository.js';
import type { PaymentGateway } from '../../../domain/ports/PaymentGateway.js';

interface OpcionesPagos {
  reservaRepository: ReservaRepository;
  sedeRepository: SedeRepository;
  paymentGateway: PaymentGateway;
}

export const rutasPagos: FastifyPluginAsync<OpcionesPagos> = async (app, opciones) => {

  const esquemaCrearIntent = {
    type: 'object',
    additionalProperties: false,
    required: ['reservaId'],
    properties: {
      reservaId: { type: 'string', minLength: 1 },
    },
  } as const;

  app.post(
    '/api/payments/create-intent',
    {
      schema: {
        body: esquemaCrearIntent,
        response: {
          200: {
            type: 'object',
            required: ['clientSecret'],
            properties: {
              clientSecret: { type: 'string' },
            },
          },
          400: { type: 'object', properties: { error: { type: 'string' } } },
          404: { type: 'object', properties: { error: { type: 'string' } } },
          500: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (request, reply) => {
      try {
        const schema = z.object({ reservaId: z.string().min(1) });
        const parseResult = schema.safeParse(request.body);
        if (!parseResult.success) {
          return reply.code(400).send({ error: 'Validación fallida: reservaId requerido' });
        }
        const { reservaId } = parseResult.data;
        const reserva = await opciones.reservaRepository.buscarPorId(reservaId);
        if (!reserva) {
          return reply.code(404).send({ error: 'Reserva no encontrada' });
        }

        const sede = await opciones.sedeRepository.buscarPorId(reserva.sedeId);
        if (!sede) {
          return reply.code(404).send({ error: 'Sede no encontrada' });
        }

        const monto = sede.precioHora; // valor en COP mayor

        const { clientSecret } = await opciones.paymentGateway.crearPaymentIntent(
          reservaId,
          monto,
          'COP',
          { reservaId }
        );

        return reply.code(200).send({ clientSecret });
      } catch (error) {
        console.error('[payments] create-intent error:', error);
        return reply.code(500).send({ error: 'Error al crear PaymentIntent' });
      }
    }
  );
};
