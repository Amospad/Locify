import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ReembolsarReservaUseCase } from '../../src/domain/use-cases/ReembolsarReserva.js';
import { Reserva, EstadoReserva, ModalidadReserva } from '../../src/domain/entities/Reserva.js';
import type { ReservaRepository } from '../../src/domain/ports/ReservaRepository.js';
import type { PaymentGateway } from '../../src/domain/ports/PaymentGateway.js';

test('ReembolsarReserva llama a paymentGateway.reembolsar y actualiza estado a CANCELADA', async () => {
  const reservaId = 'reserva-123';
  const paymentIntentId = 'pi_test_123';
  const monto = 15000;

  const reservaOriginal = Reserva.reconstituir({
    id: reservaId,
    usuarioId: 'user-1',
    sedeId: 'sede-1',
    modalidad: ModalidadReserva.GARANTIZADA,
    estado: EstadoReserva.PAGADA,
    codigoQr: 'ABC123DEF456',
    fechaEntrada: new Date('2026-11-01T12:00:00Z'),
    fechaSalida: undefined,
  });
  // Simular paymentIntentId en la reserva
  (reservaOriginal as any).paymentIntentId = paymentIntentId;

  let buscarLlamado = false;
  let guardarLlamado = false;
  let reservaGuardada: Reserva | null = null;
  let reembolsoLlamado = false;
  let reembolsoArgs: { paymentIntentId: string; monto?: number } | null = null;

  const reservaRepository: ReservaRepository = {
    async buscarPorId(id: string) {
      buscarLlamado = true;
      assert.equal(id, reservaId);
      return reservaOriginal;
    },
    async guardar(reserva: Reserva) {
      guardarLlamado = true;
      reservaGuardada = reserva;
    },
    async buscarActivaPorUsuario() { return null; },
    async buscarPorCodigoQr() { return null; },
    async buscarActivasPorSede() { return []; },
    async buscarPorUsuario() { return []; },
  };

  const paymentGateway: PaymentGateway = {
    async crearPaymentIntent() { throw new Error('no usado'); },
    async reembolsar(pid: string, m?: number) {
      reembolsoLlamado = true;
      reembolsoArgs = { paymentIntentId: pid, monto: m };
      return { success: true };
    },
  };

  const useCase = new ReembolsarReservaUseCase(reservaRepository as any, paymentGateway as any);
  await useCase.ejecutar({ reservaId, monto });

  assert.ok(buscarLlamado, 'Debería buscar la reserva');
  assert.ok(reembolsoLlamado, 'Debería llamar a paymentGateway.reembolsar');
  assert.equal(reembolsoArgs?.paymentIntentId, paymentIntentId);
  assert.equal(reembolsoArgs?.monto, monto);
  assert.ok(guardarLlamado, 'Debería guardar la reserva');
  assert.ok(reservaGuardada, 'Reserva guardada debe existir');
  assert.equal(reservaGuardada!.id, reservaId);
  assert.equal(reservaGuardada!.estado, EstadoReserva.CANCELADA);
});
