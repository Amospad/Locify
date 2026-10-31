import type { TicketKYBRepository } from '../ports/TicketKYBRepository.js';
import type { SedeRepository } from '../ports/SedeRepository.js';
import { TicketKYB } from '../entities/TicketKYB.js';

export interface TicketKYBPendienteDTO {
  id: string;
  sedeId: string;
  nombreSede: string;
  direccionSede: string;
  operadorId: string;
  urlRut: string;
  urlCamaraComercio: string;
  fechaCreacion: Date;
}

export class ListarTicketsKYBPendientesUseCase {
  constructor(
    private readonly ticketKYBRepository: TicketKYBRepository,
    private readonly sedeRepository: SedeRepository,
  ) {}

  public async ejecutar(): Promise<TicketKYBPendienteDTO[]> {
    const tickets = await this.ticketKYBRepository.listarPendientes();

    const sedeIds = [...new Set(tickets.map((t) => t.sedeId))];
    const sedes = await Promise.all(sedeIds.map((id) => this.sedeRepository.buscarPorId(id)));
    const sedeMap = new Map(sedes.filter((s): s is NonNullable<typeof s> => s !== null).map((s) => [s.id, s]));

    return tickets.map((ticket) => {
      const sede = sedeMap.get(ticket.sedeId);
      return {
        id: ticket.id,
        sedeId: ticket.sedeId,
        nombreSede: sede?.nombre ?? 'Sede desconocida',
        direccionSede: sede?.direccion ?? '',
        operadorId: ticket.operadorId,
        urlRut: ticket.urlRut,
        urlCamaraComercio: ticket.urlCamaraComercio,
        fechaCreacion: ticket.fechaCreacion,
      };
    });
  }
}