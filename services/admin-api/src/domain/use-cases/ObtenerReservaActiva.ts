import { Reserva, EstadoReserva, ModalidadReserva } from '../entities/Reserva.js';
import type { ReservaRepository } from '../ports/ReservaRepository.js';
import type { SedeRepository } from '../ports/SedeRepository.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';

export interface ReservaActivaDTO {
  id: string;
  codigoQr: string;
  sedeId: string;
  nombreSede: string;
  direccionSede: string;
  modalidad: ModalidadReserva;
  estado: EstadoReserva;
  fechaEntrada: Date;
}

export class ObtenerReservaActivaUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly sedeRepository: SedeRepository,
  ) {}

  public async ejecutar(usuarioId: string): Promise<ReservaActivaDTO | null> {
    const reserva = await this.reservaRepository.buscarActivaPorUsuario(usuarioId);
    if (!reserva) {
      return null;
    }

    const sede = await this.sedeRepository.buscarPorId(reserva.sedeId);

    return {
      id: reserva.id,
      codigoQr: reserva.codigoQr,
      sedeId: reserva.sedeId,
      nombreSede: sede?.nombre ?? 'Sede desconocida',
      direccionSede: sede?.direccion ?? '',
      modalidad: reserva.modalidad,
      estado: reserva.estado,
      fechaEntrada: reserva.fechaEntrada,
    };
  }
}