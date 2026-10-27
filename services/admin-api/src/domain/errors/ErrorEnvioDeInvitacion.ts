/**
 * El operador ya quedó persistido, pero el correo de invitación no se pudo
 * enviar.
 *
 * Se distingue del resto de fallos porque el estado del sistema **sí** cambió:
 * la capa HTTP responde 502 ("usuario creado, invitación no enviada") en lugar
 * de 500, para que el llamador reintente la invitación y no el registro (que
 * ahora respondería 409).
 */
export class ErrorEnvioDeInvitacion extends Error {
  constructor(causa?: unknown) {
    super(
      'El operador se creó, pero no se pudo enviar el correo de invitación.',
      { cause: causa },
    );
    this.name = 'ErrorEnvioDeInvitacion';
  }
}
