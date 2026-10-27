export interface EmailService {
  enviarInvitacion(emailDestino: string, token: string): Promise<void>;

  /**
   * Libera el transporte si el adaptador mantiene conexiones abiertas
   * (SMTP). Es opcional: un adaptador sin estado no necesita implementarlo.
   */
  cerrar?(): void | Promise<void>;
}
