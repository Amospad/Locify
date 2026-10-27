import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '../../src/interfaces/http/server.js';
import type { ConsultadorDeBaseDeDatos } from '../../src/application/ports/ConsultadorDeBaseDeDatos.js';

/** Doble de la base de datos: no abre conexiones, responde lo que el test diga. */
function dbFalsa(consultar: () => Promise<readonly unknown[]>): ConsultadorDeBaseDeDatos {
  return {
    consultar,
    cerrar: async () => {},
  };
}

async function servidorCon(db: ConsultadorDeBaseDeDatos): Promise<FastifyInstance> {
  // Sin `listen`: `inject` atiende la petición en memoria y no ocupa puerto.
  return buildServer({ db });
}

test('GET /health responde 200 cuando la base responde', async () => {
  const app = await servidorCon(dbFalsa(async () => [{ ok: 1 }]));
  try {
    const res = await app.inject({ method: 'GET', url: '/health' });

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { status: 'ok', db: 'up' });
  } finally {
    await app.close();
  }
});

test('GET /health responde 503 cuando la base falla', async () => {
  const app = await servidorCon(
    dbFalsa(async () => {
      throw new Error('connection refused');
    }),
  );
  try {
    const res = await app.inject({ method: 'GET', url: '/health' });

    assert.equal(res.statusCode, 503);
    assert.deepEqual(res.json(), { status: 'error', db: 'down' });
    // El detalle interno no se filtra al cliente.
    assert.equal(res.body.includes('connection refused'), false);
  } finally {
    await app.close();
  }
});

test('GET /health responde 503 si la consulta no devuelve filas', async () => {
  const app = await servidorCon(dbFalsa(async () => []));
  try {
    const res = await app.inject({ method: 'GET', url: '/health' });

    assert.equal(res.statusCode, 503);
    assert.deepEqual(res.json(), { status: 'error', db: 'down' });
  } finally {
    await app.close();
  }
});

test('el servidor registra helmet', async () => {
  const app = await servidorCon(dbFalsa(async () => [{ ok: 1 }]));
  try {
    const res = await app.inject({ method: 'GET', url: '/health' });

    assert.equal(res.headers['x-content-type-options'], 'nosniff');
  } finally {
    await app.close();
  }
});
