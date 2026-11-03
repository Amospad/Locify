import { Reserva, EstadoReserva } from '../entities/Reserva.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import type { ReservaRepository } from '../ports/ReservaRepository.js';

export interface ConfirmarPagoPorWebhookDTO {
  type: string;
  data: {
    object: {
      id: string;
      metadata?: {
        reservaId?: string;
      };
    };
  };
}

export class ConfirmarPagoPorWebhookUseCase {
  constructor(private readonly reservaRepository: ReservaRepository) {}

  public async ejecutar(evento: ConfirmarPagoPorWebhookDTO): Promise<void> {
    if (evento.type !== 'payment_intent.succeeded') {
      return;
    }

    const paymentIntentId = evento.data.object.id;
    const reservaId = evento.data.object.metadata?.reservaId;

    if (!reservaId) {
      return;
    }

    const reserva = await this.reservaRepository.buscarPorId(reservaId);
    if (!reserva) {
      throw new ErrorNoEncontrado('Reserva no encontrada');
    }

    const reservaPagada = Reserva.reconstituir({
      id: reserva.id,
      usuarioId: reserva.usuarioId,
      sedeId: reserva.sedeId,
      modalidad: reserva.modalidad,
      estado: EstadoReserva.PAGADA,
      codigoQr: reserva.codigoQr,
      fechaEntrada: reserva.fechaEntrada,
      fechaSalida: reserva.fechaSalida,
    });

    await this.reservaRepository.guardar(reservaPagada);
  }
}
