import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { FastifyInstance } from 'fastify';

import { buildServer } from '../../src/interfaces/http/server.js';
import { AuthService } from '../../src/application/services/AuthService.js';
import { AdminService } from '../../src/application/services/AdminService.js';
import { JwtService } from '../../src/infrastructure/security/JwtService.js';
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

const PASSWORD = 'Password123!';
const HASH_REAL = '$argon2id$v=19$m=65536,p=4,t=3$c2FsZGUtZmFrZQ$hash_falso';

class RepositorioEnMemoria implements UsuarioRepository {
  readonly usuarios: Usuario[] = [];

  async guardar(usuario: Usuario): Promise<void> {
    const indice = this.usuarios.findIndex((u) => u.id === usuario.id);
    if (indice >= 0) this.usuarios[indice] = usuario;
    else this.usuarios.push(usuario);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.email === email) ?? null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarios.find((u) => u.id === id) ?? null;
  }
}

class EmailEnMemoria implements EmailService {
  readonly enviados: Array<{ destino: string; token: string }> = [];

  async enviarInvitacion(destino: string, token: string): Promise<void> {
    this.enviados.push({ destino, token });
  }
}

/**
 * Hasher determinista: sólo la contraseña sembrada abre el hash sembrado.
 * El Argon2 real se prueba en `tests/unit/Argon2Hasher.test.ts` e integración.
 */
