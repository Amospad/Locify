import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import type { ConsultadorDeBaseDeDatos } from '../../application/ports/ConsultadorDeBaseDeDatos.js';
import { rutasSalud } from './routes/health.js';

export interface DependenciasHttp {
  db: ConsultadorDeBaseDeDatos;
}

export interface OpcionesServidor {
  /** Activa el logger de Fastify (JSON). En pruebas se deja apagado. */
  logger?: boolean;
}

/** Orígenes permitidos por CORS. Sin la variable no se permite otro origen. */
function origenesPermitidos(): string[] | false {
  const crudo = process.env['CORS_ORIGINS']?.trim();
  if (!crudo) return false;

  const origenes = crudo
    .split(',')
    .map((origen) => origen.trim())
    .filter((origen) => origen.length > 0);

  return origenes.length > 0 ? origenes : false;
}

/**
 * Construye la aplicación HTTP sin abrir puerto.
 *
 * No llama a `listen()` a propósito: las pruebas usan `app.inject()`, que
 * atiende en memoria, y `src/index.ts` es el único responsable de escuchar.
 */
export async function buildServer(
  deps: DependenciasHttp,
  opciones: OpcionesServidor = {},
): Promise<FastifyInstance> {
  const app = Fastify({
    logger: opciones.logger
      ? {
          level: process.env['LOG_LEVEL'] ?? 'info',
          // La contraseña viaja en el cuerpo de /api/operadores: nunca al log.
          redact: {
            paths: ['req.body.password', 'req.body.passwordHash', 'req.headers.authorization'],
            censor: '[REDACTED]',
          },
        }
      : false,
  });

  await app.register(helmet);
  await app.register(cors, { origin: origenesPermitidos() });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(rutasSalud, { db: deps.db });

  return app;
}
