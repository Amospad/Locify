/**
 * La contraseña es correcta, pero la cuenta aún no puede iniciar sesión
 * (PENDIENTE de activación o SUSPENDIDA).
 *
 * Sólo se lanza después de verificar la contraseña: quien no conoce las
 * credenciales recibe `CredencialesInvalidasError` y no aprende nada sobre el
 * estado de la cuenta. La capa HTTP responde 403.
 */
export class UsuarioNoActivoError extends Error {
  constructor(
    mensaje = 'La cuenta no está activa. Actívala desde la invitación o contacta a un administrador.',
  ) {
    super(mensaje);
    this.name = 'UsuarioNoActivoError';
  }
}
