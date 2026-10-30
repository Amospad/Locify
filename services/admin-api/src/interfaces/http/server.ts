import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import type { ConsultadorDeBaseDeDatos } from '../../application/ports/ConsultadorDeBaseDeDatos.js';
import type { ServicioDeTokens } from '../../domain/ports/ServicioDeTokens.js';
import type { SedeRepository } from '../../domain/ports/SedeRepository.js';
import { rutasSalud } from './routes/health.js';
import { rutasOperadores, type RegistradorDeOperadores } from './routes/operadores.js';
import { rutasAuth, type IniciadorDeSesion } from './routes/auth.js';
import { rutasReservas, type GestorDeReservas } from './routes/reservas.js';
import { rutasSedes } from './routes/sedes.js';
import { rutasOperadorDashboard, type OperadorRutasDeps } from './routes/operador-dashboard.js';
import { crearAutenticacion } from './auth.js';
import { registrarManejadorDeErrores } from './errores.js';

export interface DependenciasHttp {
  db: ConsultadorDeBaseDeDatos;
  adminService: RegistradorDeOperadores;
  authService: IniciadorDeSesion;
  reservaService: GestorDeReservas;
  /** Servicio para operaciones de operador (check-in, check-out, lista activas). */
  operadorService: OperadorRutasDeps['operadorService'];
  /** Verifica los tokens de acceso de las rutas protegidas. */
  servicioTokens: ServicioDeTokens;
  /** Repositorio de sedes para el endpoint público. */
  sedeRepository: SedeRepository;
}

export interface OpcionesServidor {
  /** Activa el logger de Fastify (JSON). En pruebas se deja apagado. */
  logger?: boolean;
  /**
   * Confiar en `X-Forwarded-For` del cliente. Sólo cuando el servicio corre
   * detrás de un proxy propio (nginx, Vercel, ALB): entonces la llave del rate
   * limit y los logs son la IP real del cliente. Expuesto a Internet, debe
   * quedarse en `false`: la cabecera es falsificable y rotarla evadiría el
   * límite de peticiones.
   */
  trustProxy?: boolean;
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
    // Fastify elimina por defecto las propiedades extra en lugar de
    // rechazarlas. Aquí el contrato es explícito: un campo no declarado en el
    // esquema (p. ej. `rol`) debe devolver 400, no ignorarse en silencio.
    ajv: {
      customOptions: {
        removeAdditional: false,
        coerceTypes: false,
      },
    },
    // 32 KiB: sobra para credenciales JSON (el cuerpo más grande útil es
    // email + contraseña, ~0,5 KiB) y corta cuerpos de hasta 1 MiB que Fastify
    // aceptaría por defecto. Un ataque de amplificación parsea y valida JSON
    // gigantes sobre Argon2 de 64 MiB por petición: se corta antes del AJV.
    bodyLimit: 32 * 1024,
    // La IP del rate limit/log es la del par TCP salvo declaración explícita:
    // rotar `X-Forwarded-For` no evada el límite cuando se expone directamente.
    trustProxy: opciones.trustProxy ?? false,
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

  registrarManejadorDeErrores(app);

  const autenticar = crearAutenticacion(deps.servicioTokens);

  await app.register(rutasSalud, { db: deps.db });
  await app.register(rutasAuth, { authService: deps.authService });
  await app.register(rutasOperadores, {
    adminService: deps.adminService,
    autenticar,
  });
  await app.register(rutasReservas, {
    reservaService: deps.reservaService,
    autenticar,
  });
  await app.register(rutasSedes, { sedeRepository: deps.sedeRepository });
  await app.register(rutasOperadorDashboard, {
    operadorService: deps.operadorService,
    autenticar,
  });

  return app;
}
