import type { EmailService } from '../../domain/ports/EmailService.js';

type Escritor = (mensaje: string) => void;

/**
 * Adaptador de correo para desarrollo: imprime la invitación en la consola.
 *
 * NUNCA debe usarse en producción: el token de invitación es una credencial y
 * los logs no son un canal seguro. Si `NODE_ENV=production`, el constructor
 * falla al arrancar (*fail fast*) salvo que se habilite explícitamente con
 * `EMAIL_CONSOLA_PERMITIDA=true` para una demostración controlada.
 *
 * El adaptador SMTP (`EmailConsola` → `SmtpEmailService`) es el bloqueante 3
 * del plan de sprint y sustituirá a esta clase en `src/index.ts`.
 */
export class EmailConsola implements EmailService {
  private readonly escribir: Escritor;

  constructor(escribir?: Escritor) {
    const enProduccion = process.env['NODE_ENV'] === 'production';
    const permitido = process.env['EMAIL_CONSOLA_PERMITIDA'] === 'true';

    if (enProduccion && !permitido) {
      throw new Error(
        'EmailConsola no puede usarse en producción: configura un proveedor SMTP ' +
          '(EMAIL_DRIVER=smtp) o habilita EMAIL_CONSOLA_PERMITIDA=true sólo para una demo.',
      );
    }

    this.escribir = escribir ?? ((mensaje) => console.info(mensaje));
  }

  async enviarInvitacion(emailDestino: string, token: string): Promise<void> {
    const base = process.env['APP_URL'] ?? 'http://localhost:5173';

    this.escribir(
      [
        '[email:consola] Invitación de operador (sólo desarrollo)',
        `  Destino:  ${emailDestino}`,
        `  Enlace:   ${base}/activar?token=${encodeURIComponent(token)}`,
        `  Token:    ${token}`,
        '  Vigencia: 24 horas',
      ].join('\n'),
    );
  }
}
