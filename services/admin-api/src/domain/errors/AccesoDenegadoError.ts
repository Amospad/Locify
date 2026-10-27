/**
 * El usuario está autenticado, pero su rol no permite la operación.
 *
 * Se distingue de `TokenInvalidoError` (401) para que el cliente sepa que sus
 * credenciales son válidas y lo que le falta es autorización. HTTP: 403.
 */
export class AccesoDenegadoError extends Error {
  constructor(mensaje = 'No tienes permisos para realizar esta acción.') {
    super(mensaje);
    this.name = 'AccesoDenegadoError';
  }
}
