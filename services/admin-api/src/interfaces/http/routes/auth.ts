import type { FastifyPluginAsync } from 'fastify';
import { RolUsuario } from '../../../domain/entities/Usuario.js';
import type { SesionIniciada } from '../../../domain/use-cases/LoginUsuario.js';
import type { UsuarioRegistrado } from '../../../domain/use-cases/RegistrarUsuario.js';
import type { OtpVerificado } from '../../../domain/use-cases/VerificarOtp.js';
import { ErrorEnvioDeOtp } from '../../../domain/use-cases/RegistrarUsuario.js';
import { ErrorDeValidacion } from '../../../domain/errors/ErrorDeValidacion.js';
import { ErrorDeConflicto } from '../../../domain/errors/ErrorDeConflicto.js';
import { CredencialesInvalidasError } from '../../../domain/errors/CredencialesInvalidasError.js';
import { UsuarioNoActivoError } from '../../../domain/errors/UsuarioNoActivoError.js';

/**
 * Puerto de entrada que consume la ruta de login. `AuthService` lo cumple por
 * estructura y las pruebas pueden sustituirlo.
 */
export interface IniciadorDeSesion {
  iniciarSesion(email: string, password: string): Promise<SesionIniciada>;
}

/**
 * Puerto de entrada para registro de usuario.
 */
export interface RegistradorDeUsuario {
  registrarUsuario(dto: {
    email: string;
    password: string;
    nombre: string;
    celular: string;
  }): Promise<UsuarioRegistrado>;
  verificarOtp(email: string, codigo: string): Promise<OtpVerificado>;
}

interface OpcionesAuth {
  authService: IniciadorDeSesion & RegistradorDeUsuario;
}

interface CuerpoLogin {
  email: string;
  password: string;
}

interface CuerpoRegistro {
  email: string;
  password: string;
  nombre: string;
  celular: string;
}

interface CuerpoVerificarOtp {
  email: string;
  codigo: string;
}

/**
 * El esquema sólo valida forma y tamaño. La política de contraseñas no se
 * aplica al login: un usuario con una contraseña antigua debe poder entrar, y
 * repetir la política aquí permitiría deducirla desde fuera.
 */
const esquemaCuerpoLogin = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', minLength: 3, maxLength: 254 },
    password: { type: 'string', minLength: 1, maxLength: 128 },
  },
} as const;

const esquemaCuerpoRegistro = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password', 'nombre', 'celular'],
  properties: {
    email: { type: 'string', minLength: 3, maxLength: 254 },
    password: { type: 'string', minLength: 12, maxLength: 128 },
    nombre: { type: 'string', minLength: 2, maxLength: 100 },
    celular: { type: 'string', minLength: 10, maxLength: 15 },
  },
} as const;

const esquemaCuerpoVerificarOtp = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'codigo'],
  properties: {
    email: { type: 'string', minLength: 3, maxLength: 254 },
    codigo: { type: 'string', minLength: 6, maxLength: 6, pattern: '^[0-9]{6}$' },
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

const esquemaRegistroExitoso = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'email'],
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
  },
} as const;

const esquemaOtpVerificado = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'email', 'rol'],
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    rol: { type: 'string', enum: Object.values(RolUsuario) },
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
 * Rutas de autenticación:
 * - `POST /api/auth/login` (RF-07) — Inicio de sesión con email y contraseña
 * - `POST /api/auth/register` — Registro de Conductor con envío de OTP
 * - `POST /api/auth/verify-otp` — Verificación de OTP y activación de cuenta
 *
 * - 200 `{ token, user: { id, email, rol } }` — credenciales válidas (login).
 * - 201 `{ id, email }` — registro exitoso, OTP enviado.
 * - 200 `{ id, email, rol }` — OTP verificado, cuenta activada.
 * - 400 — cuerpo fuera de esquema.
 * - 401 — email inexistente o contraseña incorrecta (mismo cuerpo en ambos
 *   casos, para no revelar qué cuentas existen).
 * - 403 — credenciales válidas, pero la cuenta está PENDIENTE o SUSPENDIDA.
 * - 409 — email ya registrado (register).
 * - 422 — OTP inválido o expirado (verify-otp).
 * - 429 — más de 5 intentos por minuto (defensa contra fuerza bruta).
 * - 500 — error interno.
 */
export const rutasAuth: FastifyPluginAsync<OpcionesAuth> = async (app, opciones) => {
  // POST /api/auth/login
  app.post<{ Body: CuerpoLogin }>(
    '/api/auth/login',
    {
      config: {
        rateLimit: { max: 5, timeWindow: '1 minute' },
      },
      schema: {
        body: esquemaCuerpoLogin,
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

  // POST /api/auth/register
  app.post<{ Body: CuerpoRegistro }>(
    '/api/auth/register',
    {
      config: {
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
      schema: {
        body: esquemaCuerpoRegistro,
        response: {
          201: esquemaRegistroExitoso,
          400: esquemaError,
          409: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { email, password, nombre, celular } = request.body;

      try {
        const resultado = await opciones.authService.registrarUsuario({
          email,
          password,
          nombre,
          celular,
        });

        return reply.code(201).send(resultado);
      } catch (error) {
        if (error instanceof ErrorDeConflicto) {
          return reply.code(409).send({ error: error.message });
        }
        if (error instanceof ErrorEnvioDeOtp) {
          // Usuario creado pero error enviando OTP - loggear y devolver 500
          app.log.error({ error, contexto: error.contexto }, 'Error enviando OTP tras registro');
          return reply.code(500).send({ error: 'Usuario registrado pero no se pudo enviar el código de verificación. Contacte soporte.' });
        }
        if (error instanceof ErrorDeValidacion) {
          return reply.code(400).send({ error: error.message });
        }
        throw error;
      }
    },
  );

  // POST /api/auth/verify-otp
  app.post<{ Body: CuerpoVerificarOtp }>(
    '/api/auth/verify-otp',
    {
      config: {
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
      schema: {
        body: esquemaCuerpoVerificarOtp,
        response: {
          200: esquemaOtpVerificado,
          400: esquemaError,
          422: esquemaError,
          500: esquemaError,
        },
      },
    },
    async (request, reply) => {
      const { email, codigo } = request.body;

      try {
        const resultado = await opciones.authService.verificarOtp(email, codigo);

        return reply.code(200).send(resultado);
      } catch (error) {
        if (error instanceof ErrorDeValidacion) {
          return reply.code(422).send({ error: error.message });
        }
        throw error;
      }
    },
  );
};