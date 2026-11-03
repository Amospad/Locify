import { test } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import { rutasPagos } from '../../src/interfaces/http/routes/payments.js';
import type { ReservaRepository } from '../../src/domain/ports/ReservaRepository.js';
import type { SedeRepository } from '../../src/domain/ports/SedeRepository.js';
import type { PaymentGateway } from '../../src/domain/ports/PaymentGateway.js';
import { Reserva, EstadoReserva } from '../../src/domain/entities/Reserva.js';
import { Sede, EstadoSede } from '../../src/domain/entities/Sede.js';
import { StripePaymentGateway } from '../../src/infrastructure/payments/StripePaymentGateway.js';

function crearMocks() {
  const reservaMock = Reserva.reconstituir({
    id: 'res-1',
    usuarioId: 'usr-1',
    sedeId: 'sede-1',
    modalidad: 'GARANTIZADA' as any,
    estado: EstadoReserva.ACTIVA,
    codigoQr: 'ABCDEF123456',
    fechaEntrada: new Date('2026-11-01T10:00:00Z'),
  });

  const sedeMock = Sede.reconstituir({
    id: 'sede-1',
    nombre: 'Sede',
    direccion: 'Calle',
    latitud: 0,
    longitud: 0,
    capacidadTotal: 10,
    precioHora: 5000,
    estado: EstadoSede.ACTIVA,
    operadorId: 'op-1',
  });

  const reservaRepoMock: ReservaRepository = {
    async buscarPorId(id) { return id === 'res-1' ? reservaMock : null; },
    async guardar() {},
    async buscarActivaPorUsuario() { return null; },
    async buscarPorCodigoQr() { return null; },
    async buscarActivasPorSede() { return []; },
    async buscarPorUsuario() { return []; },
  };

  const sedeRepoMock: SedeRepository = {
    async buscarPorId(id) { return id === 'sede-1' ? sedeMock : null; },
    async guardar() {},
    async listarTodas() { return []; },
    async listarActivas() { return []; },
  };

  const llamada = { reservaId: '' as string, monto: 0, moneda: '', metadata: {} as Record<string, unknown> };
  const paymentGatewayMock: PaymentGateway = {
    async crearPaymentIntent(reservaId, monto, moneda, metadata) {
      llamada.reservaId = reservaId;
      llamada.monto = monto;
      llamada.moneda = moneda;
      llamada.metadata = metadata ?? {};
      return { clientSecret: 'secret_test_123' };
    },
    async reembolsar() { return { success: true }; },
  };

  return { reservaRepoMock, sedeRepoMock, paymentGatewayMock, llamada };
}

test('POST /api/payments/create-intent valida reservaId con Zod y rechaza inválido', async () => {
  const mocks = crearMocks();
  const app = Fastify();
  try {
    await app.register(rutasPagos, {
      reservaRepository: mocks.reservaRepoMock,
      sedeRepository: mocks.sedeRepoMock,
      paymentGateway: mocks.paymentGatewayMock,
    });

    const resInvalid = await app.inject({
      method: 'POST',
      url: '/api/payments/create-intent',
      payload: { reservaId: '' },
    });

    assert.equal(resInvalid.statusCode, 400, 'Debe rechazar reservaId vacío');

    const resMissing = await app.inject({
      method: 'POST',
      url: '/api/payments/create-intent',
      payload: {},
    });

    assert.equal(resMissing.statusCode, 400, 'Debe rechazar body sin reservaId');
  } finally {
    await app.close();
  }
});

test('POST /api/payments/create-intent crea PaymentIntent con metadata y devuelve clientSecret', async () => {
  const mocks = crearMocks();
  const app = Fastify();
  try {
    await app.register(rutasPagos, {
      reservaRepository: mocks.reservaRepoMock,
      sedeRepository: mocks.sedeRepoMock,
      paymentGateway: mocks.paymentGatewayMock,
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/payments/create-intent',
      payload: { reservaId: 'res-1' },
    });

    assert.equal(res.statusCode, 200);
    const body = res.json();
    assert.equal(body.clientSecret, 'secret_test_123');

    assert.equal(mocks.llamada.reservaId, 'res-1');
    assert.equal(mocks.llamada.monto, 5000);
    assert.equal(mocks.llamada.moneda, 'COP');
    assert.deepEqual(mocks.llamada.metadata, { reservaId: 'res-1' });
  } finally {
    await app.close();
  }
});

test('StripePaymentGateway usa clave de idempotencia al crear PaymentIntent', async () => {
  const gateway = new StripePaymentGateway('sk_test_dummy');
  let capturedOptions: any = null;
  const mockPaymentIntents = {
    create: async (params: any, options?: any) => {
      capturedOptions = options;
      assert.equal(params.amount, 1000000);
      assert.equal(params.currency, 'cop');
      assert.equal(params.metadata?.reservaId, 'res-1');
      return { client_secret: 'pi_123_secret_abc' };
    },
  };
  (gateway as any).stripe = {
    paymentIntents: mockPaymentIntents,
  };

  await gateway.crearPaymentIntent('res-1', 10000, 'COP', { origen: 'web' });

  assert.ok(capturedOptions, 'Debe pasar options a Stripe');
  assert.ok(capturedOptions.idempotencyKey, 'Debe usar clave de idempotencia');
  assert.equal(capturedOptions.idempotencyKey, 'pi_res-1');
});
