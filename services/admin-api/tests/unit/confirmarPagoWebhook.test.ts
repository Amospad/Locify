import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConfirmarPagoPorWebhookUseCase } from '../../src/domain/use-cases/ConfirmarPagoPorWebhook.js';
import { Reserva, EstadoReserva, ModalidadReserva } from '../../src/domain/entities/Reserva.js';

test('ConfirmarPagoPorWebhook actualiza reserva a PAGADA al recibir payment_intent.succeeded', async () => {
  const reservaId = 'reserva-123';
  const paymentIntentId = 'pi_abc123';

  const reservaOriginal = Reserva.reconstituir({
    id: reservaId,
    usuarioId: 'user-1',
    sedeId: 'sede-1',
    modalidad: ModalidadReserva.EXPRES,
    estado: EstadoReserva.ACTIVA,
    codigoQr: 'ABC123DEF456',
    fechaEntrada: new Date('2026-10-30T12:00:00Z'),
    fechaSalida: undefined,
  });

  const buscarPorId = async (id: string) => {
    assert.equal(id, reservaId);
    return reservaOriginal;
  };

  let guardado: Reserva | null = null;
  const guardar = async (reserva: Reserva) => {
    guardado = reserva;
  };

  const reservaRepository = { buscarPorId, guardar };

  const useCase = new ConfirmarPagoPorWebhookUseCase(reservaRepository as any);

  const evento = {
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: paymentIntentId,
        metadata: {
          reservaId,
        },
      },
    },
  };

  await useCase.ejecutar(evento as any);

  assert.ok(guardado, 'Se debe llamar a guardar');
  assert.equal(guardado!.id, reservaId);
  assert.equal(guardado!.estado, EstadoReserva.PAGADA);
});
