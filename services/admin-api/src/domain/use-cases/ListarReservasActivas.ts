import { Reserva, EstadoReserva } from '../entities/Reserva.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import type { ReservaRepository } from '../ports/ReservaRepository.js';
import type { SedeRepository } from '../ports/SedeRepository.js';

export interface ReservaActivaDTO {
  id: string;
  codigoQr: string;
  usuarioId: string;
  sedeId: string;
  nombreSede: string;
  modalidad: string;
  fechaEntrada: Date;
  duracionMinutos: number;
}

export class ListarReservasActivasUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly sedeRepository: SedeRepository,
  ) {}

  public async ejecutar(sedeId: string): Promise<ReservaActivaDTO[]> {
    // 1. Validar que la sede existe
    const sede = await this.sedeRepository.buscarPorId(sedeId);
    if (!sede) {
      throw new ErrorNoEncontrado('La sede indicada no existe');
    }

    // 2. Buscar reservas activas de la sede
    const reservas = await this.reservaRepository.buscarActivasPorSede(sedeId);

    // 3. Mapear a DTO con información adicional
    const ahora = new Date();
    return reservas.map((reserva) => {
      const duracionMs = ahora.getTime() - reserva.fechaEntrada.getTime();
      const duracionMinutos = Math.max(1, Math.ceil(duracionMs / (1000 * 60)));

      return {
        id: reserva.id,
        codigoQr: reserva.codigoQr,
        usuarioId: reserva.usuarioId,
        sedeId: reserva.sedeId,
        nombreSede: sede.nombre,
        modalidad: reserva.modalidad,
        fechaEntrada: reserva.fechaEntrada,
        duracionMinutos,
      };
    });
  }
}