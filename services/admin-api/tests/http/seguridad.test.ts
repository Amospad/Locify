import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SignJWT } from 'jose';
import type { FastifyInstance } from 'fastify';

import { buildServer } from '../../src/interfaces/http/server.js';
import { AdminService } from '../../src/application/services/AdminService.js';
import { AuthService } from '../../src/application/services/AuthService.js';
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
import type { IniciadorDeSesion } from '../../src/interfaces/http/routes/auth.js';

const PASSWORD = 'Password123!';
const HASH_REAL = '$argon2id$v=19$m=65536,p=4,t=3$c2FsZGUtZmFrZQ$hash_falso';
const SECRETO = 'secreto-de-prueba-con-mas-de-32-caracteres';
const VIGENCIA = Math.floor(Date.now() / 1000) + 3600;

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
  enviados = 0;

  async enviarInvitacion(): Promise<void> {
    this.enviados += 1;
  }
}

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
}

/** Firmante usado SÓLO por el atacante de las pruebas. */
const claveAtacante = new TextEncoder().encode('secreto-ajeno-de-prueba-32-caracteres!!');

/**
 * Cadena completa real (JWT, hash, rutas): los ataques parten de la misma
 * superficie que un cliente legítimo. `authService` puede sustituirse para
 * simular fallos internos (500).
 */
async function levantarApp(
  authService?: IniciadorDeSesion,
): Promise<AppDePrueba> {
  const repositorio = new RepositorioEnMemoria();
  const hasher = new HasherFalso();

  const servicioTokens = new JwtService({
    secreto: SECRETO,
    emisor: 'locify-test',
    audiencia: 'locify-test',
    expiraEn: '1h',
  });

  return {
    app: await buildServer({
      db: dbFalsa,
      adminService: new AdminService(
        repositorio,
        new EmailEnMemoria(),
        new IdSecuencial(),
        RELOJ_FIJO,
        hasher,
      ),
      authService: authService ?? new AuthService(repositorio, hasher, servicioTokens),
      servicioTokens,
    }),
    repositorio,
  };
}

function sembrar(
  repositorio: RepositorioEnMemoria,
  datos: {
    id?: string;
    email?: string;
    rol?: RolUsuario;
    estado?: EstadoUsuario;
  } = {},
): Usuario {
  const usuario = Usuario.reconstituir({
    id: datos.id ?? 'op-1',
    email: datos.email ?? 'operador@locify.co',
    passwordHash: HASH_REAL,
    rol: datos.rol ?? RolUsuario.OPERADOR,
    estado: datos.estado ?? EstadoUsuario.PENDIENTE,
  });

  repositorio.usuarios.push(usuario);
  return usuario;
}

function login(app: FastifyInstance, body: unknown) {
  return app.inject({ method: 'POST', url: '/api/auth/login', payload: body });
}

async function reinvitar(
  app: FastifyInstance,
  id: string,
  token?: string,
): Promise<{ statusCode: number; body: string }> {
  const res = await app.inject({
    method: 'POST',
    url: `/api/operadores/${id}/reinvitar`,
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });

  return { statusCode: res.statusCode, body: res.body };
}

