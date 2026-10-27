import type { FastifyError, FastifyInstance } from 'fastify';
import { ErrorDeValidacion } from '../../domain/errors/ErrorDeValidacion.js';
import { ErrorDeConflicto } from '../../domain/errors/ErrorDeConflicto.js';
import { ErrorEnvioDeInvitacion } from '../../domain/errors/ErrorEnvioDeInvitacion.js';
import { ErrorNoEncontrado } from '../../domain/errors/ErrorNoEncontrado.js';
import { CredencialesInvalidasError } from '../../domain/errors/CredencialesInvalidasError.js';
import { TokenInvalidoError } from '../../domain/errors/TokenInvalidoError.js';
import { UsuarioNoActivoError } from '../../domain/errors/UsuarioNoActivoError.js';
import { AccesoDenegadoError } from '../../domain/errors/AccesoDenegadoError.js';

export interface RespuestaDeError {
  statusCode: number;
  body: { error: string; id?: string };
}

/**
 * Traduce los errores de dominio e infraestructura a códigos HTTP.
 *
 * Devuelve `null` cuando el error no es de un tipo conocido: el manejador
 * global lo trata como 500.
 */
export function mapearError(error: unknown): RespuestaDeError | null {
  if (error instanceof ErrorDeValidacion) {
    return { statusCode: 400, body: { error: error.message } };
  }

  if (error instanceof ErrorDeConflicto) {
    return { statusCode: 409, body: { error: error.message } };
  }

  if (error instanceof ErrorNoEncontrado) {
    return { statusCode: 404, body: { error: error.message } };
  }

  if (error instanceof CredencialesInvalidasError || error instanceof TokenInvalidoError) {
    return { statusCode: 401, body: { error: error.message } };
  }

  if (error instanceof UsuarioNoActivoError || error instanceof AccesoDenegadoError) {
    return { statusCode: 403, body: { error: error.message } };
  }

  if (error instanceof ErrorEnvioDeInvitacion) {
    return {
      statusCode: 502,
      body: {
        error: error.message,
        // El cliente necesita el id para reintentar la invitación y no el registro.
        ...(error.idOperador ? { id: error.idOperador } : {}),
      },
    };
  }

  return null;
}

/**
 * Manejador global: normaliza la validación de esquema, los 4xx que emite
 * Fastify y el error inesperado.
 *
 * Es el único lugar que decide el código HTTP de una excepción, así que
 * también es el único que la registra: un 502 por SMTP caído deja su causa en
 * el log, mientras el cliente recibe un mensaje sin detalles internos.
 *
 * Un 500 nunca devuelve `stack`, el mensaje original ni detalles de Prisma o
 * SMTP: esos datos sólo van al log del servidor.
 */
export function registrarManejadorDeErrores(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    const mapeado = mapearError(error);

    if (mapeado) {
      if (mapeado.statusCode >= 500) {
        // La causa original (ECONNREFUSED, timeout, etc.) sólo va al log.
        request.log.error(
          { err: error.cause ?? error },
          'Error de dominio con respuesta 5xx',
        );
      }

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
