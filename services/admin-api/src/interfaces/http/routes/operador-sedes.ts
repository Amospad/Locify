import type { FastifyPluginAsync } from 'fastify';
import { exigirRol, type PreHandler } from '../auth.js';
import { RolUsuario } from '../../../domain/entities/Usuario.js';
import type { SedeRepository } from '../../../domain/ports/SedeRepository.js';
import type { GeneradorId } from '../../../domain/ports/GeneradorId.js';
import { CrearSedeUseCase } from '../../../domain/use-cases/CrearSede.js';
import { ListarSedesOperadorUseCase } from '../../../domain/use-cases/ListarSedesOperador.js';
import { ObtenerSedeUseCase } from '../../../domain/use-cases/ObtenerSede.js';
import { ActualizarSedeUseCase } from '../../../domain/use-cases/ActualizarSede.js';
import { EliminarSedeUseCase } from '../../../domain/use-cases/EliminarSede.js';

interface OpcionesOperadorSedes {
  sedeRepository: SedeRepository;
  generadorId: GeneradorId;
  autenticar: PreHandler;
}

const esquemaError = {
  type: 'object',
  additionalProperties: false,
  required: ['error'],
  properties: {
    error: { type: 'string' },
  },
} as const;

const esquemaParametrosId = {
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

const esquemaCrearSede = {
  type: 'object',
  additionalProperties: false,
  required: ['nombre', 'direccion', 'latitud', 'longitud', 'capacidadTotal', 'precioHora'],
  properties: {
    nombre: { type: 'string', minLength: 1 },
    direccion: { type: 'string', minLength: 1 },
    latitud: { type: 'number' },
    longitud: { type: 'number' },
    capacidadTotal: { type: 'integer', minimum: 1 },
    precioHora: { type: 'integer', minimum: 0 },
  },
} as const;

const esquemaActualizarSede = {
  type: 'object',
  additionalProperties: false,
  properties: {
    nombre: { type: 'string', minLength: 1 },
    direccion: { type: 'string', minLength: 1 },
    latitud: { type: 'number' },
    longitud: { type: 'number' },
    capacidadTotal: { type: 'integer', minimum: 1 },
    precioHora: { type: 'integer', minimum: 0 },
  },
} as const;

const esquemaSedeBase = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'nombre', 'direccion', 'latitud', 'longitud', 'capacidadTotal', 'precioHora', 'estado'],
  properties: {
    id: { type: 'string' },
    nombre: { type: 'string' },
    direccion: { type: 'string' },
    latitud: { type: 'number' },
    longitud: { type: 'number' },
    capacidadTotal: { type: 'integer', minimum: 1 },
    precioHora: { type: 'integer', minimum: 0 },
    estado: { type: 'string' },
  },
} as const;

const esquemaSedeDetalle = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'nombre', 'direccion', 'latitud', 'longitud', 'capacidadTotal', 'precioHora', 'estado', 'operadorId'],
  properties: {
    id: { type: 'string' },
    nombre: { type: 'string' },
    direccion: { type: 'string' },
    latitud: { type: 'number' },
    longitud: { type: 'number' },
    capacidadTotal: { type: 'integer', minimum: 1 },
    precioHora: { type: 'integer', minimum: 0 },
    estado: { type: 'string' },
    operadorId: { type: 'string' },
  },
} as const;

const esquemaSedeCreada = {
  type: 'object',
  additionalProperties: false,
  required: ['sedeId', 'nombre'],
  properties: {
    sedeId: { type: 'string' },
    nombre: { type: 'string' },
  },
} as const;

const esquemaSedeEliminada = {
  type: 'object',
  additionalProperties: false,
  required: ['sedeId'],
  properties: {
    sedeId: { type: 'string' },
  },
} as const;

export const rutasOperadorSedes: FastifyPluginAsync<OpcionesOperadorSedes> = async (app, opciones) => {
  const crearSede = new CrearSedeUseCase(opciones.sedeRepository, opciones.generadorId);
  const listarSedes = new ListarSedesOperadorUseCase(opciones.sedeRepository);
  const obtenerSede = new ObtenerSedeUseCase(opciones.sedeRepository);
  const actualizarSede = new ActualizarSedeUseCase(opciones.sedeRepository);
  const eliminarSede = new EliminarSedeUseCase(opciones.sedeRepository);

  const preHandlerOperador = [opciones.autenticar, exigirRol(RolUsuario.OPERADOR)];

  app.post(
    '/api/operador/sedes',
    {
      preHandler: preHandlerOperador,
      schema: {
        body: esquemaCrearSede,
        response: {
          201: esquemaSedeCreada,
          400: esquemaError,
          401: esquemaError,
          403: esquemaError,
          409: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const operadorId = request.usuarioAutenticado!.sub;
      const { nombre, direccion, latitud, longitud, capacidadTotal, precioHora } = request.body as any;

      const resultado = await crearSede.ejecutar({
        nombre,
        direccion,
        latitud,
        longitud,
        capacidadTotal,
        precioHora,
        operadorId,
      });

      return reply.code(201).send(resultado);
    },
  );

  app.get(
    '/api/operador/sedes',
    {
      preHandler: preHandlerOperador,
      schema: {
        response: {
          200: {
            type: 'array',
            items: esquemaSedeBase,
          },
          401: esquemaError,
          403: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const operadorId = request.usuarioAutenticado!.sub;

      const sedes = await listarSedes.ejecutar({ operadorId });

      return reply.code(200).send(sedes);
    },
  );

  app.get(
    '/api/operador/sedes/:id',
    {
      preHandler: preHandlerOperador,
      schema: {
        params: esquemaParametrosId,
        response: {
          200: esquemaSedeDetalle,
          401: esquemaError,
          403: esquemaError,
          404: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const operadorId = request.usuarioAutenticado!.sub;
      const { id } = request.params as { id: string };

      const sede = await obtenerSede.ejecutar({ sedeId: id, operadorId });

      return reply.code(200).send(sede);
    },
  );

  app.put(
    '/api/operador/sedes/:id',
    {
      preHandler: preHandlerOperador,
      schema: {
        params: esquemaParametrosId,
        body: esquemaActualizarSede,
        response: {
          200: esquemaSedeCreada,
          400: esquemaError,
          401: esquemaError,
          403: esquemaError,
          404: esquemaError,
          409: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const operadorId = request.usuarioAutenticado!.sub;
      const { id } = request.params as { id: string };
      const { nombre, direccion, latitud, longitud, capacidadTotal, precioHora } = request.body as any;

      const resultado = await actualizarSede.ejecutar({
        sedeId: id,
        operadorId,
        nombre,
        direccion,
        latitud,
        longitud,
        capacidadTotal,
        precioHora,
      });

      return reply.code(200).send(resultado);
    },
  );

  app.delete(
    '/api/operador/sedes/:id',
    {
      preHandler: preHandlerOperador,
      schema: {
        params: esquemaParametrosId,
        response: {
          200: esquemaSedeEliminada,
          401: esquemaError,
          403: esquemaError,
          404: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const operadorId = request.usuarioAutenticado!.sub;
      const { id } = request.params as { id: string };

      const resultado = await eliminarSede.ejecutar({ sedeId: id, operadorId });

      return reply.code(200).send(resultado);
    },
  );
};
