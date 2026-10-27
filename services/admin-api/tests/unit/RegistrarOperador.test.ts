import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { RegistrarOperadorUseCase } from '../../src/domain/use-cases/RegistrarOperador.js';
import {
  Usuario,
  RolUsuario,
  EstadoUsuario,
} from '../../src/domain/entities/Usuario.js';
import type { UsuarioRepository } from '../../src/domain/ports/UsuarioRepository.js';
import type { EmailService } from '../../src/domain/ports/EmailService.js';
import type { GeneradorId } from '../../src/domain/ports/GeneradorId.js';
import type { Reloj } from '../../src/domain/ports/Reloj.js';
import type { PasswordHasher } from '../../src/domain/ports/PasswordHasher.js';

const PASSWORD = 'ContraseñaSegura123!';

/**
 * Hash ficticio pero con el formato que exige `Usuario.crear`
 * (`$argon2id$...`): así el doble no relaja la validación del dominio.
 */
const HASH_FALSO = '$argon2id$v=19$m=65536,p=4,t=3$c2FsZGUtZmFrZQ$hash_falso';

class RepositorioEnMemoria implements UsuarioRepository {
  readonly guardados: Usuario[] = [];

  async guardar(usuario: Usuario): Promise<void> {
    const indice = this.guardados.findIndex((u) => u.id === usuario.id);
    if (indice >= 0) this.guardados[indice] = usuario;
    else this.guardados.push(usuario);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.guardados.find((u) => u.email === email) ?? null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.guardados.find((u) => u.id === id) ?? null;
  }
}

class EmailFalso implements EmailService {
  readonly enviados: Array<{ destino: string; token: string }> = [];
  fallar = false;

  async enviarInvitacion(destino: string, token: string): Promise<void> {
    if (this.fallar) throw new Error('SMTP caído');
    this.enviados.push({ destino, token });
  }
}

class FakePasswordHasher implements PasswordHasher {
  readonly hasheados: string[] = [];
  fallar = false;

  async hash(password: string): Promise<string> {
    if (this.fallar) throw new Error('Argon2 no disponible');
    this.hasheados.push(password);
    return HASH_FALSO;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return password === PASSWORD && hash === HASH_FALSO;
  }
}

/** Genera ids deterministas: id-1, id-2, id-3... */
class IdSecuencial implements GeneradorId {
  private secuencia = 0;

  generar(): string {
    this.secuencia += 1;
    return `id-${this.secuencia}`;
  }
}

const RELOJ_FIJO: Reloj = {
  ahora: () => new Date('2026-10-27T12:00:00.000Z'),
};

function crearCaso(): {
  repositorio: RepositorioEnMemoria;
  email: EmailFalso;
  hasher: FakePasswordHasher;
  caso: RegistrarOperadorUseCase;
} {
  const repositorio = new RepositorioEnMemoria();
  const email = new EmailFalso();
  const hasher = new FakePasswordHasher();
  const caso = new RegistrarOperadorUseCase(
    repositorio,
    email,
    new IdSecuencial(),
    RELOJ_FIJO,
    hasher,
  );
  return { repositorio, email, hasher, caso };
}

describe('RegistrarOperadorUseCase', () => {
  it('crea un operador PENDIENTE con invitación válida por 24 horas', async () => {
    const { repositorio, email, caso } = crearCaso();

    await caso.ejecutar({ email: 'operador@locify.co', password: PASSWORD });

    assert.equal(repositorio.guardados.length, 1);
    const guardado = repositorio.guardados[0]!;
    assert.equal(guardado.rol, RolUsuario.OPERADOR);
    assert.equal(guardado.estado, EstadoUsuario.PENDIENTE);
    assert.equal(guardado.email, 'operador@locify.co');
    assert.equal(
      guardado.tokenExpiracion?.toISOString(),
      '2026-10-28T12:00:00.000Z',
    );
    assert.notEqual(guardado.id, guardado.tokenInvitacion);

    assert.deepEqual(email.enviados, [
      { destino: 'operador@locify.co', token: guardado.tokenInvitacion },
    ]);
  });

  it('normaliza el email antes de buscar duplicados y de persistir', async () => {
    const { repositorio, email, caso } = crearCaso();

    await caso.ejecutar({ email: '  Operador@LOCIFY.CO  ', password: PASSWORD });

    assert.equal(repositorio.guardados[0]?.email, 'operador@locify.co');
    assert.equal(email.enviados[0]?.destino, 'operador@locify.co');
  });

  it('hashea la contraseña una sola vez y nunca guarda el texto plano', async () => {
    const { repositorio, hasher, caso } = crearCaso();

    await caso.ejecutar({ email: 'operador@locify.co', password: PASSWORD });

    assert.deepEqual(hasher.hasheados, [PASSWORD]);
    assert.equal(repositorio.guardados[0]?.passwordHash, HASH_FALSO);
    assert.notEqual(repositorio.guardados[0]?.passwordHash, PASSWORD);
  });

  it('rechaza un email ya registrado sin hashear, guardar ni enviar correo', async () => {
    const { repositorio, email, hasher, caso } = crearCaso();
    await caso.ejecutar({ email: 'operador@locify.co', password: PASSWORD });
    email.enviados.length = 0;
    hasher.hasheados.length = 0;

    await assert.rejects(
      () => caso.ejecutar({ email: 'OPERADOR@locify.co', password: PASSWORD }),
      /ya está registrado/,
    );

    assert.equal(repositorio.guardados.length, 1);
    assert.equal(email.enviados.length, 0);
    assert.equal(hasher.hasheados.length, 0, 'no debe gastar cómputo de Argon2 en un duplicado');
  });

  it('no persiste nada si el email es inválido', async () => {
    const { repositorio, hasher, caso } = crearCaso();

    await assert.rejects(
      () => caso.ejecutar({ email: 'sin-arroba', password: PASSWORD }),
      /El email no es válido/,
    );

    assert.equal(repositorio.guardados.length, 0);
    assert.equal(hasher.hasheados.length, 0);
  });

  it('propaga el fallo del hasher y no persiste ni envía correo', async () => {
    const { repositorio, email, hasher, caso } = crearCaso();
    hasher.fallar = true;

    await assert.rejects(
      () => caso.ejecutar({ email: 'operador@locify.co', password: PASSWORD }),
      /Argon2 no disponible/,
    );

    assert.equal(repositorio.guardados.length, 0);
    assert.equal(email.enviados.length, 0);
  });

  it('propaga el fallo del correo: el usuario queda guardado y el error se informa', async () => {
    const { repositorio, email, caso } = crearCaso();
    email.fallar = true;

    await assert.rejects(
      () => caso.ejecutar({ email: 'operador@locify.co', password: PASSWORD }),
      /SMTP caído/,
    );

    // Documenta el riesgo de doble escritura: no hay transacción ni outbox.
    assert.equal(repositorio.guardados.length, 1);
    assert.equal(repositorio.guardados[0]?.estado, EstadoUsuario.PENDIENTE);
  });
});
