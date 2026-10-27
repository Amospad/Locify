import type { FastifyReply, FastifyRequest } from 'fastify';
import { AccesoDenegadoError } from '../../domain/errors/AccesoDenegadoError.js';
import { TokenInvalidoError } from '../../domain/errors/TokenInvalidoError.js';
import type { RolUsuario } from '../../domain/entities/Usuario.js';
import type { ContenidoToken, ServicioDeTokens } from '../../domain/ports/ServicioDeTokens.js';

declare module 'fastify' {
  interface FastifyRequest {
    /** Lo rellena `crearAutenticacion`; sólo existe tras un preHandler válido. */
    usuarioAutenticado?: ContenidoToken;
  }
}

export type PreHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

const PREFIJO_BEARER = 'Bearer ';

function extraerToken(cabecera: string | undefined): string {
  if (!cabecera?.startsWith(PREFIJO_BEARER)) {
    throw new TokenInvalidoError(
      'Falta el encabezado Authorization con el formato "Bearer <token>".',
    );
  }

  const token = cabecera.slice(PREFIJO_BEARER.length).trim();

  if (token.length === 0) {
    throw new TokenInvalidoError();
  }

  return token;
}

/**
 * Crea el preHandler que autentica una petición con `Authorization: Bearer`.
 *
 * Verifica firma, vigencia, emisor y audiencia del token, y deja el contenido
 * en `request.usuarioAutenticado`. No consulta la base: el token es
 * autosuficiente y de vida corta (1 h por defecto). Cualquier fallo lanza
 * `TokenInvalidoError` → 401, sin distinguir el motivo.
 */
export function crearAutenticacion(servicioTokens: ServicioDeTokens): PreHandler {
  return async function autenticar(request: FastifyRequest): Promise<void> {
    const token = extraerToken(request.headers.authorization);
    request.usuarioAutenticado = await servicioTokens.verificar(token);
  };
}

/**
 * Exige que el usuario autenticado tenga uno de los roles indicados.
 *
 * Debe ejecutarse **después** de `crearAutenticacion`. Un rol insuficiente es
 * 403 (`AccesoDenegadoError`), no 401: las credenciales son válidas, falta
 * autorización.
 */
export function exigirRol(...roles: RolUsuario[]): PreHandler {
  return async function autorizar(request: FastifyRequest): Promise<void> {
    const usuario = request.usuarioAutenticado;

    if (!usuario) {
      // Programación defensiva: se olvidó encadenar la autenticación.
      throw new TokenInvalidoError();
    }

    if (!roles.includes(usuario.rol)) {
      throw new AccesoDenegadoError();
    }
  };
}