async function tokenAtacante(
  campos: Partial<{ iss: string; aud: string; exp: number }>,
  secreto: Uint8Array,
): Promise<string> {
  return new SignJWT({
    email: 'operador@locify.co',
    rol: 'ADMIN',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('op-1')
    .setIssuedAt()
    .setIssuer(campos.iss ?? 'locify-test')
    .setAudience(campos.aud ?? 'locify-test')
    .setExpirationTime(campos.exp ?? VIGENCIA)
    .sign(secreto);
}

describe('Fase 2 · auditoría de seguridad ofensiva (Red Team)', () => {
  describe('JWT: falsificaciones contra la ruta protegida', () => {
    it('AN-A1: token firmado con el algoritmo "none" → 401', async () => {
      const { app, repositorio } = await levantarApp();
      const operador = sembrar(repositorio);

      const payload = Buffer.from(
        JSON.stringify({
          sub: operador.id,
          email: operador.email,
          rol: 'ADMIN',
          iss: 'locify-test',
          aud: 'locify-test',
          exp: VIGENCIA,
        }),
      ).toString('base64url');
      const sinFirma = `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${payload}.`;

      try {
      const ataque = await reinvitar(app, operador.id, sinFirma);
      assert.equal(ataque.statusCode, 401);
    } finally {
        await app.close();
      }
    });

    it('AN-A2: token firmado con un secreto ajeno → 401', async () => {
      const { app, repositorio } = await levantarApp();
      const operador = sembrar(repositorio);
      const token = await tokenAtacante({}, claveAtacante);

      try {
        assert.equal((await reinvitar(app, operador.id, token)).statusCode, 401);
      } finally {
        await app.close();
      }
    });

    it('AN-A3: token expirado, con signatura y claims correctos → 401', async () => {
      const { app, repositorio } = await levantarApp();
      const operador = sembrar(repositorio);
      const clave = new TextEncoder().encode(SECRETO);
      const token = await tokenAtacante(
        { exp: Math.floor(Date.now() / 1000) - 60 },
        clave,
      );

      try {
        assert.equal((await reinvitar(app, operador.id, token)).statusCode, 401);
      } finally {
        await app.close();
      }
    });

    it('AN-A4: token con emisor o audiencia ajenos → 401', async () => {
      const { app, repositorio } = await levantarApp();
      const operador = sembrar(repositorio);
      const clave = new TextEncoder().encode(SECRETO);

      try {
        const emisorAjeno = await tokenAtacante({ iss: 'emisor-maligno' }, clave);
        const audienciaAjena = await tokenAtacante({ aud: 'servicio-maligno' }, clave);

        assert.equal((await reinvitar(app, operador.id, emisorAjeno)).statusCode, 401);
        assert.equal((await reinvitar(app, operador.id, audienciaAjena)).statusCode, 401);
      } finally {
        await app.close();
      }
    });

    it('AN-A5: payload alterado manteniendo la firma original → 401', async () => {
      const { app, repositorio } = await levantarApp();
      sembrar(repositorio, {
        id: 'op-1',
        email: 'operador@locify.co',
        rol: RolUsuario.OPERADOR,
        estado: EstadoUsuario.ACTIVO,
      });
      sembrar(repositorio, {
        id: 'op-2',
        email: 'pendiente@locify.co',
        rol: RolUsuario.OPERADOR,
        estado: EstadoUsuario.PENDIENTE,
      });

      try {
        const sesion = await login(app, {
          email: 'operador@locify.co',
          password: PASSWORD,
        });
        assert.equal(sesion.statusCode, 200);
        const [cabeza, , firma] = ((sesion.json() as { token: string }).token).split('.');

        // El atacante reescribe el payload a rol ADMIN (y sub op-1), deja la
        // firma del OPERADOR intacta y exige reinvitar un operador.
        const falsificado = Buffer.from(
          JSON.stringify({
            email: 'operador@locify.co',
            rol: 'ADMIN',
            sub: 'op-1',
            iat: Math.floor(Date.now() / 1000),
          }),
        ).toString('base64url');

        const ataque = await reinvitar(app, 'op-2', `${cabeza}.${falsificado}.${firma}`);
        assert.equal(ataque.statusCode, 401);
      } finally {
        await app.close();
      }
    });

    it('AN-A6: token sin el claim sub → 401 (el payload se valida a mano)', async () => {
      const { app, repositorio } = await levantarApp();
      const operador = sembrar(repositorio);
      const clave = new TextEncoder().encode(SECRETO);
      const mutilado = await new SignJWT({ email: 'operador@locify.co', rol: 'ADMIN' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('locify-test')
        .setAudience('locify-test')
        .setExpirationTime('1h')
        .sign(clave);

      try {
        assert.equal((await reinvitar(app, operador.id, mutilado)).statusCode, 401);
      } finally {
        await app.close();
      }
    });
  });

  describe('Cuerpos hostiles', () => {
    it('AN-B1: el tipo del email es un objeto de inyección ({"$gt":""}) → 400', async () => {
      const { app } = await levantarApp();
      try {
        const res = await login(app, { email: { $gt: '' }, password: PASSWORD } as never);
        assert.equal(res.statusCode, 400);
      } finally {
        await app.close();
      }
    });

    it('AN-B2: inyección SQL en el email → 401 genérico, sin fuga de detalles', async () => {
      const { app, repositorio } = await levantarApp();
      sembrar(repositorio, {
        rol: RolUsuario.ADMIN,
        estado: EstadoUsuario.ACTIVO,
      });

      try {
        const res = await login(app, {
          email: "admin@locify.co' OR '1'='1'; DROP TABLE usuario;--",
          password: PASSWORD,
        });

        assert.equal(res.statusCode, 401);
        assert.deepEqual(res.json(), {
          error: 'Email o contraseña incorrectos.',
        });
        assert.equal(res.body.includes('Prisma'), false);
        assert.equal(res.body.toLowerCase().includes('sql'), false);
      } finally {
        await app.close();
      }
    });

    it('AN-B3: payload gigante (32 KiB) → 413 y no consumo de validación', async () => {
      const { app } = await levantarApp();
      try {
        const res = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          headers: { 'content-type': 'application/json' },
          payload: JSON.stringify({
            email: 'admin@locify.co',
            password: 'x'.repeat(40 * 1024),
          }),
        });

        assert.equal(res.statusCode, 413);
      } finally {
        await app.close();
      }
    });
  });

  describe('Enumeración y fuerza bruta', () => {
    it('AN-C1: el 6.º intento de login en un minuto → 429', async () => {
      const { app, repositorio } = await levantarApp();
      sembrar(repositorio, { rol: RolUsuario.ADMIN, estado: EstadoUsuario.ACTIVO });

      try {
        let ultima = 0;
        for (let i = 0; i < 6; i += 1) {
          const res = await login(app, { email: 'admin@locify.co', password: `Falla${i}1234!` });
          ultima = res.statusCode;
        }

        assert.equal(ultima, 429);
      } finally {
        await app.close();
      }
    });

    it('AN-C2: X-Forwarded-For falsificado no rota la llave del límite', async () => {
      const { app, repositorio } = await levantarApp();
      sembrar(repositorio, { rol: RolUsuario.ADMIN, estado: EstadoUsuario.ACTIVO });

      try {
        for (let i = 0; i < 5; i += 1) {
          const res = await app.inject({
            method: 'POST',
            url: '/api/auth/login',
            payload: { email: 'admin@locify.co', password: `Falla${i}1234!` },
            headers: { 'x-forwarded-for': `10.0.0.${i + 1}` },
          });
          assert.equal(res.statusCode, 401);
        }

        const sexto = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: { email: 'admin@locify.co', password: 'Falla59999!' },
          headers: { 'x-forwarded-for': '10.0.0.99' },
        });
        // Sin trustProxy la IP de la llave es la del par TCP, no la cabecera:
        // rotarla en el cliente no evade el límite.
        assert.equal(sexto.statusCode, 429);
      } finally {
        await app.close();
      }
    });

    it('AN-C3: /health no consume la cuota del rate limit (monitor legítimo)', async () => {
      const { app, repositorio } = await levantarApp();
      sembrar(repositorio, { rol: RolUsuario.ADMIN, estado: EstadoUsuario.ACTIVO });

      try {
        for (let i = 0; i < 6; i += 1) {
          await login(app, { email: 'admin@locify.co', password: `Falla${i}1234!` });
        }

        const salud = await app.inject({ method: 'GET', url: '/health' });
        assert.equal(salud.statusCode, 200);
      } finally {
        await app.close();
      }
    });
  });

  describe('Configuración HTTP y cabeceras', () => {
    it('AN-D1: no se expone X-Powered-By (ni en éxito ni en error)', async () => {
      const { app } = await levantarApp();
      try {
        const ok = await app.inject({ method: 'GET', url: '/health' });
        const malo = await app.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: { email: 'x@y.c', password: 'z' },
        });

        assert.equal(ok.headers['x-powered-by'], undefined);
        assert.equal(malo.headers['x-powered-by'], undefined);
      } finally {
        await app.close();
      }
    });

    it('AN-D2: helmet fija las cabeceras mínimas de seguridad', async () => {
      const { app } = await levantarApp();
      try {
        const res = await app.inject({ method: 'GET', url: '/health' });

        assert.ok(res.headers['content-security-policy']);
        assert.equal(res.headers['x-content-type-options'], 'nosniff');
        assert.ok(
          res.headers['x-frame-options'] ||
            String(res.headers['content-security-policy']).includes('frame-ancestors'),
        );
        assert.ok(res.headers['cross-origin-resource-policy']);
      } finally {
        await app.close();
      }
    });

    it('AN-D3: CORS cerrado por defecto, incluso con Origin foráneo', async () => {
      const { app } = await levantarApp();
      try {
        const res = await app.inject({
          method: 'GET',
          url: '/health',
          headers: { origin: 'https://maligno.example' },
        });

        assert.equal(res.headers['access-control-allow-origin'], undefined);
      } finally {
        await app.close();
      }
    });
    it('AN-D4: con trustProxy la llave sí es la IP del cliente (proxy confiable)', async () => {
      const repositorioProxy = new RepositorioEnMemoria();
      const hasherProxy = new HasherFalso();
      const servicioTokens = new JwtService({
        secreto: SECRETO,
        emisor: 'locify-test',
        audiencia: 'locify-test',
        expiraEn: '1h',
      });
      const appProxy = await buildServer(
        {
          db: dbFalsa,
          adminService: new AdminService(
            repositorioProxy,
            new EmailEnMemoria(),
            new IdSecuencial(),
            RELOJ_FIJO,
            hasherProxy,
          ),
          authService: new AuthService(repositorioProxy, hasherProxy, servicioTokens),
          servicioTokens,
        },
        { trustProxy: true },
      );
      sembrar(repositorioProxy, { rol: RolUsuario.ADMIN, estado: EstadoUsuario.ACTIVO });

      try {
        for (let i = 0; i < 5; i += 1) {
          const res = await appProxy.inject({
            method: 'POST',
            url: '/api/auth/login',
            payload: { email: 'admin@locify.co', password: `Falla${i}1234!` },
            headers: { 'x-forwarded-for': '10.0.0.1' },
          });
          assert.equal(res.statusCode, 401);
        }

        // Tras un proxy real la misma IP de cliente comparte cuota: 6.º → 429.
        const misma = await appProxy.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: { email: 'admin@locify.co', password: 'Falla5999!' },
          headers: { 'x-forwarded-for': '10.0.0.1' },
        });
        assert.equal(misma.statusCode, 429);

        // Otra IP de cliente tiene su propia cuota → 401, no 429.
        const otra = await appProxy.inject({
          method: 'POST',
          url: '/api/auth/login',
          payload: { email: 'admin@locify.co', password: 'Falla6999!' },
          headers: { 'x-forwarded-for': '10.0.0.2' },
        });
        assert.equal(otra.statusCode, 401);
      } finally {
        await appProxy.close();
      }
    });
  });

  describe('Fugas de información', () => {
    it('AN-E1: fallo interno de base de datos → 500 genérico, sin stack ni detalles', async () => {
      const authService: IniciadorDeSesion = {
        iniciarSesion: async () => {
          throw new Error(
            "PrismaClientKnownRequestError: ECONNREFUSED 127.0.0.1:5432 — can't reach database server",
          );
        },
      };

      const { app } = await levantarApp(authService);
      try {
        const res = await login(app, { email: 'admin@locify.co', password: PASSWORD });

        assert.equal(res.statusCode, 500);
        assert.deepEqual(res.json(), { error: 'Error interno del servidor.' });
        assert.equal(res.body.includes('Prisma'), false);
        assert.equal(res.body.includes('ECONNREFUSED'), false);
        assert.equal(res.body.includes('stack'), false);
      } finally {
        await app.close();
      }
    });
  });
});
