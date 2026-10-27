import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { FastifyInstance } from 'fastify';

import { buildServer } from '../../src/interfaces/http/server.js';
import { AdminService } from '../../src/application/services/AdminService.js';
import type { ConsultadorDeBaseDeDatos } from '../../src/application/ports/ConsultadorDeBaseDeDatos.js';
import { Usuario } from '../../src/domain/entities/Usuario.js';
import type { UsuarioRepository } from '../../src/domain/ports/UsuarioRepository.js';
import type { EmailService } from '../../src/domain/ports/EmailService.js';
import type { GeneradorId } from '../../src/domain/ports/GeneradorId.js';
import type { Reloj } from '../../src/domain/ports/Reloj.js';
import type { PasswordHasher } from '../../src/domain/ports/PasswordHasher.js';

/** Contraseña válida: 12 caracteres, 4 categorías y fuera de la lista de comunes. */
const PASSWORD = 'Password123!';

/** Hash con formato Argon2 para que `Usuario.crear` no relaje su invariante. */
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

class EmailEnMemoria implements EmailService {
  readonly enviados: Array<{ destino: string; token: string }> = [];
  fallar = false;

  async enviarInvitacion(destino: string, token: string): Promise<void> {
    if (this.fallar) throw new Error('SMTP caído');
    this.enviados.push({ destino, token });
  }
}

class HasherFalso implements PasswordHasher {
  readonly hasheados: string[] = [];

  async hash(password: string): Promise<string> {
    this.hasheados.push(password);
    return HASH_FALSO;
  }

  async compare(): Promise<boolean> {
    return false;
  }
}

class IdSecuencial implements GeneradorId {
  private secuencia = 0;

  generar(): string {
    this.secuencia += 1;
    return `id-${this.secuencia}`;
  }
}

const RELOJ_FIJO: Reloj = { ahora: () => new Date('2026-10-27T12:00:00.000Z') };

/** Doble de salud: POST /api/operadores no debe tocar la base para responder. */
const dbFalsa: ConsultadorDeBaseDeDatos = {
  consultar: async () => [{ ok: 1 }],
  cerrar: async () => {},
};

interface AppDePrueba {
  app: FastifyInstance;
  repositorio: RepositorioEnMemoria;
  correo: EmailEnMemoria;
  hasher: HasherFalso;
}

/**
 * Levanta la cadena real de aplicación (ruta → AdminService → caso de uso →
 * dominio) con adaptadores en memoria. La persistencia real se cubre en
 * `tests/integration`; aquí importa el contrato HTTP y el cableado.
 */
async function levantarApp(): Promise<AppDePrueba> {
  const repositorio = new RepositorioEnMemoria();
  const correo = new EmailEnMemoria();
  const hasher = new HasherFalso();

  const adminService = new AdminService(
    repositorio,
    correo,
    new IdSecuencial(),
    RELOJ_FIJO,
    hasher,
  );

  const app = await buildServer({ db: dbFalsa, adminService });

  return { app, repositorio, correo, hasher };
}

async function registrar(
  app: FastifyInstance,
  body: unknown,
): Promise<{ statusCode: number; body: Record<string, unknown> }> {
  const res = await app.inject({ method: 'POST', url: '/api/operadores', payload: body });
  return { statusCode: res.statusCode, body: res.json() };
}

