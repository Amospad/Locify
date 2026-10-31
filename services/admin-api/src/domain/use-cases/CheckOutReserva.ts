import { Reserva, EstadoReserva } from '../entities/Reserva.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import type { ReservaRepository } from '../ports/ReservaRepository.js';
import type { Reloj } from '../ports/Reloj.js';

export interface CheckOutReservaDTO {
  reservaId: string;
  operadorId: string;
}

export interface ReservaCheckOut {
  id: string;
  codigoQr: string;
  usuarioId: string;
  sedeId: string;
  fechaEntrada: Date;
  fechaSalida: Date;
  duracionMinutos: number;
}

export class CheckOutReservaUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly reloj: Reloj,
  ) {}

  public async ejecutar(dto: CheckOutReservaDTO): Promise<ReservaCheckOut> {
    // 1. Buscar la reserva por ID
    const reserva = await this.reservaRepository.buscarPorId(dto.reservaId);
    if (!reserva) {
      throw new ErrorNoEncontrado('Reserva no encontrada');
    }

    // 2. Validar que la reserva está ACTIVA
    if (reserva.estado !== EstadoReserva.ACTIVA) {
      throw new ErrorDeValidacion(
        `Solo se puede hacer check-out de una reserva ACTIVA (estado: ${reserva.estado})`,
      );
    }

    // 3. Calcular duración
    const fechaSalida = this.reloj.ahora();
    const duracionMs = fechaSalida.getTime() - reserva.fechaEntrada.getTime();
    const duracionMinutos = Math.max(1, Math.ceil(duracionMs / (1000 * 60)));

    // 4. Finalizar la reserva (cambia estado a FINALIZADA y pone fechaSalida)
    const reservaFinalizada = reserva.finalizar(fechaSalida);

    // 5. Persistir
    await this.reservaRepository.guardar(reservaFinalizada);

    return {
      id: reservaFinalizada.id,
      codigoQr: reservaFinalizada.codigoQr,
      usuarioId: reservaFinalizada.usuarioId,
      sedeId: reservaFinalizada.sedeId,
      fechaEntrada: reservaFinalizada.fechaEntrada,
      fechaSalida: reservaFinalizada.fechaSalida!,
      duracionMinutos,
    };
  }
}