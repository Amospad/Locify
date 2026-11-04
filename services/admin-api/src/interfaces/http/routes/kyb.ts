import type { FastifyPluginAsync } from 'fastify';
import { exigirRol, type PreHandler } from '../auth.js';
import { RolUsuario } from '../../../domain/entities/Usuario.js';

export interface GestorKYB {
  subirDocumentosKYB(cmd: {
    sedeId: string;
    operadorId: string;
    urlRut: string;
    urlCamaraComercio: string;
  }): Promise<{ ticketId: string; sedeId: string; estado: string }>;
  listarTicketsPendientes(): Promise<any[]>;
  cambiarEstadoTicket(cmd: {
    ticketId: string;
    estadoNuevo: 'APROBADO' | 'RECHAZADO';
    motivo?: string;
  }): Promise<{ ticketId: string; estado: string; sedeId: string }>;
  consultarEstadoKYB(operadorId: string): Promise<any>;
}

interface OpcionesKYB {
  sedeService: GestorKYB;
  autenticar: PreHandler;
}

interface CuerpoSubirDocumentos {
  sedeId: string;
  urlRut: string;
  urlCamaraComercio: string;
}

interface CuerpoCambiarEstado {
  estado: 'APROBADO' | 'RECHAZADO';
  motivo?: string;
}

const esquemaCuerpoSubir = {
  type: 'object',
  additionalProperties: false,
  required: ['sedeId', 'urlRut', 'urlCamaraComercio'],
  properties: {
    sedeId: { type: 'string', minLength: 1 },
    urlRut: { type: 'string', minLength: 10, format: 'uri' },
    urlCamaraComercio: { type: 'string', minLength: 10, format: 'uri' },
  },
} as const;

const esquemaCuerpoCambiarEstado = {
  type: 'object',
  additionalProperties: false,
  required: ['estado'],
  properties: {
    estado: { type: 'string', enum: ['APROBADO', 'RECHAZADO'] },
    motivo: { type: 'string', maxLength: 500 },
  },
} as const;

const esquemaError = {
  type: 'object',
  additionalProperties: false,
  required: ['error'],
  properties: { error: { type: 'string' } },
} as const;

export const rutasKYB: FastifyPluginAsync<OpcionesKYB> = async (app, opciones) => {
  // OPERADOR sube documentos KYB
  app.post<{ Body: CuerpoSubirDocumentos }>(
    '/api/kyb/subir-documentos',
    {
      preHandler: [opciones.autenticar],
      schema: {
        body: esquemaCuerpoSubir,
        response: {
          201: {
            type: 'object',
            required: ['ticketId', 'sedeId', 'estado'],
            properties: {
              ticketId: { type: 'string' },
              sedeId: { type: 'string' },
              estado: { type: 'string' },
            },
          },
          400: esquemaError,
          401: esquemaError,
          404: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { sedeId, urlRut, urlCamaraComercio } = request.body;
      const operadorId = request.usuarioAutenticado!.sub;

      const resultado = await opciones.sedeService.subirDocumentosKYB({
        sedeId,
        operadorId,
        urlRut,
        urlCamaraComercio,
      });

      return reply.code(201).send(resultado);
    },
  );

  // OPERADOR consulta el estado KYB de su sede
  app.get<{ Params: { operatorId: string } }>(
    '/api/kyb/status/:operatorId',
    {
      preHandler: [opciones.autenticar],
      schema: {
        params: {
          type: 'object',
          required: ['operatorId'],
          properties: {
            operatorId: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            required: ['tieneTicket', 'estadoKYB', 'estadoSede'],
            properties: {
              tieneTicket: { type: 'boolean' },
              estadoKYB: { type: ['string', 'null'], enum: ['EN_REVISION', 'APROBADO', 'RECHAZADO', null] },
              estadoSede: { type: 'string', enum: ['ACTIVA', 'PENDIENTE_KYB', 'RECHAZADA'] },
              sedeId: { type: ['string', 'null'] },
              sedeNombre: { type: ['string', 'null'] },
              urlRut: { type: ['string', 'null'] },
              urlCamaraComercio: { type: ['string', 'null'] },
              motivoRechazo: { type: ['string', 'null'] },
              fechaCreacion: { type: ['string', 'null'], format: 'date-time' },
              fechaActualizacion: { type: ['string', 'null'], format: 'date-time' },
            },
          },
          401: esquemaError,
          403: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { operatorId } = request.params;
      const autenticadoId = request.usuarioAutenticado!.sub;

      // Solo puede consultar su propio estado, o un ADMIN puede consultar cualquiera
      const esAdmin = request.usuarioAutenticado!.rol === RolUsuario.ADMIN;
      if (!esAdmin && operatorId !== autenticadoId) {
        return reply.code(403).send({ error: 'No tiene permiso para consultar este estado' });
      }

      const estado = await opciones.sedeService.consultarEstadoKYB(operatorId);

      return reply.code(200).send({
        ...estado,
        fechaCreacion: estado.fechaCreacion?.toISOString() ?? null,
        fechaActualizacion: estado.fechaActualizacion?.toISOString() ?? null,
      });
    },
  );

  // ADMIN lista tickets pendientes
  app.get(
    '/api/admin/kyb/pendientes',
    {
      preHandler: [opciones.autenticar, exigirRol(RolUsuario.ADMIN)],
      schema: {
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'sedeId', 'nombreSede', 'direccionSede', 'operadorId', 'urlRut', 'urlCamaraComercio', 'fechaCreacion'],
              properties: {
                id: { type: 'string' },
                sedeId: { type: 'string' },
                nombreSede: { type: 'string' },
                direccionSede: { type: 'string' },
                operadorId: { type: 'string' },
                urlRut: { type: 'string' },
                urlCamaraComercio: { type: 'string' },
                fechaCreacion: { type: 'string', format: 'date-time' },
              },
            },
          },
          401: esquemaError,
          403: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const tickets = await opciones.sedeService.listarTicketsPendientes();

      return reply.code(200).send(
        tickets.map((t) => ({
          ...t,
          fechaCreacion: t.fechaCreacion.toISOString(),
        })),
      );
    },
  );

  // ADMIN cambia estado del ticket
  app.patch<{ Params: { id: string }, Body: CuerpoCambiarEstado }>(
    '/api/admin/kyb/:id/estado',
    {
      preHandler: [opciones.autenticar, exigirRol(RolUsuario.ADMIN)],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: esquemaCuerpoCambiarEstado,
        response: {
          200: {
            type: 'object',
            required: ['ticketId', 'estado', 'sedeId'],
            properties: {
              ticketId: { type: 'string' },
              estado: { type: 'string' },
              sedeId: { type: 'string' },
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
      const { id } = request.params;
      const { estado, motivo } = request.body;

      if (estado === 'RECHAZADO' && !motivo) {
        return reply.code(400).send({ error: 'Debe proporcionar un motivo para rechazar' });
      }

      const resultado = await opciones.sedeService.cambiarEstadoTicket({
        ticketId: id,
        estadoNuevo: estado,
        motivo,
      });

      return reply.code(200).send(resultado);
    },
  );
};