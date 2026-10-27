import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { FastifyInstance } from 'fastify';

import { buildServer } from '../../src/interfaces/http/server.js';
import { AdminService } from '../../src/application/services/AdminService.js';
import { AuthService } from '../../src/application/services/AuthService.js';
import type { ConsultadorDeBaseDeDatos } from '../../src/application/ports/ConsultadorDeBaseDeDatos.js';
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
import type {
  ContenidoToken,
  ServicioDeTokens,
} from '../../src/domain/ports/ServicioDeTokens.js';
import { TokenInvalidoError } from '../../src/domain/errors/TokenInvalidoError.js';

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

  async compare(password: string, hash: string): Promise<boolean> {
    // Suficiente para el login: sólo la contraseña sembrada abre el hash sembrado.
    return password === PASSWORD && hash === HASH_FALSO;
  }
}

class IdSecuencial implements GeneradorId {
  private secuencia = 0;

  generar(): string {
    this.secuencia += 1;
    return `id-${this.secuencia}`;
  }
}

/** Tokens opacos en memoria: firma y verifica sin criptografía real. */
class TokensEnMemoria implements ServicioDeTokens {
  private readonly emitidos = new Map<string, ContenidoToken>();
  private secuencia = 0;

  async firmar(contenido: ContenidoToken): Promise<string> {
    this.secuencia += 1;
    const token = `jwt-${this.secuencia}`;
    this.emitidos.set(token, contenido);
    return token;
  }

