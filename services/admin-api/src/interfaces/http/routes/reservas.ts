import type { FastifyPluginAsync } from 'fastify';
import type { ReservaCreada } from '../../../domain/use-cases/CrearReserva.js';
import type { ReservaUsuarioDTO } from '../../../domain/use-cases/ListarMisReservas.js';
import type { ReservaActivaDTO } from '../../../domain/use-cases/ObtenerReservaActiva.js';
import { ModalidadReserva, EstadoReserva } from '../../../domain/entities/Reserva.js';
import { RolUsuario } from '../../../domain/entities/Usuario.js';
import { exigirRol, type PreHandler } from '../auth.js';

/** Puerto de entrada que consumen las rutas. */
export interface GestorDeReservas {
  crearReserva(
    usuarioId: string,
    sedeId: string,
    modalidad: ModalidadReserva,
  ): Promise<ReservaCreada>;
  listarMisReservas(usuarioId: string): Promise<ReservaUsuarioDTO[]>;
  obtenerReservaActiva(usuarioId: string): Promise<ReservaActivaDTO | null>;
}

interface OpcionesReservas {
  reservaService: GestorDeReservas;
  autenticar: PreHandler;
}

interface CuerpoCrearReserva {
  sedeId: string;
  modalidad: ModalidadReserva;
}

interface ReservaCreadaResponse {
  id: string;
  codigoQr: string;
  sedeId: string;
}

interface ReservaUsuarioResponse {
  id: string;
  codigoQr: string;
  sedeId: string;
  nombreSede: string;
  direccionSede: string;
  modalidad: 'GARANTIZADA' | 'EXPRES';
  estado: 'ACTIVA' | 'FINALIZADA' | 'CANCELADA' | 'EXPIRADA';
  fechaEntrada: string;
  fechaSalida: string | null;
}

interface ReservaActivaResponse {
  id: string;
  codigoQr: string;
  sedeId: string;
  nombreSede: string;
  direccionSede: string;
  modalidad: 'GARANTIZADA' | 'EXPRES';
  estado: 'ACTIVA';
  fechaEntrada: string;
}

const esquemaCuerpo = {
  type: 'object',
  additionalProperties: false,
  required: ['sedeId', 'modalidad'],
  properties: {
    sedeId: { type: 'string', minLength: 1, maxLength: 64 },
    modalidad: { type: 'string', enum: ['GARANTIZADA', 'EXPRES'] },
  },
} as const;

const esquemaReservaCreada = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'codigoQr', 'sedeId'],
  properties: {
    id: { type: 'string' },
    codigoQr: { type: 'string', minLength: 12, maxLength: 12 },
    sedeId: { type: 'string' },
  },
} as const;

const esquemaReservaUsuario = {
  type: 'array',
  items: {
    type: 'object',
    required: ['id', 'codigoQr', 'sedeId', 'nombreSede', 'direccionSede', 'modalidad', 'estado', 'fechaEntrada'],
    properties: {
      id: { type: 'string' },
      codigoQr: { type: 'string', minLength: 12, maxLength: 12 },
      sedeId: { type: 'string' },
      nombreSede: { type: 'string' },
      direccionSede: { type: 'string' },
      modalidad: { type: 'string', enum: ['GARANTIZADA', 'EXPRES'] },
      estado: { type: 'string', enum: ['ACTIVA', 'FINALIZADA', 'CANCELADA', 'EXPIRADA'] },
      fechaEntrada: { type: 'string', format: 'date-time' },
      fechaSalida: { type: ['string', 'null'], format: 'date-time' },
    },
  },
} as const;

const esquemaReservaActiva = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'codigoQr', 'sedeId', 'nombreSede', 'direccionSede', 'modalidad', 'estado', 'fechaEntrada'],
  properties: {
    id: { type: 'string' },
    codigoQr: { type: 'string', minLength: 12, maxLength: 12 },
    sedeId: { type: 'string' },
    nombreSede: { type: 'string' },
    direccionSede: { type: 'string' },
    modalidad: { type: 'string', enum: ['GARANTIZADA', 'EXPRES'] },
    estado: { type: 'string', enum: ['ACTIVA'] },
    fechaEntrada: { type: 'string', format: 'date-time' },
  },
} as const;

