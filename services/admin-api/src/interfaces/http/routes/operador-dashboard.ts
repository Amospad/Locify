import type { FastifyPluginAsync } from 'fastify';
import { RolUsuario } from '../../../domain/entities/Usuario.js';
import { exigirRol, type PreHandler } from '../auth.js';
import type { OperadorService } from '../../../application/services/OperadorService.js';

export interface OperadorRutasDeps {
  operadorService: OperadorService;
  autenticar: PreHandler;
}

interface CuerpoCheckIn {
  codigoQr: string;
}

interface CuerpoCheckOut {
  reservaId: string;
}

interface ParametrosSede {
  sedeId: string;
}

interface ReservaCheckInResponse {
  id: string;
  codigoQr: string;
  usuarioId: string;
  sedeId: string;
  modalidad: string;
  fechaEntrada: string;
}

interface ReservaCheckOutResponse {
  id: string;
  codigoQr: string;
  usuarioId: string;
  sedeId: string;
  fechaEntrada: string;
  fechaSalida: string;
  duracionMinutos: number;
}

interface ReservaActivaResponse {
  id: string;
  codigoQr: string;
  usuarioId: string;
  sedeId: string;
  nombreSede: string;
  modalidad: string;
  fechaEntrada: string;
  duracionMinutos: number;
}

const esquemaCuerpoCheckIn = {
  type: 'object',
  additionalProperties: false,
  required: ['codigoQr'],
  properties: {
    codigoQr: { type: 'string', minLength: 12, maxLength: 12, pattern: '^[A-Z0-9]{12}$' },
  },
} as const;

const esquemaCuerpoCheckOut = {
  type: 'object',
  additionalProperties: false,
  required: ['reservaId'],
  properties: {
    reservaId: { type: 'string', minLength: 1, maxLength: 64 },
  },
} as const;

const esquemaParametrosSede = {
  type: 'object',
  additionalProperties: false,
  required: ['sedeId'],
  properties: {
    sedeId: { type: 'string', minLength: 1, maxLength: 64 },
  },
} as const;

const esquemaError = {
  type: 'object',
  additionalProperties: false,
  required: ['error'],
  properties: { error: { type: 'string' } },
} as const;

/**
 * Rutas del dashboard del operador (App del Parqueadero).
 *
 * Todas requieren autenticación y rol OPERADOR o ADMIN.
 *
 * `POST /api/operador/check-in`
 * - Body: `{ codigoQr }` (12 chars alfanumérico)
 * - 200: `{ id, codigoQr, usuarioId, sedeId, modalidad, fechaEntrada }` — check-in OK
 * - 400: QR inválido o reserva no ACTIVA
 * - 401: sin token / inválido / expirado
 * - 403: rol no OPERADOR ni ADMIN
 * - 404: QR no encontrado
 *
 * `POST /api/operador/check-out`
 * - Body: `{ reservaId }` (UUID)
 * - 200: `{ id, codigoQr, usuarioId, sedeId, fechaEntrada, fechaSalida, duracionMinutos }`
 * - 400: reserva no ACTIVA
 * - 401/403: auth
 * - 404: reserva no encontrada
 *
 * `GET /api/operador/reservas-activas?sedeId=xxx`
 * - Query: `sedeId` (requerido)
 * - 200: `[{ id, codigoQr, usuarioId, sedeId, nombreSede, modalidad, fechaEntrada, duracionMinutos }]`
 * - 401/403: auth
 * - 404: sede no existe
 */
export const rutasOperadorDashboard: FastifyPluginAsync<OperadorRutasDeps> = async (
  app,
  deps,
) => {
  // PreHandler común: autenticación + rol OPERADOR o ADMIN
  const soloOperador: PreHandler[] = [
    deps.autenticar,
    exigirRol(RolUsuario.OPERADOR, RolUsuario.ADMIN),
  ];

  app.post<{ Body: CuerpoCheckIn }>(
    '/api/operador/check-in',
    {
      preHandler: soloOperador,
      schema: {
        body: esquemaCuerpoCheckIn,
        response: {
          200: {
            type: 'object',
            required: ['id', 'codigoQr', 'usuarioId', 'sedeId', 'modalidad', 'fechaEntrada'],
            properties: {
              id: { type: 'string' },
              codigoQr: { type: 'string', minLength: 12, maxLength: 12 },
              usuarioId: { type: 'string' },
              sedeId: { type: 'string' },
              modalidad: { type: 'string', enum: ['GARANTIZADA', 'EXPRES'] },
              fechaEntrada: { type: 'string', format: 'date-time' },
            },
          },
          400: esquemaError,
          401: esquemaError,
          403: esquemaError,
          404: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { codigoQr } = request.body;
      const operadorId = request.usuarioAutenticado!.sub;

      const resultado = await deps.operadorService.checkIn(codigoQr, operadorId);

      return reply.code(200).send({
        ...resultado,
        fechaEntrada: resultado.fechaEntrada.toISOString(),
      });
    },
  );

  app.post<{ Body: CuerpoCheckOut }>(
    '/api/operador/check-out',
    {
      preHandler: soloOperador,
      schema: {
        body: esquemaCuerpoCheckOut,
        response: {
          200: {
            type: 'object',
            required: ['id', 'codigoQr', 'usuarioId', 'sedeId', 'fechaEntrada', 'fechaSalida', 'duracionMinutos'],
            properties: {
              id: { type: 'string' },
              codigoQr: { type: 'string', minLength: 12, maxLength: 12 },
              usuarioId: { type: 'string' },
              sedeId: { type: 'string' },
              fechaEntrada: { type: 'string', format: 'date-time' },
              fechaSalida: { type: 'string', format: 'date-time' },
              duracionMinutos: { type: 'integer', minimum: 1 },
            },
          },
          400: esquemaError,
          401: esquemaError,
          403: esquemaError,
          404: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { reservaId } = request.body;
      const operadorId = request.usuarioAutenticado!.sub;

      const resultado = await deps.operadorService.checkOut(reservaId, operadorId);

      return reply.code(200).send({
        ...resultado,
        fechaEntrada: resultado.fechaEntrada.toISOString(),
        fechaSalida: resultado.fechaSalida.toISOString(),
      });
    },
  );

  app.get<{ Querystring: ParametrosSede }>(
    '/api/operador/reservas-activas',
    {
      preHandler: soloOperador,
      schema: {
        querystring: esquemaParametrosSede,
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'codigoQr', 'usuarioId', 'sedeId', 'nombreSede', 'modalidad', 'fechaEntrada', 'duracionMinutos'],
              properties: {
                id: { type: 'string' },
                codigoQr: { type: 'string', minLength: 12, maxLength: 12 },
                usuarioId: { type: 'string' },
                sedeId: { type: 'string' },
                nombreSede: { type: 'string' },
                modalidad: { type: 'string', enum: ['GARANTIZADA', 'EXPRES'] },
                fechaEntrada: { type: 'string', format: 'date-time' },
                duracionMinutos: { type: 'integer', minimum: 1 },
              },
            },
          },
          401: esquemaError,
          403: esquemaError,
          404: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { sedeId } = request.query;

      const reservas = await deps.operadorService.listarReservasActivas(sedeId);

      return reply.code(200).send(
        reservas.map((r: typeof reservas[0]) => ({
          ...r,
          fechaEntrada: r.fechaEntrada.toISOString(),
        })),
      );
    },
  );
};