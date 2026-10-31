import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CrearReservaUseCase } from '../../src/domain/use-cases/CrearReserva.js';
import { CancelarReservaUseCase } from '../../src/domain/use-cases/CancelarReserva.js';
import { ModalidadReserva, EstadoReserva, Reserva } from '../../src/domain/entities/Reserva.js';
import { Sede, EstadoSede } from '../../src/domain/entities/Sede.js';
import { ErrorDeValidacion } from '../../src/domain/errors/ErrorDeValidacion.js';
import { PagoRechazadoError } from '../../src/domain/errors/PagoRechazadoError.js';
import { MockPaymentGateway } from '../../src/infrastructure/payments/MockPaymentGateway.js';
import type { ReservaRepository } from '../../src/domain/ports/ReservaRepository.js';
import type { SedeRepository } from '../../../domain/ports/SedeRepository.js';

class MockReservaRepo implements ReservaRepository {
  public reservas: Reserva[] = [];

  async guardar(reserva: Reserva): Promise<void> {
    const idx = this.reservas.findIndex(r => r.id === reserva.id);
    if (idx >= 0) this.reservas[idx] = reserva;
    else this.reservas.push(reserva);
  }

  async buscarPorId(id: string): Promise<Reserva | null> {
    return this.reservas.find(r => r.id === id) ?? null;
  }

  async buscarActivaPorUsuario(usuarioId: string): Promise<Reserva | null> {
    return this.reservas.find(r => r.usuarioId === usuarioId && r.estaActiva()) ?? null;
  }

  async buscarPorCodigoQr(codigoQr: string): Promise<Reserva | null> {
    return this.reservas.find(r => r.codigoQr === codigoQr) ?? null;
  }

  async listarPorUsuario(usuarioId: string): Promise<Reserva[]> {
    return this.reservas.filter(r => r.usuarioId === usuarioId);
  }

  async listarPorSede(sedeId: string): Promise<Reserva[]> {
    return this.reservas.filter(r => r.sedeId === sedeId);
  }

  async contarActivasPorSede(sedeId: string): Promise<number> {
    return this.reservas.filter(r => r.sedeId === sedeId && r.estaActiva()).length;
  }
}

class MockSedeRepo implements SedeRepository {
  public sedes: Sede[] = [];

  async buscarPorId(id: string): Promise<Sede | null> {
    return this.sedes.find(s => s.id === id) ?? null;
  }

  async guardar(sede: Sede): Promise<void> {
    this.sedes.push(sede);
  }

  async listarTodas(): Promise<Sede[]> {
    return this.sedes;
  }

  async listarActivas(): Promise<Sede[]> {
    return this.sedes.filter(s => s.estado === EstadoSede.ACTIVA);
  }
}

describe('Flujo de Pagos y Cancelación (RF-14, RF-16, RF-19)', () => {
  const generadorId = { generar: () => 'reserva-1' };
  const reloj = { ahora: () => new Date('2026-10-30T10:00:00Z') };
  const paymentGateway = new MockPaymentGateway();

  const sedePrueba = Sede.reconstituir({
    id: 'sede-1',
    nombre: 'Sede Central',
    direccion: 'Calle 10',
    latitud: 6.2,
    longitud: -75.5,
    capacidadTotal: 10,
    precioHora: 5000,
    estado: EstadoSede.ACTIVA,
    operadorId: 'op-1',
  });

  it('crea reserva GARANTIZADA exitosamente cuando el pago es procesado', async () => {
    const reservaRepo = new MockReservaRepo();
    const sedeRepo = new MockSedeRepo();
    sedeRepo.sedes.push(sedePrueba);

    const useCase = new CrearReservaUseCase(reservaRepo, sedeRepo, generadorId, reloj, paymentGateway);

    const resultado = await useCase.ejecutar({
      usuarioId: 'usr-1',
      sedeId: 'sede-1',
      modalidad: ModalidadReserva.GARANTIZADA,
      tokenTarjeta: 'tok_visa_123',
    });

    assert.equal(resultado.id, 'reserva-1');
    assert.equal(reservaRepo.reservas.length, 1);
    assert.equal(reservaRepo.reservas[0]?.modalidad, ModalidadReserva.GARANTIZADA);
  });

  it('falla reserva GARANTIZADA si no incluye token de tarjeta', async () => {
    const reservaRepo = new MockReservaRepo();
    const sedeRepo = new MockSedeRepo();
    sedeRepo.sedes.push(sedePrueba);

    const useCase = new CrearReservaUseCase(reservaRepo, sedeRepo, generadorId, reloj, paymentGateway);

    await assert.rejects(
      async () => {
        await useCase.ejecutar({
          usuarioId: 'usr-1',
          sedeId: 'sede-1',
          modalidad: ModalidadReserva.GARANTIZADA,
        });
      },
      ErrorDeValidacion,
    );
  });

  it('cancela reserva ACTIVA correctamente', async () => {
    const reservaRepo = new MockReservaRepo();
    const reserva = Reserva.crear({
      id: 'res-1',
      usuarioId: 'usr-1',
      sedeId: 'sede-1',
      modalidad: ModalidadReserva.EXPRES,
      codigoQr: 'ABC123XYZ456',
      fechaEntrada: new Date('2026-10-30T11:00:00Z'), // > 30 min en el futuro
    });
    reservaRepo.guardar(reserva);

    const useCase = new CancelarReservaUseCase(reservaRepo, reloj, paymentGateway);
    const resultado = await useCase.ejecutar({ reservaId: 'res-1' });

    assert.equal(resultado.estado, EstadoReserva.CANCELADA);
    assert.equal(reservaRepo.reservas[0]?.estado, EstadoReserva.CANCELADA);
  });
});
