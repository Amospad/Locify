import { CrearReservaUseCase } from '../../domain/use-cases/CrearReserva.js';
import { ListarMisReservasUseCase, type ReservaUsuarioDTO } from '../../domain/use-cases/ListarMisReservas.js';
import { ObtenerReservaActivaUseCase, type ReservaActivaDTO } from '../../domain/use-cases/ObtenerReservaActiva.js';
import { CancelarReservaUseCase } from '../../domain/use-cases/CancelarReserva.js';
import { ModalidadReserva } from '../../domain/entities/Reserva.js';
import type { ReservaCreada } from '../../domain/use-cases/CrearReserva.js';
import type { ReservaRepository } from '../../domain/ports/ReservaRepository.js';
import type { SedeRepository } from '../../domain/ports/SedeRepository.js';
import type { GeneradorId } from '../../domain/ports/GeneradorId.js';
import type { Reloj } from '../../domain/ports/Reloj.js';
import type { PaymentGateway } from '../../domain/ports/PaymentGateway.js';

export class ReservaService {
  private readonly crearReservaUseCase: CrearReservaUseCase;
  private readonly listarMisReservasUseCase: ListarMisReservasUseCase;
  private readonly obtenerReservaActivaUseCase: ObtenerReservaActivaUseCase;
  private readonly cancelarReservaUseCase: CancelarReservaUseCase;

  constructor(
    reservaRepository: ReservaRepository,
    sedeRepository: SedeRepository,
    generadorId: GeneradorId,
    reloj: Reloj,
    paymentGateway?: PaymentGateway,
  ) {
    this.crearReservaUseCase = new CrearReservaUseCase(
      reservaRepository,
      sedeRepository,
      generadorId,
      reloj,
      paymentGateway,
    );
    this.listarMisReservasUseCase = new ListarMisReservasUseCase(reservaRepository, sedeRepository);
    this.obtenerReservaActivaUseCase = new ObtenerReservaActivaUseCase(reservaRepository, sedeRepository);
    this.cancelarReservaUseCase = new CancelarReservaUseCase(reservaRepository, reloj, paymentGateway);
  }

  public async crearReserva(
    usuarioId: string,
    sedeId: string,
    modalidad: ModalidadReserva,
    tokenTarjeta?: string,
  ): Promise<ReservaCreada> {
    return this.crearReservaUseCase.ejecutar({ usuarioId, sedeId, modalidad, tokenTarjeta });
  }

  public async listarMisReservas(usuarioId: string): Promise<ReservaUsuarioDTO[]> {
    return this.listarMisReservasUseCase.ejecutar(usuarioId);
  }

  public async obtenerReservaActiva(usuarioId: string): Promise<ReservaActivaDTO | null> {
    return this.obtenerReservaActivaUseCase.ejecutar(usuarioId);
  }

  public async cancelarReserva(reservaId: string): Promise<{ id: string; estado: string }> {
    return this.cancelarReservaUseCase.ejecutar({ reservaId });
  }
}