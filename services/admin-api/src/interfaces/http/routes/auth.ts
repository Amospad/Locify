import type { FastifyPluginAsync } from 'fastify';
import { RolUsuario } from '../../../domain/entities/Usuario.js';
import type { SesionIniciada } from '../../../domain/use-cases/LoginUsuario.js';

/**
 * Puerto de entrada que consume la ruta de login. `AuthService` lo cumple por
 * estructura y las pruebas pueden sustituirlo.
 */
export interface IniciadorDeSesion {
  iniciarSesion(email: string, password: string): Promise<SesionIniciada>;
}

interface OpcionesAuth {
  authService: IniciadorDeSesion;
}

interface CuerpoLogin {
  email: string;
  password: string;
}

/**
 * El esquema sólo valida forma y tamaño. La política de contraseñas no se
 * aplica al login: un usuario con una contraseña antigua debe poder entrar, y
 * repetir la política aquí permitiría deducirla desde fuera.
 */
const esquemaCuerpo = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', minLength: 3, maxLength: 254 },
    password: { type: 'string', minLength: 1, maxLength: 128 },
  },
} as const;

const esquemaSesion = {
  type: 'object',
  additionalProperties: false,
  required: ['token', 'user'],
  properties: {
    token: { type: 'string' },
    user: {
      type: 'object',
      additionalProperties: false,
      required: ['id', 'email', 'rol'],
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        rol: { type: 'string', enum: Object.values(RolUsuario) },
      },
    },
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
 * `POST /api/auth/login` (RF-07).
 *
 * - 200 `{ token, user: { id, email, rol } }` — credenciales válidas.
 * - 400 — cuerpo fuera de esquema.
 * - 401 — email inexistente o contraseña incorrecta (mismo cuerpo en ambos
 *   casos, para no revelar qué cuentas existen).
 * - 403 — credenciales válidas, pero la cuenta está PENDIENTE o SUSPENDIDA.
 * - 429 — más de 5 intentos por minuto (defensa contra fuerza bruta).
 */
export const rutasAuth: FastifyPluginAsync<OpcionesAuth> = async (app, opciones) => {
  app.post<{ Body: CuerpoLogin }>(
    '/api/auth/login',
    {
      config: {
        // Más estricto que el límite global: el login es el objetivo natural
        // de un ataque de fuerza bruta.
        rateLimit: { max: 5, timeWindow: '1 minute' },
      },
      schema: {
        body: esquemaCuerpo,
        response: {
          200: esquemaSesion,
          400: esquemaError,
          401: esquemaError,
          403: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const sesion = await opciones.authService.iniciarSesion(email, password);

      return reply.code(200).send({
        token: sesion.token,
        user: {
          id: sesion.usuario.id,
          email: sesion.usuario.email,
          rol: sesion.usuario.rol,
        },
      });
    },
  );
};