const esquemaReservaActivaNullable = {
  anyOf: [
    { type: 'object', additionalProperties: false, required: ['id', 'codigoQr', 'sedeId', 'nombreSede', 'direccionSede', 'modalidad', 'estado', 'fechaEntrada'], properties: { id: { type: 'string' }, codigoQr: { type: 'string', minLength: 12, maxLength: 12 }, sedeId: { type: 'string' }, nombreSede: { type: 'string' }, direccionSede: { type: 'string' }, modalidad: { type: 'string', enum: ['GARANTIZADA', 'EXPRES'] }, estado: { type: 'string', enum: ['ACTIVA'] }, fechaEntrada: { type: 'string', format: 'date-time' } } },
    { type: 'null' },
  ],
} as const;

const esquemaError = {
  type: 'object',
  additionalProperties: false,
  required: ['error'],
  properties: { error: { type: 'string' } },
} as const;

/**
 * `POST /api/reservas` (RF-09, HU-C01).
 *
 * - Requiere autenticación (cualquier rol).
 * - Body: `{ sedeId, modalidad: "GARANTIZADA" | "EXPRES" }`
 * - 201 `{ id, codigoQr, sedeId }` — reserva creada.
 * - 400 — cuerpo fuera de esquema o regla de negocio (ej. reserva activa existente).
 * - 401 — falta token, inválido o expirado.
 * - 404 — la sede no existe.
 * - 409 — conflicto de código QR (extremadamente raro, reintentar).
 * - 500 — error interno.
 *
 * `GET /api/reservas/mis-reservas` (RF-21, HU-27).
 *
 * - Requiere autenticación (cualquier rol).
 * - 200 `[{ id, codigoQr, sedeId, nombreSede, direccionSede, modalidad, estado, fechaEntrada, fechaSalida }]` — lista descendente por fecha.
 * - 401 — falta token, inválido o expirado.
 * - 500 — error interno.
 *
 * `GET /api/reservas/activa` (RF-09, HU-27).
 *
 * - Requiere autenticación (cualquier rol).
 * - 200 `{ id, codigoQr, sedeId, nombreSede, direccionSede, modalidad, estado, fechaEntrada }` — reserva activa, o `null` si no hay.
 * - 401 — falta token, inválido o expirado.
 * - 500 — error interno.
 */
export const rutasReservas: FastifyPluginAsync<OpcionesReservas> = async (
  app,
  opciones,
) => {
  app.post<{ Body: CuerpoCrearReserva }>(
    '/api/reservas',
    {
      preHandler: [opciones.autenticar], // Cualquier usuario autenticado
      schema: {
        body: esquemaCuerpo,
        response: {
          201: esquemaReservaCreada,
          400: esquemaError,
          401: esquemaError,
          404: esquemaError,
          409: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { sedeId, modalidad } = request.body;
      const usuarioId = request.usuarioAutenticado!.sub;

      const reserva = await opciones.reservaService.crearReserva(
        usuarioId,
        sedeId,
        modalidad,
      );

      return reply.code(201).send(reserva);
    },
  );

  app.get(
    '/api/reservas/mis-reservas',
    {
      preHandler: [opciones.autenticar],
      schema: {
        response: {
          200: esquemaReservaUsuario,
          401: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const usuarioId = request.usuarioAutenticado!.sub;

      const reservas = await opciones.reservaService.listarMisReservas(usuarioId);

      return reply.code(200).send(
        reservas.map((r) => ({
          ...r,
          fechaEntrada: r.fechaEntrada.toISOString(),
          fechaSalida: r.fechaSalida?.toISOString() ?? null,
        })),
      );
    },
  );

  app.get(
    '/api/reservas/activa',
    {
      preHandler: [opciones.autenticar],
      schema: {
        response: {
          200: esquemaReservaActivaNullable,
          401: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const usuarioId = request.usuarioAutenticado!.sub;

      const reserva = await opciones.reservaService.obtenerReservaActiva(usuarioId);

      if (!reserva) {
        return reply.code(200).send(null);
      }

      return reply.code(200).send({
        ...reserva,
        fechaEntrada: reserva.fechaEntrada.toISOString(),
      });
    },
  );
};