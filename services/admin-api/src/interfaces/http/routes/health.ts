import type { FastifyPluginAsync } from 'fastify';
import type { ConsultadorDeBaseDeDatos } from '../../../application/ports/ConsultadorDeBaseDeDatos.js';

interface OpcionesSalud {
  db: ConsultadorDeBaseDeDatos;
}

const esquemaRespuesta = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    db: { type: 'string' },
  },
  required: ['status', 'db'],
} as const;

/**
 * `GET /health`: 200 si la base responde, 503 si no.
 * El detalle del fallo se registra en el log, nunca en la respuesta.
 */
export const rutasSalud: FastifyPluginAsync<OpcionesSalud> = async (app, opciones) => {
  app.get(
    '/health',
    {
      // Un monitor de disponibilidad no debe consumir la cuota de rate limit.
      config: { rateLimit: false },
      schema: {
        response: {
          200: esquemaRespuesta,
          503: esquemaRespuesta,
        },
      },
    },
    async (request, reply) => {
      try {
        const filas = await opciones.db.consultar();

        if (filas.length === 0) {
          request.log.warn('SELECT 1 no devolvió filas: la base no responde');
          return reply.code(503).send({ status: 'error', db: 'down' });
        }

        return reply.code(200).send({ status: 'ok', db: 'up' });
      } catch (error) {
        request.log.error({ err: error }, 'Falló el chequeo de salud de la base');
        return reply.code(503).send({ status: 'error', db: 'down' });
      }
    },
  );
};
