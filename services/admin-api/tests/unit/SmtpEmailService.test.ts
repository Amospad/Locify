import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  SmtpEmailService,
  configuracionTransporte,
  opcionesSmtpDesdeEntorno,
  TIEMPO_LIMITE_SMTP_MS,
  type EnviadorDeCorreo,
  type OpcionesSmtp,
} from '../../src/infrastructure/notifications/SmtpEmailService.js';

const ENTORNO_BASE = {
  SMTP_HOST: 'smtp.mailtrap.io',
  SMTP_PORT: '587',
  SMTP_USER: 'usuario',
  SMTP_PASS: 'secreto',
  SMTP_FROM: 'LOCIFY <no-reply@locify.co>',
  APP_URL: 'https://app.locify.co',
} as const;

function opcionesValidas(sobrescribir: Partial<OpcionesSmtp> = {}): OpcionesSmtp {
  return {
    host: 'smtp.locify.test',
    puerto: 587,
    seguro: false,
    usuario: 'usuario',
    contrasena: 'secreto',
    remitente: 'LOCIFY <no-reply@locify.co>',
    urlBase: 'https://app.locify.co',
    ...sobrescribir,
  };
}

class EnviadorFalso implements EnviadorDeCorreo {
  readonly mensajes: Array<Record<string, unknown>> = [];

  async sendMail(mensaje: Record<string, unknown>): Promise<unknown> {
    this.mensajes.push(mensaje);
    return { accepted: [mensaje['to']] };
  }
}

describe('opcionesSmtpDesdeEntorno', () => {
  it('arma las opciones desde las variables SMTP_*', () => {
    const opciones = opcionesSmtpDesdeEntorno(ENTORNO_BASE);

    assert.deepEqual(opciones, {
      host: 'smtp.mailtrap.io',
      puerto: 587,
      seguro: false,
      usuario: 'usuario',
      contrasena: 'secreto',
      remitente: 'LOCIFY <no-reply@locify.co>',
      urlBase: 'https://app.locify.co',
    });
  });

  it('marca secure=true por defecto en el puerto 465 y en SMTP_SECURE', () => {
    assert.equal(
      opcionesSmtpDesdeEntorno({ ...ENTORNO_BASE, SMTP_PORT: '465' }).seguro,
      true,
    );
    assert.equal(
      opcionesSmtpDesdeEntorno({ ...ENTORNO_BASE, SMTP_SECURE: 'true' }).seguro,
      true,
    );
    assert.equal(
      opcionesSmtpDesdeEntorno({ ...ENTORNO_BASE, SMTP_PORT: '465', SMTP_SECURE: 'false' }).seguro,
      false,
    );
  });

  it('omite auth cuando no hay credenciales (SMTP local sin autenticación)', () => {
    const opciones = opcionesSmtpDesdeEntorno({
      ...ENTORNO_BASE,
      SMTP_USER: '',
      SMTP_PASS: '',
    });

    assert.equal(opciones.usuario, undefined);
    assert.equal(opciones.contrasena, undefined);
  });

  it('falla nombrando la variable cuando falta SMTP_HOST', () => {
    const { SMTP_HOST: _omitido, ...sinHost } = ENTORNO_BASE;

    assert.throws(() => opcionesSmtpDesdeEntorno(sinHost), /SMTP_HOST/);
  });

  it('falla nombrando la variable cuando falta SMTP_FROM', () => {
    const { SMTP_FROM: _omitido, ...sinRemitente } = ENTORNO_BASE;

    assert.throws(() => opcionesSmtpDesdeEntorno(sinRemitente), /SMTP_FROM/);
  });

  it('rechaza un SMTP_PORT que no es un puerto válido', () => {
    assert.throws(() => opcionesSmtpDesdeEntorno({ ...ENTORNO_BASE, SMTP_PORT: 'abc' }), /SMTP_PORT/);
    assert.throws(() => opcionesSmtpDesdeEntorno({ ...ENTORNO_BASE, SMTP_PORT: '70000' }), /SMTP_PORT/);
  });

  it('exige SMTP_USER y SMTP_PASS juntas', () => {
    assert.throws(
      () => opcionesSmtpDesdeEntorno({ ...ENTORNO_BASE, SMTP_PASS: '' }),
      /SMTP_USER y SMTP_PASS/,
    );
  });
});

describe('configuracionTransporte', () => {
  it('limita conexión, saludo y socket a 10 segundos', () => {
    const configuracion = configuracionTransporte(opcionesValidas());

    assert.equal(TIEMPO_LIMITE_SMTP_MS, 10_000);
    assert.equal(configuracion.connectionTimeout, 10_000);
    assert.equal(configuracion.greetingTimeout, 10_000);
    assert.equal(configuracion.socketTimeout, 10_000);
    assert.equal(configuracion.host, 'smtp.locify.test');
    assert.equal(configuracion.secure, false);
    assert.deepEqual(configuracion.auth, { user: 'usuario', pass: 'secreto' });
  });

  it('no incluye auth si el servidor no la requiere', () => {
    const configuracion = configuracionTransporte(
      opcionesValidas({ usuario: undefined, contrasena: undefined }),
    );

    assert.equal(configuracion.auth, undefined);
  });
});

describe('SmtpEmailService', () => {
  it('envía asunto, remitente, token y enlace sin abrir una conexión real', async () => {
    const enviador = new EnviadorFalso();
    const servicio = new SmtpEmailService(opcionesValidas(), enviador);

    await servicio.enviarInvitacion('operador@locify.co', 'token-abc');

    assert.equal(enviador.mensajes.length, 1);
    const mensaje = enviador.mensajes[0]!;
    assert.equal(mensaje['to'], 'operador@locify.co');
    assert.equal(mensaje['from'], 'LOCIFY <no-reply@locify.co>');
    assert.match(String(mensaje['subject']), /Activa tu cuenta de operador/i);

    const texto = String(mensaje['text']);
    assert.match(texto, /token-abc/);
    assert.match(texto, /https:\/\/app\.locify\.co\/activar\?token=token-abc/);
    assert.match(texto, /24 horas/);

    const html = String(mensaje['html']);
    assert.match(html, /token-abc/);
    assert.match(html, /https:\/\/app\.locify\.co\/activar\?token=token-abc/);
  });

  it('no concatena una barra doble si APP_URL termina en /', async () => {
    const enviador = new EnviadorFalso();
    const servicio = new SmtpEmailService(
      opcionesValidas({ urlBase: 'https://app.locify.co/' }),
      enviador,
    );

    await servicio.enviarInvitacion('operador@locify.co', 'token-abc');

    assert.match(
      String(enviador.mensajes[0]!['text']),
      /https:\/\/app\.locify\.co\/activar\?token=token-abc/,
    );
  });
});
