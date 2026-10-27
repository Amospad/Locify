/**
 * Las credenciales no permiten autenticar al usuario.
 *
 * Es deliberadamente genérico: se lanza tanto si el email no existe como si la
 * contraseña es incorrecta, para no revelar qué cuentas están registradas. La
 * capa HTTP responde 401.
 */
export class CredencialesInvalidasError extends Error {
  constructor(mensaje = 'Email o contraseña incorrectos.') {
    super(mensaje);
    this.name = 'CredencialesInvalidasError';
  }
}
