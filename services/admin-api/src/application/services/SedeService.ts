import { SubirDocumentosKYBUseCase, type SubirDocumentosKYBCommand, type SubirDocumentosKYBResult } from '../../domain/use-cases/SubirDocumentosKYB.js';
import { ListarTicketsKYBPendientesUseCase, type TicketKYBPendienteDTO } from '../../domain/use-cases/ListarTicketsKYBPendientes.js';
import { CambiarEstadoTicketKYBUseCase, type CambiarEstadoTicketKYBCommand, type CambiarEstadoTicketKYBResult } from '../../domain/use-cases/CambiarEstadoTicketKYB.js';
import type { TicketKYBRepository } from '../../domain/ports/TicketKYBRepository.js';
import type { SedeRepository } from '../../domain/ports/SedeRepository.js';
import type { GeneradorId } from '../../domain/ports/GeneradorId.js';
import type { Reloj } from '../../domain/ports/Reloj.js';

export class SedeService {
  private readonly subirDocumentosUseCase: SubirDocumentosKYBUseCase;
  private readonly listarPendientesUseCase: ListarTicketsKYBPendientesUseCase;
  private readonly cambiarEstadoUseCase: CambiarEstadoTicketKYBUseCase;

  constructor(
    ticketKYBRepository: TicketKYBRepository,
    sedeRepository: SedeRepository,
    generadorId: GeneradorId,
    reloj: Reloj,
  ) {
    this.subirDocumentosUseCase = new SubirDocumentosKYBUseCase(
      ticketKYBRepository,
      sedeRepository,
      generadorId,
      reloj,
    );
    this.listarPendientesUseCase = new ListarTicketsKYBPendientesUseCase(
      ticketKYBRepository,
      sedeRepository,
    );
    this.cambiarEstadoUseCase = new CambiarEstadoTicketKYBUseCase(
      ticketKYBRepository,
      sedeRepository,
    );
  }

  public async subirDocumentosKYB(cmd: SubirDocumentosKYBCommand): Promise<SubirDocumentosKYBResult> {
    return this.subirDocumentosUseCase.ejecutar(cmd);
  }

  public async listarTicketsPendientes(): Promise<TicketKYBPendienteDTO[]> {
    return this.listarPendientesUseCase.ejecutar();
  }

  public async cambiarEstadoTicket(cmd: CambiarEstadoTicketKYBCommand): Promise<CambiarEstadoTicketKYBResult> {
    return this.cambiarEstadoUseCase.ejecutar(cmd);
  }
}