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

const propsValidas = {
  id: '9f1b2c3d-0000-4000-8000-000000000005',
  email: 'Operador@Locify.CO',
  passwordHash: '$2b$12$hashValido',
  rol: RolUsuario.OPERADOR,
  estado: EstadoUsuario.PENDIENTE,
  tokenExpiracion: new Date('2026-10-28T12:00:00.000Z'),
};

describe('Usuario.crear — validación de entrada', () => {
  it('normaliza el email a minúsculas y sin espacios', () => {
    const usuario = Usuario.crear({ ...propsValidas, email: '  Operador@Locify.CO ' });
    assert.equal(usuario.email, 'operador@locify.co');
  });

  it('rechaza un email sin dominio de nivel superior', () => {
    assert.throws(() => Usuario.crear({ ...propsValidas, email: 'a@b' }), /no es válido/);
    assert.throws(() => Usuario.crear({ ...propsValidas, email: 'a@b.c' }), /no es válido/);
  });

  it('rechaza emails de más de 254 caracteres', () => {
    const largo = `${'a'.repeat(250)}@locify.co`;
    assert.throws(() => Usuario.crear({ ...propsValidas, email: largo }), /no es válido/);
  });

  it('rechaza una contraseña en claro en lugar de un hash', () => {
    assert.throws(
      () => Usuario.crear({ ...propsValidas, passwordHash: 'MiClave123!' }),
      /hash BCrypt o Argon2/,
    );
  });

  it('acepta hashes BCrypt y Argon2', () => {
    assert.doesNotThrow(() => Usuario.crear({ ...propsValidas, passwordHash: '$2y$10$abc' }));
    assert.doesNotThrow(() =>
      Usuario.crear({ ...propsValidas, passwordHash: '$argon2id$v=19$m=65536$abc$def' }),
    );
  });

  it('no permite mutar la entidad a través del objeto de entrada', () => {
    const props = { ...propsValidas };
    const usuario = Usuario.crear(props);
    props.email = 'otro@locify.co';
    assert.equal(usuario.email, 'operador@locify.co');
  });
});

describe('Usuario — reglas temporales', () => {
  it('considera expirado el token después de la fecha límite', () => {
    const usuario = Usuario.reconstituir(propsValidas);
    assert.equal(usuario.tokenHaExpirado(new Date('2026-10-28T12:00:00.001Z')), true);
    assert.equal(usuario.tokenHaExpirado(new Date('2026-10-28T11:59:59.999Z')), false);
  });

  it('sin token de expiración no bloquea el acceso', () => {
    const usuario = Usuario.reconstituir({
      ...propsValidas,
      estado: EstadoUsuario.ACTIVO,
      tokenExpiracion: undefined,
    });
    assert.equal(usuario.puedeAccederAlDashboard(new Date('2030-01-01T00:00:00.000Z')), true);
  });

  it('un usuario suspendido no accede al dashboard aunque el token no expire', () => {
    const usuario = Usuario.reconstituir({
      ...propsValidas,
      estado: EstadoUsuario.SUSPENDIDO,
    });
    assert.equal(usuario.puedeAccederAlDashboard(new Date('2026-10-27T13:00:00.000Z')), false);
  });
});

describe('Usuario.regenerarInvitacion', () => {
  it('devuelve una instancia nueva con el token renovado sin mutar la original', () => {
    const original = Usuario.reconstituir({
      ...propsValidas,
      tokenInvitacion: 'token-viejo',
    });
    const nuevaExpiracion = new Date('2026-10-29T12:00:00.000Z');

    const renovado = original.regenerarInvitacion('token-nuevo', nuevaExpiracion);

    assert.notEqual(renovado, original);
    assert.equal(renovado.tokenInvitacion, 'token-nuevo');
    assert.deepEqual(renovado.tokenExpiracion, nuevaExpiracion);
    // La instancia original conserva el token anterior: nadie muta en silencio.
    assert.equal(original.tokenInvitacion, 'token-viejo');
    assert.deepEqual(original.tokenExpiracion, propsValidas.tokenExpiracion);
  });

  it('rechaza reinvitar a un operador que no está PENDIENTE', () => {
    for (const estado of [EstadoUsuario.ACTIVO, EstadoUsuario.SUSPENDIDO]) {
      const usuario = Usuario.reconstituir({ ...propsValidas, estado });
      assert.throws(
        () => usuario.regenerarInvitacion('token-nuevo', new Date()),
        /PENDIENTE/,
      );
    }
  });

  it('exige un token no vacío', () => {
    const usuario = Usuario.reconstituir(propsValidas);

    assert.throws(
      () => usuario.regenerarInvitacion('   ', new Date()),
      /token de invitación es obligatorio/,
    );
  });
});
