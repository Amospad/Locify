import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import type { TicketKYBRepository } from '../ports/TicketKYBRepository.js';
import type { SedeRepository } from '../ports/SedeRepository.js';
import { EstadoKYB } from '../entities/TicketKYB.js';
import { EstadoSede } from '../entities/Sede.js';

export interface ConsultarEstadoKYBResult {
  tieneTicket: boolean;
  estadoKYB: EstadoKYB | null;
  estadoSede: EstadoSede;
  sedeId: string | null;
  sedeNombre: string | null;
  urlRut: string | null;
  urlCamaraComercio: string | null;
  motivoRechazo: string | null;
  fechaCreacion: Date | null;
  fechaActualizacion: Date | null;
}

export class ConsultarEstadoKYBUseCase {
  constructor(
    private readonly ticketKYBRepository: TicketKYBRepository,
    private readonly sedeRepository: SedeRepository,
  ) {}

  public async ejecutar(operadorId: string): Promise<ConsultarEstadoKYBResult> {
    if (!operadorId) {
      throw new ErrorDeValidacion('El ID del operador es obligatorio');
    }

    const ticket = await this.ticketKYBRepository.buscarPorOperadorId(operadorId);
    const sedes = await this.sedeRepository.buscarPorOperadorId(operadorId);

    if (!ticket && sedes.length === 0) {
      return {
        tieneTicket: false,
        estadoKYB: null,
        estadoSede: EstadoSede.ACTIVA,
        sedeId: null,
        sedeNombre: null,
        urlRut: null,
        urlCamaraComercio: null,
        motivoRechazo: null,
        fechaCreacion: null,
        fechaActualizacion: null,
      };
    }

    const sede = sedes[0];

    if (!ticket) {
      return {
        tieneTicket: false,
        estadoKYB: null,
        estadoSede: sede.estado,
        sedeId: sede.id,
        sedeNombre: sede.nombre,
        urlRut: null,
        urlCamaraComercio: null,
        motivoRechazo: null,
        fechaCreacion: null,
        fechaActualizacion: null,
      };
    }

    return {
      tieneTicket: true,
      estadoKYB: ticket.estado,
      estadoSede: sede.estado,
      sedeId: ticket.sedeId,
      sedeNombre: sede.nombre,
      urlRut: ticket.urlRut,
      urlCamaraComercio: ticket.urlCamaraComercio,
      motivoRechazo: ticket.motivoRechazo ?? null,
      fechaCreacion: ticket.fechaCreacion,
      fechaActualizacion: ticket.fechaActualizacion ?? null,
    };
  }
}