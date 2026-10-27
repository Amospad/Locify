import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ReinvitarOperadorUseCase } from '../../src/domain/use-cases/ReinvitarOperador.js';
import {
  Usuario,
  RolUsuario,
  EstadoUsuario,
} from '../../src/domain/entities/Usuario.js';
import { ErrorEnvioDeInvitacion } from '../../src/domain/errors/ErrorEnvioDeInvitacion.js';
import { ErrorNoEncontrado } from '../../src/domain/errors/ErrorNoEncontrado.js';
import type { UsuarioRepository } from '../../src/domain/ports/UsuarioRepository.js';
import type { EmailService } from '../../src/domain/ports/EmailService.js';
import type { GeneradorId } from '../../src/domain/ports/GeneradorId.js';
import type { Reloj } from '../../src/domain/ports/Reloj.js';

const HASH_FALSO = '$argon2id$v=19$m=65536,p=4,t=3$c2FsZGUtZmFrZQ$hash_falso';
const AHORA = new Date('2026-10-27T12:00:00.000Z');
const TOKEN_VIEJO = 'token-viejo';
const EXPIRACION_VIEJA = new Date('2026-10-20T12:00:00.000Z');

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

class IdSecuencial implements GeneradorId {
  private secuencia = 0;

  generar(): string {
    this.secuencia += 1;
    return `token-${this.secuencia}`;
  }
}

const RELOJ_FIJO: Reloj = { ahora: () => AHORA };

function crearCaso(estado: EstadoUsuario = EstadoUsuario.PENDIENTE): {
  caso: ReinvitarOperadorUseCase;
  repositorio: RepositorioEnMemoria;
  email: EmailFalso;
} {
  const repositorio = new RepositorioEnMemoria();
  const email = new EmailFalso();
  const caso = new ReinvitarOperadorUseCase(
    repositorio,
    email,
    new IdSecuencial(),
    RELOJ_FIJO,
  );

  repositorio.guardados.push(
    Usuario.reconstituir({
      id: 'usr-1',
      email: 'operador@locify.co',
      passwordHash: HASH_FALSO,
      rol: RolUsuario.OPERADOR,
      estado,
      tokenInvitacion: TOKEN_VIEJO,
      tokenExpiracion: EXPIRACION_VIEJA,
    }),
  );

  return { caso, repositorio, email };
}

describe('ReinvitarOperadorUseCase', () => {
  it('renueva el token y su expiración, guarda y reenvía la invitación', async () => {
    const { caso, repositorio, email } = crearCaso();

    const resultado = await caso.ejecutar('usr-1');

    assert.deepEqual(resultado, { id: 'usr-1', email: 'operador@locify.co' });

    const actualizado = repositorio.guardados[0]!;
    assert.equal(actualizado.tokenInvitacion, 'token-1');
    assert.notEqual(actualizado.tokenInvitacion, TOKEN_VIEJO);
    assert.equal(
      actualizado.tokenExpiracion?.toISOString(),
      '2026-10-28T12:00:00.000Z',
    );
    // El resto de campos se conserva: reinvitar no altera identidad ni rol.
    assert.equal(actualizado.estado, EstadoUsuario.PENDIENTE);
    assert.equal(actualizado.passwordHash, HASH_FALSO);

    assert.deepEqual(email.enviados, [
      { destino: 'operador@locify.co', token: 'token-1' },
    ]);
  });

  it('rechaza un id inexistente sin enviar correo', async () => {
    const { caso, email } = crearCaso();

    await assert.rejects(() => caso.ejecutar('no-existe'), ErrorNoEncontrado);
    assert.equal(email.enviados.length, 0);
  });

  it('no reinvita a un operador ACTIVO (ya tiene credenciales)', async () => {
    const { caso, repositorio, email } = crearCaso(EstadoUsuario.ACTIVO);

    await assert.rejects(() => caso.ejecutar('usr-1'), /PENDIENTE/);

    assert.equal(repositorio.guardados[0]?.tokenInvitacion, TOKEN_VIEJO);
    assert.equal(repositorio.guardados[0]?.tokenExpiracion?.toISOString(), EXPIRACION_VIEJA.toISOString());
    assert.equal(email.enviados.length, 0);
  });

  it('no reinvita a un operador SUSPENDIDO', async () => {
    const { caso, email } = crearCaso(EstadoUsuario.SUSPENDIDO);

    await assert.rejects(() => caso.ejecutar('usr-1'), /PENDIENTE/);
    assert.equal(email.enviados.length, 0);
  });

  it('si el correo falla, el token nuevo queda guardado y la causa se conserva', async () => {
    const { caso, repositorio, email } = crearCaso();
    email.fallar = true;

    await assert.rejects(
      () => caso.ejecutar('usr-1'),
      (error: unknown) => {
        assert.ok(error instanceof ErrorEnvioDeInvitacion);
        assert.match(error.message, /invitación/);
        assert.equal(error.idOperador, 'usr-1');
        assert.match(String((error.cause as Error).message), /SMTP caído/);
        return true;
      },
    );

    // El token nuevo ya está persistido: reintentar la reinvitación es seguro.
    assert.equal(repositorio.guardados[0]?.tokenInvitacion, 'token-1');
    assert.equal(email.enviados.length, 0);
  });
});
