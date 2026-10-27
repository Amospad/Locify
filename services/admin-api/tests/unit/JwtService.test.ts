import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SignJWT } from 'jose';

import {
  JwtService,
  opcionesJwtDesdeEntorno,
} from '../../src/infrastructure/security/JwtService.js';
import { TokenInvalidoError } from '../../src/domain/errors/TokenInvalidoError.js';
import { RolUsuario } from '../../src/domain/entities/Usuario.js';

const SECRETO = 'secreto-de-prueba-con-mas-de-32-caracteres';
const ENTORNO = {
  JWT_SECRET: SECRETO,
  JWT_ISSUER: 'locify-test',
  JWT_AUDIENCE: 'locify-test',
  JWT_EXPIRES_IN: '2h',
} as const;

function crearServicio(): JwtService {
  return new JwtService(opcionesJwtDesdeEntorno(ENTORNO));
}

function codificarSecreto(secreto: string): Uint8Array {
  return new TextEncoder().encode(secreto);
}

describe('opcionesJwtDesdeEntorno', () => {
  it('lee y valida la configuración JWT', () => {
    assert.deepEqual(opcionesJwtDesdeEntorno(ENTORNO), {
      secreto: SECRETO,
      emisor: 'locify-test',
      audiencia: 'locify-test',
      expiraEn: '2h',
    });
  });

  it('aplica valores por defecto de emisor, audiencia y expiración', () => {
    const opciones = opcionesJwtDesdeEntorno({ JWT_SECRET: SECRETO });

    assert.equal(opciones.emisor, 'locify-admin-api');
    assert.equal(opciones.audiencia, 'locify');
    assert.equal(opciones.expiraEn, '1h');
  });

  it('falla nombrando JWT_SECRET si falta', () => {
    assert.throws(() => opcionesJwtDesdeEntorno({}), /JWT_SECRET/);
  });

  it('rechaza un secreto demasiado corto para HS256', () => {
    assert.throws(() => opcionesJwtDesdeEntorno({ JWT_SECRET: 'corto' }), /32/);
  });
});

describe('JwtService', () => {
  it('firma y verifica un token conservando id, email y rol', async () => {
    const servicio = crearServicio();

    const token = await servicio.firmar({
      sub: 'usr-1',
      email: 'operador@locify.co',
      rol: RolUsuario.OPERADOR,
    });

    assert.match(token, /^[\w-]+\.[\w-]+\.[\w-]+$/);

    const contenido = await servicio.verificar(token);
    assert.deepEqual(contenido, {
      sub: 'usr-1',
      email: 'operador@locify.co',
      rol: RolUsuario.OPERADOR,
    });
  });

  it('rechaza un token manipulado', async () => {
    const servicio = crearServicio();
    const token = await servicio.firmar({
      sub: 'usr-1',
      email: 'operador@locify.co',
      rol: RolUsuario.OPERADOR,
    });

    const [cabecera, , firma] = token.split('.');
    const manipulado = `${cabecera}.${Buffer.from(
      JSON.stringify({ sub: 'admin-1', email: 'admin@locify.co', rol: 'ADMIN' }),
    ).toString('base64url')}.${firma}`;

    await assert.rejects(() => servicio.verificar(manipulado), TokenInvalidoError);
  });

  it('rechaza un token firmado con otro secreto', async () => {
    const otro = new JwtService({
      secreto: 'otro-secreto-suficientemente-largo-para-hs256',
      emisor: 'locify-test',
      audiencia: 'locify-test',
      expiraEn: '1h',
    });
    const token = await otro.firmar({
      sub: 'usr-1',
      email: 'operador@locify.co',
      rol: RolUsuario.ADMIN,
    });

    await assert.rejects(() => crearServicio().verificar(token), TokenInvalidoError);
  });

  it('rechaza un token expirado', async () => {
    const expirado = await new SignJWT({ email: 'operador@locify.co', rol: RolUsuario.ADMIN })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('usr-1')
      .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
      .setIssuer('locify-test')
      .setAudience('locify-test')
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(codificarSecreto(SECRETO));

    await assert.rejects(() => crearServicio().verificar(expirado), TokenInvalidoError);
  });

  it('rechaza un token con un rol desconocido', async () => {
    const token = await new SignJWT({ email: 'operador@locify.co', rol: 'SUPERADMIN' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('usr-1')
      .setIssuedAt()
      .setIssuer('locify-test')
      .setAudience('locify-test')
      .setExpirationTime('1h')
      .sign(codificarSecreto(SECRETO));

    await assert.rejects(() => crearServicio().verificar(token), TokenInvalidoError);
  });
});
