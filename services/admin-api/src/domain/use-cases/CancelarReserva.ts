import { Reserva, EstadoReserva, ModalidadReserva } from '../entities/Reserva.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import type { ReservaRepository } from '../ports/ReservaRepository.js';
import type { Reloj } from '../ports/Reloj.js';
import type { PaymentGateway } from '../ports/PaymentGateway.js';

export interface CancelarReservaDTO {
  reservaId: string;
}

export class CancelarReservaUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly reloj: Reloj,
    private readonly paymentGateway?: PaymentGateway,
  ) {}

  public async ejecutar(dto: CancelarReservaDTO): Promise<{ id: string; estado: EstadoReserva }> {
    const reserva = await this.reservaRepository.buscarPorId(dto.reservaId);
    if (!reserva) {
      throw new ErrorNoEncontrado('La reserva no existe');
    }

    if (!reserva.estaActiva()) {
      throw new ErrorDeValidacion('Solo se puede cancelar una reserva ACTIVA');
    }

    // Regla de tiempo: solo reembolsar si faltan > 30 min para la entrada
    const ahora = this.reloj.ahora();
    const tiempoRestante = reserva.fechaEntrada.getTime() - ahora.getTime();
    const treintaMinutos = 30 * 60 * 1000;

    if (reserva.modalidad === ModalidadReserva.GARANTIZADA) {
      const puedeReembolsar = tiempoRestante > treintaMinutos;
      
      if (puedeReembolsar && this.paymentGateway) {
        // Simulación: necesitaríamos el transaccionId guardado
        // Por simplicidad, simulamos reembolso
        await this.paymentGateway.reembolsar('dummy-tx-id', 0);
      }
    }

    const reservaCancelada = reserva.cancelar();
    await this.reservaRepository.guardar(reservaCancelada);

    return {
      id: reservaCancelada.id,
      estado: reservaCancelada.estado,
    };
  }
}
