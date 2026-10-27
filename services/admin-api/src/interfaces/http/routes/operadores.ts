import type { FastifyPluginAsync } from 'fastify';
import type { OperadorRegistrado } from '../../../domain/use-cases/RegistrarOperador.js';
import { mapearError } from '../errores.js';

/**
 * Puerto de entrada que consume la ruta. `AdminService` lo cumple por
 * estructura, y las pruebas pueden sustituirlo sin instanciar el servicio.
 */
export interface RegistradorDeOperadores {
  registrarOperador(email: string, password: string): Promise<OperadorRegistrado>;
}

interface OpcionesOperadores {
  adminService: RegistradorDeOperadores;
}

interface CuerpoRegistro {
  email: string;
  password: string;
}

/**
 * El esquema valida forma y tamaño, no reglas de negocio: la complejidad de la
 * contraseña la decide `PoliticaPassword` para que exista un único mensaje de
 * error y una única fuente de verdad.
 */
const esquemaCuerpo = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', minLength: 3, maxLength: 254 },
    // 128 es también el máximo de la política: acota lo que llega a Argon2.
    password: { type: 'string', minLength: 1, maxLength: 128 },
  },
} as const;

const esquemaOperador = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'email'],
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
  },
} as const;

const esquemaError = {
  type: 'object',
  additionalProperties: false,
  required: ['error'],
  properties: {
    error: { type: 'string' },
  },
} as const;

/**
 * `POST /api/operadores`: registra un operador PENDIENTE y envía la invitación.
 *
 * - 201 `{ id, email }` — creado; nunca devuelve hash, token ni contraseña.
 * - 400 — email inválido, contraseña débil o cuerpo fuera de esquema.
 * - 409 — email ya registrado.
 * - 502 — operador creado, correo de invitación no enviado.
 */
export const rutasOperadores: FastifyPluginAsync<OpcionesOperadores> = async (
  app,
  opciones,
) => {
  app.post<{ Body: CuerpoRegistro }>(
    '/api/operadores',
    {
      config: {
        // Registro de operadores: mucho más restrictivo que el límite global.
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
      schema: {
        body: esquemaCuerpo,
        response: {
          201: esquemaOperador,
          400: esquemaError,
          409: esquemaError,
          502: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        const operador = await opciones.adminService.registrarOperador(email, password);
        return reply.code(201).send(operador);
      } catch (error) {
        const mapeado = mapearError(error);
        if (mapeado) {
          return reply.code(mapeado.statusCode).send(mapeado.body);
        }

        // Desconocido: lo resuelve el manejador global (500 sin filtrar detalles).
        throw error;
      }
    },
  );
};
