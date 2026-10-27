import type { RolUsuario } from '../entities/Usuario.js';

/**
 * Datos que viajan dentro del token de acceso.
 *
 * `sub` es el id del usuario (claim estándar). No incluye email como
 * credencial ni datos sensibles: el token es legible por cualquiera que lo
 * posea, sólo la firma impide modificarlo.
 */
export interface ContenidoToken {
  sub: string;
  email: string;
  rol: RolUsuario;
}

/**
 * Puerto de emisión y verificación de tokens de acceso.
 *
 * El dominio firma; la capa HTTP verifica en el `preHandler`. El adaptador
 * concreto (JWT firmado con HS256) vive en infraestructura, así que el dominio
 * no depende de `jose` ni de ninguna librería de criptografía.
 */
export interface ServicioDeTokens {
  /** Firma un token de acceso con vigencia limitada. */
  firmar(contenido: ContenidoToken): Promise<string>;

  /** Verifica firma, vigencia y claims. Lanza `TokenInvalidoError` si falla. */
  verificar(token: string): Promise<ContenidoToken>;
}
