/**
 * El token de acceso falta, está mal firmado, expiró o no tiene el formato
 * esperado. La capa HTTP responde 401.
 */
export class TokenInvalidoError extends Error {
  constructor(mensaje = 'Token de acceso ausente, inválido o expirado.') {
    super(mensaje);
    this.name = 'TokenInvalidoError';
  }
}
