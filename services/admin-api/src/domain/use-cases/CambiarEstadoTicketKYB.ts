import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import type { TicketKYBRepository } from '../ports/TicketKYBRepository.js';
import type { SedeRepository } from '../ports/SedeRepository.js';
import { Sede, EstadoSede } from '../entities/Sede.js';
import { EstadoKYB } from '../entities/TicketKYB.js';

export interface CambiarEstadoTicketKYBCommand {
  ticketId: string;
  estadoNuevo: 'APROBADO' | 'RECHAZADO';
  motivo?: string;
}

export interface CambiarEstadoTicketKYBResult {
  ticketId: string;
  estado: EstadoKYB;
  sedeId: string;
}

export class CambiarEstadoTicketKYBUseCase {
  constructor(
    private readonly ticketKYBRepository: TicketKYBRepository,
    private readonly sedeRepository: SedeRepository,
  ) {}

  public async ejecutar(cmd: CambiarEstadoTicketKYBCommand): Promise<CambiarEstadoTicketKYBResult> {
    const ticket = await this.ticketKYBRepository.buscarPorId(cmd.ticketId);
    if (!ticket) {
      throw new ErrorDeValidacion('El ticket no existe');
    }

    let ticketActualizado;

    if (cmd.estadoNuevo === 'APROBADO') {
      ticketActualizado = ticket.aprobar();
    } else if (cmd.estadoNuevo === 'RECHAZADO') {
      if (!cmd.motivo || cmd.motivo.trim().length === 0) {
        throw new ErrorDeValidacion('Debe proporcionar un motivo para rechazar');
      }
      ticketActualizado = ticket.rechazar(cmd.motivo);
    } else {
      throw new ErrorDeValidacion('Estado no válido');
    }

    await this.ticketKYBRepository.guardar(ticketActualizado);

    // Actualizar estado de la sede
    const sede = await this.sedeRepository.buscarPorId(ticket.sedeId);
    if (sede) {
      const nuevoEstadoSede = cmd.estadoNuevo === 'APROBADO' 
        ? EstadoSede.ACTIVA 
        : EstadoSede.RECHAZADA;
      
      const sedeActualizada = Sede.reconstituir({
        id: sede.id,
        nombre: sede.nombre,
        direccion: sede.direccion,
        latitud: sede.latitud,
        longitud: sede.longitud,
        capacidadTotal: sede.capacidadTotal,
        precioHora: sede.precioHora,
        estado: nuevoEstadoSede,
        operadorId: sede.operadorId,
      });
      await this.sedeRepository.guardar(sedeActualizada);
    }

    return {
      ticketId: ticketActualizado.id,
      estado: ticketActualizado.estado,
      sedeId: ticketActualizado.sedeId,
    };
  }
}