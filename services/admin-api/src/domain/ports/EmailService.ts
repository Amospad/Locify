export interface EmailService {
  enviarInvitacion(emailDestino: string, token: string): Promise<void>;
}