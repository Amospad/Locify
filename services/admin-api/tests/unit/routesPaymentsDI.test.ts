import { test } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import { rutasPagos } from '../../src/interfaces/http/routes/payments.js';
import type { ReservaRepository } from '../../src/domain/ports/ReservaRepository.js';
import type { SedeRepository } from '../../src/domain/ports/SedeRepository.js';
import type { PaymentGateway } from '../../src/domain/ports/PaymentGateway.js';
import { Reserva, EstadoReserva } from '../../src/domain/entities/Reserva.js';
import { Sede, EstadoSede } from '../../src/domain/entities/Sede.js';

function crearMocks() {
  const reservaMock: Reserva = Reserva.reconstituir({
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

  let crearIntentFlag = false;
  const paymentGatewayMock: PaymentGateway = {
    async crearPaymentIntent(reservaId, monto, moneda, metadata) {
      crearIntentFlag = true;
      assert.equal(reservaId, 'res-1');
      assert.equal(monto, 5000);
      assert.equal(moneda, 'COP');
      assert.deepEqual(metadata, { reservaId: 'res-1' });
      return { clientSecret: 'secret_test_123' };
    },
    async reembolsar() { return { success: true }; },
  };

  return { reservaRepoMock, sedeRepoMock, paymentGatewayMock, get crearIntentLlamado() { return crearIntentFlag; } };
}

test('rutasPagos usa paymentGateway inyectado y no instancia Stripe internamente', async () => {
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

    console.log('status', res.statusCode, 'body', res.body);
    if (res.statusCode !== 200) {
      console.error('Response body:', res.body);
      console.error('Status:', res.statusCode);
    }

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { clientSecret: 'secret_test_123' });
    assert.equal(mocks.crearIntentLlamado, true);
  } finally {
    await app.close();
  }
});
