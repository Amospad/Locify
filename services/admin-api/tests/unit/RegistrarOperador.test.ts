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

const HASH_BCRYPT = '$2b$12$hashDePruebaConLongitudSuficiente';

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
  caso: RegistrarOperadorUseCase;
} {
  const repositorio = new RepositorioEnMemoria();
  const email = new EmailFalso();
  const caso = new RegistrarOperadorUseCase(
    repositorio,
    email,
    new IdSecuencial(),
    RELOJ_FIJO,
  );
  return { repositorio, email, caso };
}

describe('RegistrarOperadorUseCase', () => {
  it('crea un operador PENDIENTE con invitación válida por 24 horas', async () => {
    const { repositorio, email, caso } = crearCaso();

    await caso.ejecutar({ email: 'operador@locify.co', passwordHash: HASH_BCRYPT });

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

    await caso.ejecutar({ email: '  Operador@LOCIFY.CO  ', passwordHash: HASH_BCRYPT });

    assert.equal(repositorio.guardados[0]?.email, 'operador@locify.co');
    assert.equal(email.enviados[0]?.destino, 'operador@locify.co');
  });

  it('rechaza un email ya registrado sin volver a guardar ni enviar correo', async () => {
    const { repositorio, email, caso } = crearCaso();
    await caso.ejecutar({ email: 'operador@locify.co', passwordHash: HASH_BCRYPT });
    email.enviados.length = 0;

    await assert.rejects(
      () => caso.ejecutar({ email: 'OPERADOR@locify.co', passwordHash: HASH_BCRYPT }),
      /ya está registrado/,
    );

    assert.equal(repositorio.guardados.length, 1);
    assert.equal(email.enviados.length, 0);
  });

  it('no persiste nada si el passwordHash es una contraseña en claro', async () => {
    const { repositorio, email, caso } = crearCaso();

    await assert.rejects(
      () => caso.ejecutar({ email: 'operador@locify.co', passwordHash: 'MiClave123!' }),
      /hash BCrypt o Argon2/,
    );

    assert.equal(repositorio.guardados.length, 0);
    assert.equal(email.enviados.length, 0);
  });

  it('no persiste nada si el email es inválido', async () => {
    const { repositorio, caso } = crearCaso();

    await assert.rejects(
      () => caso.ejecutar({ email: 'sin-arroba', passwordHash: HASH_BCRYPT }),
      /El email no es válido/,
    );

    assert.equal(repositorio.guardados.length, 0);
  });

  it('conserva el hash recibido sin rehashearlo', async () => {
    const { repositorio, caso } = crearCaso();
    const hashArgon2 = '$argon2id$v=19$m=65536,t=3,p=4$abc$def';

    await caso.ejecutar({ email: 'operador@locify.co', passwordHash: hashArgon2 });

    assert.equal(repositorio.guardados[0]?.passwordHash, hashArgon2);
  });

  it('propaga el fallo del correo: el usuario queda guardado y el error se informa', async () => {
    const { repositorio, email, caso } = crearCaso();
    email.fallar = true;

    await assert.rejects(
      () => caso.ejecutar({ email: 'operador@locify.co', passwordHash: HASH_BCRYPT }),
      /SMTP caído/,
    );

    // Documenta el riesgo de doble escritura: no hay transacción ni outbox.
    assert.equal(repositorio.guardados.length, 1);
    assert.equal(repositorio.guardados[0]?.estado, EstadoUsuario.PENDIENTE);
  });
});
