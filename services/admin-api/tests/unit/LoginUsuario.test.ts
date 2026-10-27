import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { LoginUsuarioUseCase } from '../../src/domain/use-cases/LoginUsuario.js';
import { CredencialesInvalidasError } from '../../src/domain/errors/CredencialesInvalidasError.js';
import { UsuarioNoActivoError } from '../../src/domain/errors/UsuarioNoActivoError.js';
import {
  Usuario,
  RolUsuario,
  EstadoUsuario,
} from '../../src/domain/entities/Usuario.js';
import type { UsuarioRepository } from '../../src/domain/ports/UsuarioRepository.js';
import type { PasswordHasher } from '../../src/domain/ports/PasswordHasher.js';
import type {
  ContenidoToken,
  ServicioDeTokens,
} from '../../src/domain/ports/ServicioDeTokens.js';

const EMAIL = 'operador@locify.co';
const PASSWORD = 'Password123!';
const HASH_REAL = '$argon2id$v=19$m=65536,p=4,t=3$c2FsZGUtZmFrZQ$hash_falso';

class RepositorioEnMemoria implements UsuarioRepository {
  readonly usuarios: Usuario[] = [];
  readonly buscados: string[] = [];

  async guardar(usuario: Usuario): Promise<void> {
    this.usuarios.push(usuario);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    this.buscados.push(email);
    return this.usuarios.find((u) => u.email === email) ?? null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.id === id) ?? null;
  }
}

class HasherFalso implements PasswordHasher {
  readonly comparaciones: Array<{ password: string; hash: string }> = [];

  async hash(): Promise<string> {
    return HASH_REAL;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    this.comparaciones.push({ password, hash });
    return hash === HASH_REAL && password === PASSWORD;
  }
}

class TokensFalso implements ServicioDeTokens {
  readonly firmados: ContenidoToken[] = [];

  async firmar(contenido: ContenidoToken): Promise<string> {
    this.firmados.push(contenido);
    return `jwt-${contenido.sub}`;
  }

  async verificar(): Promise<ContenidoToken> {
    throw new Error('no se usa en este caso de uso');
  }
}

function crearCaso(estado: EstadoUsuario = EstadoUsuario.ACTIVO): {
  caso: LoginUsuarioUseCase;
  repositorio: RepositorioEnMemoria;
  hasher: HasherFalso;
  tokens: TokensFalso;
} {
  const repositorio = new RepositorioEnMemoria();
  const hasher = new HasherFalso();
  const tokens = new TokensFalso();

  repositorio.usuarios.push(
    Usuario.reconstituir({
      id: 'usr-1',
      email: EMAIL,
      passwordHash: HASH_REAL,
      rol: RolUsuario.OPERADOR,
      estado,
      tokenInvitacion: 'token-viejo',
      tokenExpiracion: new Date('2030-01-01T00:00:00.000Z'),
    }),
  );

  return {
    caso: new LoginUsuarioUseCase(repositorio, hasher, tokens),
    repositorio,
    hasher,
    tokens,
  };
}

describe('LoginUsuarioUseCase', () => {
  it('autentica un usuario ACTIVO y devuelve el token con id y rol', async () => {
    const { caso, tokens } = crearCaso();

    const sesion = await caso.ejecutar({ email: EMAIL, password: PASSWORD });

    assert.deepEqual(sesion, {
      token: 'jwt-usr-1',
      usuario: { id: 'usr-1', email: EMAIL, rol: RolUsuario.OPERADOR },
    });
    assert.deepEqual(tokens.firmados, [
      { sub: 'usr-1', email: EMAIL, rol: RolUsuario.OPERADOR },
    ]);
    // La sesión no expone el hash ni el token de invitación.
    assert.equal('passwordHash' in sesion.usuario, false);
  });

  it('normaliza el email antes de buscar: el login no distingue mayúsculas', async () => {
    const { caso, repositorio } = crearCaso();

    await caso.ejecutar({ email: '  OPERADOR@LOCIFY.CO ', password: PASSWORD });

    assert.deepEqual(repositorio.buscados, [EMAIL]);
  });

  it('rechaza con el mismo error si el email no existe', async () => {
    const { caso, hasher, tokens } = crearCaso();

    await assert.rejects(
      () => caso.ejecutar({ email: 'desconocido@locify.co', password: PASSWORD }),
      (error: unknown) => {
        assert.ok(error instanceof CredencialesInvalidasError);
        assert.match(error.message, /Email o contraseña/);
        return true;
      },
    );

    // Comparación señuelo: el tiempo de respuesta no delata que el email no existe.
    assert.equal(hasher.comparaciones.length, 1);
    assert.notEqual(hasher.comparaciones[0]?.hash, HASH_REAL);
    assert.equal(tokens.firmados.length, 0);
  });

  it('rechaza con el mismo error si la contraseña es incorrecta', async () => {
    const { caso, tokens } = crearCaso();

    await assert.rejects(
      () => caso.ejecutar({ email: EMAIL, password: 'Password123?' }),
      CredencialesInvalidasError,
    );

    assert.equal(tokens.firmados.length, 0);
  });

  it('rechaza a un usuario PENDIENTE aunque la contraseña sea correcta', async () => {
    const { caso, tokens } = crearCaso(EstadoUsuario.PENDIENTE);

    await assert.rejects(
      () => caso.ejecutar({ email: EMAIL, password: PASSWORD }),
      UsuarioNoActivoError,
    );

    assert.equal(tokens.firmados.length, 0);
  });

  it('rechaza a un usuario SUSPENDIDO aunque la contraseña sea correcta', async () => {
    const { caso, tokens } = crearCaso(EstadoUsuario.SUSPENDIDO);

    await assert.rejects(
      () => caso.ejecutar({ email: EMAIL, password: PASSWORD }),
      UsuarioNoActivoError,
    );

    assert.equal(tokens.firmados.length, 0);
  });

  it('no revela el estado si la contraseña es incorrecta', async () => {
    const { caso } = crearCaso(EstadoUsuario.SUSPENDIDO);

    // Primero se verifica la contraseña: sin credenciales válidas, el estado no importa.
    await assert.rejects(
      () => caso.ejecutar({ email: EMAIL, password: 'OtraPassword123!' }),
      CredencialesInvalidasError,
    );
  });
});
