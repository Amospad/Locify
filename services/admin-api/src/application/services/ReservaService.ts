import { CrearReservaUseCase } from '../../domain/use-cases/CrearReserva.js';
import { ListarMisReservasUseCase, type ReservaUsuarioDTO } from '../../domain/use-cases/ListarMisReservas.js';
import { ObtenerReservaActivaUseCase, type ReservaActivaDTO } from '../../domain/use-cases/ObtenerReservaActiva.js';
import { ModalidadReserva } from '../../domain/entities/Reserva.js';
import type { ReservaCreada } from '../../domain/use-cases/CrearReserva.js';
import type { ReservaRepository } from '../../domain/ports/ReservaRepository.js';
import type { SedeRepository } from '../../domain/ports/SedeRepository.js';
import type { GeneradorId } from '../../domain/ports/GeneradorId.js';
import type { Reloj } from '../../domain/ports/Reloj.js';

export class ReservaService {
  private readonly crearReservaUseCase: CrearReservaUseCase;
  private readonly listarMisReservasUseCase: ListarMisReservasUseCase;
  private readonly obtenerReservaActivaUseCase: ObtenerReservaActivaUseCase;

  constructor(
    reservaRepository: ReservaRepository,
    sedeRepository: SedeRepository,
    generadorId: GeneradorId,
    reloj: Reloj,
  ) {
    this.crearReservaUseCase = new CrearReservaUseCase(
      reservaRepository,
      sedeRepository,
      generadorId,
      reloj,
    );
    this.listarMisReservasUseCase = new ListarMisReservasUseCase(reservaRepository, sedeRepository);
    this.obtenerReservaActivaUseCase = new ObtenerReservaActivaUseCase(reservaRepository, sedeRepository);
  }

  public async crearReserva(
    usuarioId: string,
    sedeId: string,
    modalidad: ModalidadReserva,
  ): Promise<ReservaCreada> {
    return this.crearReservaUseCase.ejecutar({ usuarioId, sedeId, modalidad });
  }

  public async listarMisReservas(usuarioId: string): Promise<ReservaUsuarioDTO[]> {
    return this.listarMisReservasUseCase.ejecutar(usuarioId);
  }

  public async obtenerReservaActiva(usuarioId: string): Promise<ReservaActivaDTO | null> {
    return this.obtenerReservaActivaUseCase.ejecutar(usuarioId);
  }
}