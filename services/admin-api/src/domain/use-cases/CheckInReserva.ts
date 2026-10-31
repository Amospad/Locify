import { Reserva, EstadoReserva } from '../entities/Reserva.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import type { ReservaRepository } from '../ports/ReservaRepository.js';
import type { Reloj } from '../ports/Reloj.js';

export interface CheckInReservaDTO {
  codigoQr: string;
  operadorId: string;
}

export interface ReservaCheckIn {
  id: string;
  codigoQr: string;
  usuarioId: string;
  sedeId: string;
  modalidad: string;
  fechaEntrada: Date;
}

export class CheckInReservaUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly reloj: Reloj,
  ) {}

  public async ejecutar(dto: CheckInReservaDTO): Promise<ReservaCheckIn> {
    // 1. Buscar la reserva por código QR
    const reserva = await this.reservaRepository.buscarPorCodigoQr(dto.codigoQr);
    if (!reserva) {
      throw new ErrorNoEncontrado('Código QR no encontrado');
    }

    // 2. Validar que la reserva está ACTIVA
    if (reserva.estado !== EstadoReserva.ACTIVA) {
      throw new ErrorDeValidacion(
        `La reserva no está activa (estado: ${reserva.estado})`,
      );
    }

    // 3. Para el check-in del operador, la reserva ya tiene fechaEntrada
    // (se creó cuando el usuario hizo la reserva). Solo validamos que existe.
    // En un flujo más complejo podríamos tener un estado "EN_USO" separado,
    // pero por simplicidad usamos ACTIVA como "en el parqueadero".

    return {
      id: reserva.id,
      codigoQr: reserva.codigoQr,
      usuarioId: reserva.usuarioId,
      sedeId: reserva.sedeId,
      modalidad: reserva.modalidad,
      fechaEntrada: reserva.fechaEntrada,
    };
  }
}