import { Reserva, EstadoReserva, ModalidadReserva } from '../entities/Reserva.js';
import type { ReservaRepository } from '../ports/ReservaRepository.js';
import type { SedeRepository } from '../ports/SedeRepository.js';

export interface ReservaUsuarioDTO {
  id: string;
  codigoQr: string;
  sedeId: string;
  nombreSede: string;
  direccionSede: string;
  modalidad: ModalidadReserva;
  estado: EstadoReserva;
  fechaEntrada: Date;
  fechaSalida?: Date;
}

export class ListarMisReservasUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly sedeRepository: SedeRepository,
  ) {}

  public async ejecutar(usuarioId: string): Promise<ReservaUsuarioDTO[]> {
    const reservas = await this.reservaRepository.buscarPorUsuario(usuarioId);

    // Obtener información de las sedes únicas
    const sedeIds = [...new Set(reservas.map((r) => r.sedeId))];
    const sedes = await Promise.all(sedeIds.map((id) => this.sedeRepository.buscarPorId(id)));
    const sedeMap = new Map(sedes.filter((s): s is NonNullable<typeof s> => s !== null).map((s) => [s.id, s]));

    return reservas.map((reserva) => {
      const sede = sedeMap.get(reserva.sedeId);
      return {
        id: reserva.id,
        codigoQr: reserva.codigoQr,
        sedeId: reserva.sedeId,
        nombreSede: sede?.nombre ?? 'Sede desconocida',
        direccionSede: sede?.direccion ?? '',
        modalidad: reserva.modalidad,
        estado: reserva.estado,
        fechaEntrada: reserva.fechaEntrada,
        fechaSalida: reserva.fechaSalida,
      };
    });
  }
}