class HasherFalso implements PasswordHasher {
  async hash(): Promise<string> {
    return HASH_REAL;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return password === PASSWORD && hash === HASH_REAL;
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

const dbFalsa: ConsultadorDeBaseDeDatos = {
  consultar: async () => [{ ok: 1 }],
  cerrar: async () => {},
};

interface AppDePrueba {
  app: FastifyInstance;
  repositorio: RepositorioEnMemoria;
  correo: EmailEnMemoria;
}

/**
 * Cadena completa con JWT real: el token que devuelve el login se verifica de
 * verdad en el preHandler de la reinvitación. Así la prueba no puede pasar por
 * un doble que acepte cualquier cosa.
 */
async function levantarApp(): Promise<AppDePrueba> {
  const repositorio = new RepositorioEnMemoria();
  const correo = new EmailEnMemoria();
  const hasher = new HasherFalso();

  const servicioTokens = new JwtService({
    secreto: 'secreto-de-prueba-con-mas-de-32-caracteres',
    emisor: 'locify-test',
    audiencia: 'locify-test',
    expiraEn: '1h',
  });

  return {
    app: await buildServer({
      db: dbFalsa,
      adminService: new AdminService(
        repositorio,
        correo,
        new IdSecuencial(),
        RELOJ_FIJO,
        hasher,
      ),
      authService: new AuthService(repositorio, hasher, servicioTokens),
      servicioTokens,
    }),
    repositorio,
    correo,
  };
}

function sembrarUsuario(
  repositorio: RepositorioEnMemoria,
  datos: {
    id?: string;
    email?: string;
    rol?: RolUsuario;
    estado?: EstadoUsuario;
  } = {},
): Usuario {
  const usuario = Usuario.reconstituir({
    id: datos.id ?? 'usr-1',
    email: datos.email ?? 'admin@locify.co',
    passwordHash: HASH_REAL,
    rol: datos.rol ?? RolUsuario.ADMIN,
    estado: datos.estado ?? EstadoUsuario.ACTIVO,
  });

  repositorio.usuarios.push(usuario);
  return usuario;
}

function login(app: FastifyInstance, body: unknown) {
  return app.inject({ method: 'POST', url: '/api/auth/login', payload: body });
}

describe('POST /api/auth/login', () => {
  it('responde 200 con un JWT real y el usuario sin datos sensibles', async () => {
    const { app, repositorio } = await levantarApp();
    sembrarUsuario(repositorio);
    try {
      const res = await login(app, { email: 'admin@locify.co', password: PASSWORD });

      assert.equal(res.statusCode, 200);
      const cuerpo = res.json() as { token: string; user: Record<string, unknown> };

      assert.deepEqual(Object.keys(cuerpo).sort(), ['token', 'user']);
      assert.deepEqual(Object.keys(cuerpo.user).sort(), ['email', 'id', 'rol']);
      assert.equal(cuerpo.user['id'], 'usr-1');
      assert.equal(cuerpo.user['email'], 'admin@locify.co');
      assert.equal(cuerpo.user['rol'], RolUsuario.ADMIN);
      // JWT: tres segmentos separados por punto.
      assert.equal(cuerpo.token.split('.').length, 3);

      // Ni contraseña ni hash en la respuesta.
      assert.equal(res.body.includes(PASSWORD), false);
      assert.equal(res.body.includes(HASH_REAL), false);
    } finally {
      await app.close();
    }
  });

  it('normaliza el email: el login no distingue mayúsculas ni espacios', async () => {
    const { app, repositorio } = await levantarApp();
    sembrarUsuario(repositorio);
    try {
      const res = await login(app, {
        email: '  ADMIN@LOCIFY.CO ',
        password: PASSWORD,
      });

      assert.equal(res.statusCode, 200);
    } finally {
      await app.close();
    }
  });

  it('responde 401 con contraseña incorrecta', async () => {
    const { app, repositorio } = await levantarApp();
    sembrarUsuario(repositorio);
    try {
      const res = await login(app, { email: 'admin@locify.co', password: 'Otra123!abcd' });

      assert.equal(res.statusCode, 401);
      assert.match(String(res.json().error), /Email o contraseña/);
      assert.equal(res.body.includes('token'), false);
    } finally {
      await app.close();
    }
  });

  it('responde 401 idéntico si el email no existe (no revela cuentas)', async () => {
    const { app, repositorio } = await levantarApp();
    sembrarUsuario(repositorio);
    try {
      const inexistente = await login(app, {
        email: 'desconocido@locify.co',
        password: PASSWORD,
      });
      const incorrecta = await login(app, {
        email: 'admin@locify.co',
        password: 'Otra123!abcd',
      });

      assert.equal(inexistente.statusCode, 401);
      assert.equal(incorrecta.statusCode, 401);
      assert.deepEqual(inexistente.json(), incorrecta.json());
    } finally {
      await app.close();
    }
  });

  it('responde 403 si la cuenta está PENDIENTE de activación', async () => {
    const { app, repositorio } = await levantarApp();
    sembrarUsuario(repositorio, { estado: EstadoUsuario.PENDIENTE });
    try {
      const res = await login(app, { email: 'admin@locify.co', password: PASSWORD });

      assert.equal(res.statusCode, 403);
      assert.match(String(res.json().error), /no está activa/);
    } finally {
      await app.close();
    }
  });

  it('responde 400 si el cuerpo no cumple el esquema', async () => {
    const { app } = await levantarApp();
    try {
      const sinPassword = await login(app, { email: 'admin@locify.co' });
      const conExtra = await login(app, {
        email: 'admin@locify.co',
        password: PASSWORD,
        rol: 'ADMIN',
      });

      assert.equal(sinPassword.statusCode, 400);
      assert.equal(conExtra.statusCode, 400);
    } finally {
      await app.close();
    }
  });
});

describe('POST /api/operadores/:id/reinvitar (protegida)', () => {
  it('responde 401 sin token', async () => {
    const { app, repositorio, correo } = await levantarApp();
    const operador = sembrarUsuario(repositorio, {
      id: 'op-1',
      email: 'operador@locify.co',
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.PENDIENTE,
    });
    try {
      const res = await app.inject({
        method: 'POST',
        url: `/api/operadores/${operador.id}/reinvitar`,
      });

      assert.equal(res.statusCode, 401);
      assert.equal(correo.enviados.length, 0);
    } finally {
      await app.close();
    }
  });

  it('responde 401 con un token que no verifica', async () => {
    const { app, repositorio } = await levantarApp();
    const operador = sembrarUsuario(repositorio, {
      id: 'op-1',
      email: 'operador@locify.co',
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.PENDIENTE,
    });
    try {
      const res = await app.inject({
        method: 'POST',
        url: `/api/operadores/${operador.id}/reinvitar`,
        headers: { authorization: 'Bearer token-inventado' },
      });

      assert.equal(res.statusCode, 401);
    } finally {
      await app.close();
    }
  });

  it('responde 200 con el token ADMIN que emite el login', async () => {
    const { app, repositorio, correo } = await levantarApp();
    sembrarUsuario(repositorio); // admin ACTIVO
    const operador = sembrarUsuario(repositorio, {
      id: 'op-1',
      email: 'operador@locify.co',
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.PENDIENTE,
    });
    const tokenAnterior = operador.tokenInvitacion;

    try {
      const sesion = await login(app, { email: 'admin@locify.co', password: PASSWORD });
      assert.equal(sesion.statusCode, 200);
      const token = (sesion.json() as { token: string }).token;

      const res = await app.inject({
        method: 'POST',
        url: `/api/operadores/${operador.id}/reinvitar`,
        headers: { authorization: `Bearer ${token}` },
      });

      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.json(), { id: 'op-1', email: 'operador@locify.co' });
      assert.equal(correo.enviados.length, 1);
      assert.equal(correo.enviados[0]?.destino, 'operador@locify.co');
      assert.notEqual(repositorio.usuarios[1]?.tokenInvitacion, tokenAnterior);
    } finally {
      await app.close();
    }
  });

  it('responde 403 con un token válido de rol OPERADOR', async () => {
    const { app, repositorio, correo } = await levantarApp();
    sembrarUsuario(repositorio, {
      id: 'op-1',
      email: 'operador@locify.co',
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.ACTIVO,
    });
    sembrarUsuario(repositorio, {
      id: 'op-2',
      email: 'otro@locify.co',
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.PENDIENTE,
    });

    try {
      const sesion = await login(app, { email: 'operador@locify.co', password: PASSWORD });
      assert.equal(sesion.statusCode, 200);
      const token = (sesion.json() as { token: string }).token;

      const res = await app.inject({
        method: 'POST',
        url: '/api/operadores/op-2/reinvitar',
        headers: { authorization: `Bearer ${token}` },
      });

      assert.equal(res.statusCode, 403);
      assert.match(String(res.json().error), /permisos/);
      assert.equal(correo.enviados.length, 0);
    } finally {
      await app.close();
    }
  });
});
