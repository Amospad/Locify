import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  Usuario,
  RolUsuario,
  EstadoUsuario,
} from '../../src/domain/entities/Usuario.js';

describe('Usuario.reconstituir', () => {
  it('rehidrata un usuario persistido conservando todos sus campos', () => {
    const expiracion = new Date('2030-01-01T00:00:00.000Z');

    const usuario = Usuario.reconstituir({
      id: '9f1b2c3d-0000-4000-8000-000000000001',
      email: 'operador@locify.co',
      passwordHash: '$2b$10$hashPersistido',
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.PENDIENTE,
      tokenInvitacion: 'token-abc',
      tokenExpiracion: expiracion,
    });

    assert.equal(usuario.id, '9f1b2c3d-0000-4000-8000-000000000001');
    assert.equal(usuario.email, 'operador@locify.co');
    assert.equal(usuario.rol, RolUsuario.OPERADOR);
    assert.equal(usuario.estado, EstadoUsuario.PENDIENTE);
    assert.equal(usuario.tokenInvitacion, 'token-abc');
    assert.deepEqual(usuario.tokenExpiracion, expiracion);
  });

  it('expone passwordHash para que el adaptador pueda persistirlo', () => {
    const usuario = Usuario.reconstituir({
      id: '9f1b2c3d-0000-4000-8000-000000000002',
      email: 'admin@locify.co',
      passwordHash: '$2b$10$otroHash',
      rol: RolUsuario.ADMIN,
      estado: EstadoUsuario.ACTIVO,
    });

    assert.equal(usuario.passwordHash, '$2b$10$otroHash');
  });

  it('no valida el email al reconstituir desde persistencia', () => {
    // Un registro histórico con email inválido debe poder leerse sin romper,
    // a diferencia de crear() que sí valida datos de entrada.
    const usuario = Usuario.reconstituir({
      id: '9f1b2c3d-0000-4000-8000-000000000003',
      email: 'registro-historico',
      passwordHash: '$2b$10$hash',
      rol: RolUsuario.CONDUCTOR,
      estado: EstadoUsuario.SUSPENDIDO,
    });

    assert.equal(usuario.email, 'registro-historico');
  });
});

describe('Usuario.crear', () => {
  it('sigue rechazando un email inválido en la creación', () => {
    assert.throws(
      () =>
        Usuario.crear({
          id: '9f1b2c3d-0000-4000-8000-000000000004',
          email: 'sin-arroba',
          passwordHash: '$2b$10$hash',
          rol: RolUsuario.CONDUCTOR,
          estado: EstadoUsuario.PENDIENTE,
        }),
      /El email no es válido/,
    );
  });
});
