import { Reserva, EstadoReserva } from '../entities/Reserva.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import type { ReservaRepository } from '../ports/ReservaRepository.js';
import type { PaymentGateway } from '../ports/PaymentGateway.js';

export interface ReembolsarReservaDTO {
  reservaId: string;
  monto?: number;
}

export class ReembolsarReservaUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  public async ejecutar(dto: ReembolsarReservaDTO): Promise<{ id: string; estado: EstadoReserva }> {
    const reserva = await this.reservaRepository.buscarPorId(dto.reservaId);
    if (!reserva) {
      throw new ErrorNoEncontrado('La reserva no existe');
    }

    // Obtener paymentIntentId desde la reserva (propiedad extendida para auditoría)
    const paymentIntentId = (reserva as any).paymentIntentId as string | undefined;
    if (!paymentIntentId) {
      throw new ErrorDeValidacion('La reserva no tiene paymentIntentId asociado');
    }

    if (reserva.estado !== EstadoReserva.PAGADA) {
      throw new ErrorDeValidacion('Solo se puede reembolsar una reserva PAGADA');
    }

    const resultado = await this.paymentGateway.reembolsar(paymentIntentId, dto.monto);
    if (!resultado?.success) {
      throw new ErrorDeValidacion('El reembolso falló en el gateway de pagos');
    }

    const reservaReembolsada = Reserva.reconstituir({
      id: reserva.id,
      usuarioId: reserva.usuarioId,
      sedeId: reserva.sedeId,
      modalidad: reserva.modalidad,
      estado: EstadoReserva.CANCELADA,
      codigoQr: reserva.codigoQr,
      fechaEntrada: reserva.fechaEntrada,
      fechaSalida: reserva.fechaSalida,
    });

    await this.reservaRepository.guardar(reservaReembolsada);

    return {
      id: reservaReembolsada.id,
      estado: reservaReembolsada.estado,
    };
  }
}
