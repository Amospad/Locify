import type { FastifyError, FastifyInstance } from 'fastify';
import { ErrorDeValidacion } from '../../domain/errors/ErrorDeValidacion.js';
import { ErrorDeConflicto } from '../../domain/errors/ErrorDeConflicto.js';
import { ErrorEnvioDeInvitacion } from '../../domain/errors/ErrorEnvioDeInvitacion.js';

export interface RespuestaDeError {
  statusCode: number;
  body: { error: string };
}

/**
 * Traduce los errores de dominio e infraestructura a códigos HTTP.
 *
 * Devuelve `null` cuando el error no es de un tipo conocido: quien llama decide
 * qué hacer (la ruta lo relanza y el manejador global responde 500).
 */
export function mapearError(error: unknown): RespuestaDeError | null {
  if (error instanceof ErrorDeValidacion) {
    return { statusCode: 400, body: { error: error.message } };
  }

  if (error instanceof ErrorDeConflicto) {
    return { statusCode: 409, body: { error: error.message } };
  }

  if (error instanceof ErrorEnvioDeInvitacion) {
    return { statusCode: 502, body: { error: error.message } };
  }

  return null;
}

/**
 * Manejador global: normaliza la validación de esquema, los 4xx que emite
 * Fastify y el error inesperado.
 *
 * Un 500 nunca devuelve `stack`, el mensaje original ni detalles de Prisma o
 * SMTP: esos datos sólo van al log del servidor.
 */
export function registrarManejadorDeErrores(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    const mapeado = mapearError(error);
    if (mapeado) {
      return reply.code(mapeado.statusCode).send(mapeado.body);
    }

    // Esquema del cuerpo (ajv): el mensaje describe el contrato, no internos.
    if (error.validation) {
      return reply.code(400).send({ error: error.message });
    }

    const statusCode = error.statusCode;
    if (typeof statusCode === 'number' && statusCode >= 400 && statusCode < 500) {
      return reply.code(statusCode).send({ error: error.message });
    }

    request.log.error({ err: error }, 'Error no controlado');
    return reply.code(500).send({ error: 'Error interno del servidor.' });
  });
}
