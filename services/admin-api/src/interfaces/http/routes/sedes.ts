import type { FastifyPluginAsync } from 'fastify';
import { Sede } from '../../../domain/entities/Sede.js';
import type { SedeRepository } from '../../../domain/ports/SedeRepository.js';

export interface OpcionesSedes {
  sedeRepository: SedeRepository;
}

interface SedeResponse {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
}

const esquemaSede = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'nombre', 'direccion', 'latitud', 'longitud', 'capacidadTotal', 'precioHora'],
  properties: {
    id: { type: 'string' },
    nombre: { type: 'string' },
    direccion: { type: 'string' },
    latitud: { type: 'number' },
    longitud: { type: 'number' },
    capacidadTotal: { type: 'integer', minimum: 1 },
    precioHora: { type: 'integer', minimum: 0 },
  },
} as const;

const esquemaListaSedes = {
  type: 'array',
  items: esquemaSede,
} as const;

const esquemaError = {
  type: 'object',
  additionalProperties: false,
  required: ['error'],
  properties: { error: { type: 'string' } },
} as const;

/**
 * `GET /api/sedes` (RF-11).
 *
 * - Pública: no requiere autenticación.
 * - Query params opcionales: `lat`, `lng`, `radio` (para filtrado geoespacial futuro).
 * - 200 `[{ id, nombre, direccion, latitud, longitud, capacidadTotal, precioHora }, ...]`
 * - 500 — error interno.
 */
export const rutasSedes: FastifyPluginAsync<OpcionesSedes> = async (app, opciones) => {
  app.get(
    '/api/sedes',
    {
      schema: {
        querystring: {
          type: 'object',
          additionalProperties: false,
          properties: {
            lat: { type: 'string', pattern: '^-?\\d+(\\.\\d+)?$' },
            lng: { type: 'string', pattern: '^-?\\d+(\\.\\d+)?$' },
            radio: { type: 'string', pattern: '^\\d+(\\.\\d+)?$' },
          },
        },
        response: {
          200: esquemaListaSedes,
          500: esquemaError,
        },
      },
    },
    async (_request, reply) => {
      const sedes = await opciones.sedeRepository.buscarTodas();

      const respuesta: SedeResponse[] = sedes.map((sede: Sede) => ({
        id: sede.id,
        nombre: sede.nombre,
        direccion: sede.direccion,
        latitud: sede.latitud,
        longitud: sede.longitud,
        capacidadTotal: sede.capacidadTotal,
        precioHora: sede.precioHora,
      }));

      return reply.code(200).send(respuesta);
    },
  );
};