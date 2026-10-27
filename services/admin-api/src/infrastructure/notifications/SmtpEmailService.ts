import { createTransport, type SendMailOptions } from 'nodemailer';
import type { EmailService } from '../../domain/ports/EmailService.js';
import { construirInvitacion } from './plantillas/invitacion.js';

/**
 * Tiempo máximo por fase del protocolo SMTP: apertura de conexión, saludo del
 * servidor y socket ocioso. Sin esto, un servidor de correo lento deja la
 * petición HTTP colgada hasta el timeout del cliente.
 */
export const TIEMPO_LIMITE_SMTP_MS = 10_000;

export interface OpcionesSmtp {
  host: string;
  puerto: number;
  seguro: boolean;
  usuario?: string;
  contrasena?: string;
  remitente: string;
  urlBase: string;
}

export interface ConfiguracionTransporte {
  host: string;
  port: number;
  secure: boolean;
  auth?: { user: string; pass: string };
  connectionTimeout: number;
  greetingTimeout: number;
  socketTimeout: number;
}

/**
 * Forma mínima que el servicio necesita del transporte. Permite inyectar un
 * doble en pruebas sin abrir una conexión SMTP.
 */
export interface EnviadorDeCorreo {
  sendMail(mensaje: SendMailOptions): Promise<unknown>;
  close?(): void;
}

function requerida(entorno: NodeJS.ProcessEnv, nombre: string): string {
  const valor = entorno[nombre]?.trim();

  if (!valor) {
    throw new Error(
      `${nombre} no está definida. Con EMAIL_DRIVER=smtp es obligatoria; ` +
        'revisa .env.example.',
    );
  }

  return valor;
}

function opcional(valor: string | undefined): string | undefined {
  const limpio = valor?.trim();
  return limpio ? limpio : undefined;
}

/**
 * Lee y valida la configuración SMTP del entorno.
 *
 * Reglas: `SMTP_HOST` y `SMTP_FROM` son obligatorias; el puerto 587 usa
 * STARTTLS (`secure: false`) y el 465 TLS directo (`secure: true`), salvo que
 * `SMTP_SECURE` lo fuerce. Las credenciales van juntas o no van.
 */
export function opcionesSmtpDesdeEntorno(
  entorno: NodeJS.ProcessEnv = process.env,
): OpcionesSmtp {
  const host = requerida(entorno, 'SMTP_HOST');
  const remitente = requerida(entorno, 'SMTP_FROM');

  const puertoCrudo = entorno['SMTP_PORT']?.trim() || '587';
  const puerto = Number(puertoCrudo);

  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error(
      `SMTP_PORT inválido: "${puertoCrudo}". Debe ser un entero entre 1 y 65535.`,
    );
  }

  const usuario = opcional(entorno['SMTP_USER']);
  const contrasena = opcional(entorno['SMTP_PASS']);

  if ((usuario && !contrasena) || (!usuario && contrasena)) {
    throw new Error('SMTP_USER y SMTP_PASS deben definirse juntas.');
  }

  const seguroCrudo = opcional(entorno['SMTP_SECURE']);
  const seguro = seguroCrudo !== undefined ? seguroCrudo.toLowerCase() === 'true' : puerto === 465;

  return {
    host,
    puerto,
    seguro,
    usuario,
    contrasena,
    remitente,
    urlBase: opcional(entorno['APP_URL']) ?? 'http://localhost:5173',
  };
}

/** Traduce las opciones de la aplicación a las de nodemailer. */
export function configuracionTransporte(opciones: OpcionesSmtp): ConfiguracionTransporte {
  return {
    host: opciones.host,
    port: opciones.puerto,
    secure: opciones.seguro,
    ...(opciones.usuario && opciones.contrasena
      ? { auth: { user: opciones.usuario, pass: opciones.contrasena } }
      : {}),
    connectionTimeout: TIEMPO_LIMITE_SMTP_MS,
    greetingTimeout: TIEMPO_LIMITE_SMTP_MS,
    socketTimeout: TIEMPO_LIMITE_SMTP_MS,
  };
}

/**
 * Adaptador de salida del puerto EmailService sobre SMTP (nodemailer).
 *
 * El token nunca se registra en logs: sólo viaja en el correo. La conexión se
 * reutiliza entre envíos y se libera con `cerrar()` al apagar el proceso.
 */
export class SmtpEmailService implements EmailService {
  private readonly opciones: OpcionesSmtp;
  private readonly enviador: EnviadorDeCorreo;

  constructor(opciones: OpcionesSmtp, enviador?: EnviadorDeCorreo) {
    this.opciones = opciones;
    this.enviador =
      enviador ??
      (createTransport(configuracionTransporte(opciones)) as unknown as EnviadorDeCorreo);
  }

  async enviarInvitacion(emailDestino: string, token: string): Promise<void> {
    const base = this.opciones.urlBase.replace(/\/+$/, '');
    const enlace = `${base}/activar?token=${encodeURIComponent(token)}`;

    const { asunto, texto, html } = construirInvitacion({
      emailDestino,
      enlace,
      token,
      remitente: this.opciones.remitente,
    });

    await this.enviador.sendMail({
      from: this.opciones.remitente,
      to: emailDestino,
      subject: asunto,
      text: texto,
      html,
    });
  }

  cerrar(): void {
    this.enviador.close?.();
  }
}