describe('POST /api/operadores', () => {
  it('responde 201 con id y email, sin hash, token ni contraseña', async () => {
    const { app, repositorio, correo, hasher } = await levantarApp();
    try {
      const res = await app.inject({
        method: 'POST',
        url: '/api/operadores',
        payload: { email: 'operador@locify.co', password: PASSWORD },
      });

      assert.equal(res.statusCode, 201);
      assert.deepEqual(Object.keys(res.json()).sort(), ['email', 'id']);
      assert.deepEqual(res.json(), { id: 'id-2', email: 'operador@locify.co' });

      // El texto plano no aparece en la respuesta ni en lo persistido.
      assert.equal(res.body.includes(PASSWORD), false);
      assert.equal(repositorio.guardados.length, 1);
      assert.equal(repositorio.guardados[0]?.passwordHash, HASH_FALSO);
      assert.deepEqual(hasher.hasheados, [PASSWORD]);
      assert.equal(correo.enviados.length, 1);
    } finally {
      await app.close();
    }
  });

  it('normaliza el email antes de guardarlo y de responder', async () => {
    const { app, repositorio } = await levantarApp();
    try {
      const { statusCode, body } = await registrar(app, {
        email: '  Operador@LOCIFY.CO  ',
        password: PASSWORD,
      });

      assert.equal(statusCode, 201);
      assert.equal(body['email'], 'operador@locify.co');
      assert.equal(repositorio.guardados[0]?.email, 'operador@locify.co');
    } finally {
      await app.close();
    }
  });

  it('responde 409 cuando el email ya existe', async () => {
    const { app, repositorio } = await levantarApp();
    try {
      await registrar(app, { email: 'operador@locify.co', password: PASSWORD });
      const { statusCode, body } = await registrar(app, {
        email: 'OPERADOR@locify.co',
        password: PASSWORD,
      });

      assert.equal(statusCode, 409);
      assert.match(String(body['error']), /ya está registrado/);
      assert.equal(repositorio.guardados.length, 1);
    } finally {
      await app.close();
    }
  });

  it('responde 400 con el motivo cuando la contraseña no cumple la política', async () => {
    const { app, repositorio, hasher } = await levantarApp();
    try {
      // 15 caracteres con número y símbolo, pero sin mayúscula.
      const { statusCode, body } = await registrar(app, {
        email: 'operador@locify.co',
        password: 'sinmayusculas1!',
      });

      assert.equal(statusCode, 400);
      assert.match(String(body['error']), /mayúscula/);
      assert.equal(repositorio.guardados.length, 0);
      assert.equal(hasher.hasheados.length, 0);
    } finally {
      await app.close();
    }
  });

  it('responde 400 cuando la contraseña es demasiado corta', async () => {
    const { app } = await levantarApp();
    try {
      const { statusCode, body } = await registrar(app, {
        email: 'operador@locify.co',
        password: 'Corta1!',
      });

      assert.equal(statusCode, 400);
      assert.match(String(body['error']), /al menos 12/);
    } finally {
      await app.close();
    }
  });

  it('responde 400 cuando el email es inválido', async () => {
    const { app } = await levantarApp();
    try {
      const { statusCode, body } = await registrar(app, {
        email: 'sin-arroba',
        password: PASSWORD,
      });

      assert.equal(statusCode, 400);
      assert.match(String(body['error']), /email no es válido/);
    } finally {
      await app.close();
    }
  });

  it('responde 400 si falta un campo obligatorio', async () => {
    const { app } = await levantarApp();
    try {
      const { statusCode } = await registrar(app, { email: 'operador@locify.co' });

      assert.equal(statusCode, 400);
    } finally {
      await app.close();
    }
  });

  it('responde 400 si el cuerpo trae propiedades adicionales', async () => {
    const { app } = await levantarApp();
    try {
      const { statusCode } = await registrar(app, {
        email: 'operador@locify.co',
        password: PASSWORD,
        rol: 'ADMIN',
      });

      assert.equal(statusCode, 400);
    } finally {
      await app.close();
    }
  });

  it('responde 400 si la contraseña supera los 128 caracteres', async () => {
    const { app, repositorio } = await levantarApp();
    try {
      const { statusCode } = await registrar(app, {
        email: 'operador@locify.co',
        password: `Aa1!${'x'.repeat(125)}`,
      });

      assert.equal(statusCode, 400);
      assert.equal(repositorio.guardados.length, 0);
    } finally {
      await app.close();
    }
  });

  it('responde 502 si el operador se guardó pero el correo falló, sin filtrar el detalle', async () => {
    const { app, repositorio, correo } = await levantarApp();
    correo.fallar = true;
    try {
      const res = await app.inject({
        method: 'POST',
        url: '/api/operadores',
        payload: { email: 'operador@locify.co', password: PASSWORD },
      });

      assert.equal(res.statusCode, 502);
      assert.match(String(res.json().error), /invitación/);
      // El detalle interno (SMTP, credenciales, stack) no llega al cliente.
      assert.equal(res.body.includes('SMTP caído'), false);
      // Riesgo conocido y documentado: no hay outbox, el usuario queda PENDIENTE.
      assert.equal(repositorio.guardados.length, 1);
    } finally {
      await app.close();
    }
  });

  it('responde 429 al superar 10 registros por minuto', async () => {
    const { app } = await levantarApp();
    try {
      for (let i = 0; i < 10; i += 1) {
        const { statusCode } = await registrar(app, {
          email: `operador${i}@locify.co`,
          password: PASSWORD,
        });
        assert.equal(statusCode, 201);
      }

      const { statusCode } = await registrar(app, {
        email: 'operador10@locify.co',
        password: PASSWORD,
      });
      assert.equal(statusCode, 429);
    } finally {
      await app.close();
    }
  });
});
