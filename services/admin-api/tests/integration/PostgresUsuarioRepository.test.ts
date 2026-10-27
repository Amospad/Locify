import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { db } from '../../src/prisma/db.js';
import { PostgresUsuarioRepository } from '../../src/infrastructure/persistence/PostgresUsuarioRepository.js';
import {
  Usuario,
  RolUsuario,
  EstadoUsuario,
} from '../../src/domain/entities/Usuario.js';

const repositorio = new PostgresUsuarioRepository();
const email = `test-${randomUUID()}@locify.test`;
const id = randomUUID();

const usuario = Usuario.crear({
  id,
  email,
  passwordHash: '$2b$10$hashDePrueba',
  rol: RolUsuario.OPERADOR,
  estado: EstadoUsuario.PENDIENTE,
  tokenInvitacion: 'token-de-prueba',
  tokenExpiracion: new Date('2030-01-01T00:00:00.000Z'),
});

after(async () => {
  await db.orm.public.Usuario.where({ email }).deleteAll();
  await db.close();
});

describe('PostgresUsuarioRepository', () => {
  it('guarda un usuario y lo recupera por id y por email', async () => {
    await repositorio.guardar(usuario);

    const porId = await repositorio.buscarPorId(id);
    assert.ok(porId, 'buscarPorId debe encontrar el usuario recién guardado');
    assert.equal(porId.id, id);
    assert.equal(porId.email, email);
    assert.equal(porId.passwordHash, '$2b$10$hashDePrueba');
    assert.equal(porId.rol, RolUsuario.OPERADOR);
    assert.equal(porId.estado, EstadoUsuario.PENDIENTE);
    assert.equal(porId.tokenInvitacion, 'token-de-prueba');
    assert.equal(
      porId.tokenExpiracion?.toISOString(),
      '2030-01-01T00:00:00.000Z',
    );

    const porEmail = await repositorio.buscarPorEmail(email);
    assert.ok(porEmail, 'buscarPorEmail debe encontrar el usuario guardado');
    assert.equal(porEmail.id, id);
    assert.equal(porEmail.estado, EstadoUsuario.PENDIENTE);
  });

  it('actualiza el registro existente cuando se guarda el mismo id', async () => {
    const activado = Usuario.reconstituir({
      id,
      email,
      passwordHash: '$2b$10$hashDePrueba',
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.ACTIVO,
      tokenInvitacion: undefined,
      tokenExpiracion: undefined,
    });

    await repositorio.guardar(activado);

    const actualizado = await repositorio.buscarPorId(id);
    assert.ok(actualizado);
    assert.equal(actualizado.estado, EstadoUsuario.ACTIVO);
    assert.equal(actualizado.tokenInvitacion, undefined);
  });

  it('devuelve null cuando el usuario no existe', async () => {
    assert.equal(await repositorio.buscarPorId(randomUUID()), null);
    assert.equal(
      await repositorio.buscarPorEmail(`inexistente-${randomUUID()}@locify.test`),
      null,
    );
  });
});
