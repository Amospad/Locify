import { CheckInReservaUseCase, type ReservaCheckIn } from '../../domain/use-cases/CheckInReserva.js';
import { CheckOutReservaUseCase, type ReservaCheckOut } from '../../domain/use-cases/CheckOutReserva.js';
import { ListarReservasActivasUseCase, type ReservaActivaDTO } from '../../domain/use-cases/ListarReservasActivas.js';
import type { ReservaRepository } from '../../domain/ports/ReservaRepository.js';
import type { SedeRepository } from '../../domain/ports/SedeRepository.js';
import type { Reloj } from '../../domain/ports/Reloj.js';

export interface OperadorService {
  checkIn(codigoQr: string, operadorId: string): Promise<ReservaCheckIn>;
  checkOut(reservaId: string, operadorId: string): Promise<ReservaCheckOut>;
  listarReservasActivas(sedeId: string): Promise<ReservaActivaDTO[]>;
}

export class OperadorServiceImpl implements OperadorService {
  private readonly checkInUseCase: CheckInReservaUseCase;
  private readonly checkOutUseCase: CheckOutReservaUseCase;
  private readonly listarActivasUseCase: ListarReservasActivasUseCase;

  constructor(
    reservaRepository: ReservaRepository,
    sedeRepository: SedeRepository,
    reloj: Reloj,
  ) {
    this.checkInUseCase = new CheckInReservaUseCase(reservaRepository, reloj);
    this.checkOutUseCase = new CheckOutReservaUseCase(reservaRepository, reloj);
    this.listarActivasUseCase = new ListarReservasActivasUseCase(reservaRepository, sedeRepository);
  }

  public async checkIn(codigoQr: string, operadorId: string): Promise<ReservaCheckIn> {
    return this.checkInUseCase.ejecutar({ codigoQr, operadorId });
  }

  public async checkOut(reservaId: string, operadorId: string): Promise<ReservaCheckOut> {
    return this.checkOutUseCase.ejecutar({ reservaId, operadorId });
  }

  public async listarReservasActivas(sedeId: string): Promise<ReservaActivaDTO[]> {
    return this.listarActivasUseCase.ejecutar(sedeId);
  }
}