  async verificar(token: string): Promise<ContenidoToken> {
    const contenido = this.emitidos.get(token);
    if (!contenido) throw new TokenInvalidoError();
    return contenido;
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
  tokens: TokensEnMemoria;
}

/**
 * Levanta la cadena real de aplicación (ruta → servicio → caso de uso →
 * dominio) con adaptadores en memoria. La persistencia real se cubre en
 * `tests/integration`; aquí importa el contrato HTTP y el cableado.
 */
async function levantarApp(): Promise<AppDePrueba> {
  const repositorio = new RepositorioEnMemoria();
  const correo = new EmailEnMemoria();
  const hasher = new HasherFalso();
  const tokens = new TokensEnMemoria();

  const adminService = new AdminService(
    repositorio,
    correo,
    new IdSecuencial(),
    RELOJ_FIJO,
    hasher,
  );
  const authService = new AuthService(repositorio, hasher, tokens);

  const app = await buildServer({
    db: dbFalsa,
    adminService,
    authService,
    servicioTokens: tokens,
  });

  return { app, repositorio, correo, hasher, tokens };
}

/** Token válido de un administrador, para las rutas protegidas. */
async function tokenDeAdmin(tokens: TokensEnMemoria): Promise<string> {
  return tokens.firmar({
    sub: 'admin-1',
    email: 'admin@locify.co',
    rol: RolUsuario.ADMIN,
  });
}

/** Llama a la reinvitación con el header Authorization ya armado. */
function reinvitar(app: FastifyInstance, id: string, token: string) {
  return app.inject({
    method: 'POST',
    url: `/api/operadores/${id}/reinvitar`,
    headers: { authorization: `Bearer ${token}` },
  });
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

  it('responde 502 con el id si el operador se guardó pero el correo falló, sin filtrar el detalle', async () => {
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
      // El id viaja en el 502: sin él, el cliente no podría reinvitar.
      assert.equal(res.json().id, repositorio.guardados[0]?.id);
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

describe('POST /api/operadores/:id/reinvitar', () => {
  /** Registra un operador válido y devuelve su id. */
  async function crearOperador(app: FastifyInstance): Promise<string> {
    const { statusCode, body } = await registrar(app, {
      email: 'operador@locify.co',
      password: PASSWORD,
    });

    assert.equal(statusCode, 201);
    return String(body['id']);
  }

  it('responde 200, renueva el token y reenvía la invitación', async () => {
    const { app, repositorio, correo, tokens } = await levantarApp();
    try {
      const id = await crearOperador(app);
      const tokenAnterior = repositorio.guardados[0]?.tokenInvitacion;

      const res = await reinvitar(app, id, await tokenDeAdmin(tokens));

      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.json(), { id, email: 'operador@locify.co' });

      const actualizado = repositorio.guardados[0]!;
      assert.notEqual(actualizado.tokenInvitacion, tokenAnterior);
      assert.equal(actualizado.estado, EstadoUsuario.PENDIENTE);

      // Un envío del registro + uno de la reinvitación, ambos al mismo correo.
      assert.equal(correo.enviados.length, 2);
      assert.deepEqual(correo.enviados[1], {
        destino: 'operador@locify.co',
        token: actualizado.tokenInvitacion,
      });
    } finally {
      await app.close();
    }
  });

  it('responde 404 si el id no existe', async () => {
    const { app, correo, tokens } = await levantarApp();
    try {
      const res = await reinvitar(app, 'no-existe', await tokenDeAdmin(tokens));

      assert.equal(res.statusCode, 404);
      assert.match(String(res.json().error), /no existe/i);
      assert.equal(correo.enviados.length, 0);
    } finally {
      await app.close();
    }
  });

  it('responde 400 si el operador ya está ACTIVO', async () => {
    const { app, repositorio, tokens } = await levantarApp();
    try {
      const id = await crearOperador(app);
      const registrado = repositorio.guardados[0]!;

      repositorio.guardados[0] = Usuario.reconstituir({
        id: registrado.id,
        email: registrado.email,
        passwordHash: registrado.passwordHash,
        rol: RolUsuario.OPERADOR,
        estado: EstadoUsuario.ACTIVO,
      });

      const res = await reinvitar(app, id, await tokenDeAdmin(tokens));

      assert.equal(res.statusCode, 400);
      assert.match(String(res.json().error), /PENDIENTE/);
    } finally {
      await app.close();
    }
  });

  it('responde 502 con el id si el correo falla, pero el token queda renovado', async () => {
    const { app, repositorio, correo, tokens } = await levantarApp();
    try {
      const id = await crearOperador(app);
      const tokenAnterior = repositorio.guardados[0]?.tokenInvitacion;

      correo.fallar = true;
      const res = await reinvitar(app, id, await tokenDeAdmin(tokens));

      assert.equal(res.statusCode, 502);
      assert.equal(res.json().id, id);
      assert.match(String(res.json().error), /invitación/);
      assert.equal(res.body.includes('SMTP caído'), false);
      assert.notEqual(repositorio.guardados[0]?.tokenInvitacion, tokenAnterior);
    } finally {
      await app.close();
    }
  });

  it('permite reinvitar cuando el correo falló durante el registro', async () => {
    const { app, repositorio, correo, tokens } = await levantarApp();
    correo.fallar = true;
    try {
      const registro = await app.inject({
        method: 'POST',
        url: '/api/operadores',
        payload: { email: 'operador@locify.co', password: PASSWORD },
      });

      assert.equal(registro.statusCode, 502);
      const id = String(registro.json().id);
      assert.equal(id, repositorio.guardados[0]?.id);
      assert.equal(repositorio.guardados[0]?.estado, EstadoUsuario.PENDIENTE);
      const tokenSinEnviar = repositorio.guardados[0]?.tokenInvitacion;

      // El correo se recupera: la reinvitación usa el id del 502.
      correo.fallar = false;
      const res = await reinvitar(app, id, await tokenDeAdmin(tokens));

      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.json(), { id, email: 'operador@locify.co' });
      assert.notEqual(repositorio.guardados[0]?.tokenInvitacion, tokenSinEnviar);
      assert.equal(repositorio.guardados.length, 1, 'no se duplica el operador');
      assert.equal(correo.enviados.length, 1);
    } finally {
      await app.close();
    }
  });

  it('responde 401 sin header Authorization', async () => {
    const { app, repositorio, correo } = await levantarApp();
    try {
      const id = await crearOperador(app);
      const tokenAnterior = repositorio.guardados[0]?.tokenInvitacion;

      const res = await app.inject({
        method: 'POST',
        url: `/api/operadores/${id}/reinvitar`,
      });

      assert.equal(res.statusCode, 401);
      assert.match(String(res.json().error), /Authorization|Token/);
      // Sin autenticación no hay efectos secundarios.
      assert.equal(repositorio.guardados[0]?.tokenInvitacion, tokenAnterior);
      assert.equal(correo.enviados.length, 1);
    } finally {
      await app.close();
    }
  });

  it('responde 401 con un token inválido o desconocido', async () => {
    const { app, correo } = await levantarApp();
    try {
      const id = await crearOperador(app);

      for (const cabecera of ['Bearer inventado', 'Basic abc', 'Bearer ']) {
        const res = await app.inject({
          method: 'POST',
          url: `/api/operadores/${id}/reinvitar`,
          headers: { authorization: cabecera },
        });

        assert.equal(res.statusCode, 401, `cabecera: "${cabecera}"`);
      }

      assert.equal(correo.enviados.length, 1);
    } finally {
      await app.close();
    }
  });

  it('responde 403 si el token es válido pero el rol no es ADMIN', async () => {
    const { app, repositorio, correo, tokens } = await levantarApp();
    try {
      const id = await crearOperador(app);
      const tokenAnterior = repositorio.guardados[0]?.tokenInvitacion;
      const tokenOperador = await tokens.firmar({
        sub: 'operador-1',
        email: 'operador@locify.co',
        rol: RolUsuario.OPERADOR,
      });

      const res = await reinvitar(app, id, tokenOperador);

      assert.equal(res.statusCode, 403);
      assert.match(String(res.json().error), /permisos/);
      assert.equal(repositorio.guardados[0]?.tokenInvitacion, tokenAnterior);
      assert.equal(correo.enviados.length, 1);
    } finally {
      await app.close();
    }
  });
});
