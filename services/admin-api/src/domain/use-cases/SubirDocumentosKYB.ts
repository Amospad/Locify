import { TicketKYB, EstadoKYB } from '../entities/TicketKYB.js';
import { Sede, EstadoSede } from '../entities/Sede.js';
import type { TicketKYBRepository } from '../ports/TicketKYBRepository.js';
import type { SedeRepository } from '../ports/SedeRepository.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import type { GeneradorId } from '../ports/GeneradorId.js';
import type { Reloj } from '../ports/Reloj.js';

export interface SubirDocumentosKYBCommand {
  sedeId: string;
  operadorId: string;
  urlRut: string;
  urlCamaraComercio: string;
}

export interface SubirDocumentosKYBResult {
  ticketId: string;
  sedeId: string;
  estado: EstadoKYB;
}

export class SubirDocumentosKYBUseCase {
  constructor(
    private readonly ticketKYBRepository: TicketKYBRepository,
    private readonly sedeRepository: SedeRepository,
    private readonly generadorId: GeneradorId,
    private readonly reloj: Reloj,
  ) {}

  public async ejecutar(cmd: SubirDocumentosKYBCommand): Promise<SubirDocumentosKYBResult> {
    // Verificar que la sede existe y pertenece al operador
    const sede = await this.sedeRepository.buscarPorId(cmd.sedeId);
    if (!sede) {
      throw new ErrorDeValidacion('La sede no existe');
    }

    if (sede.operadorId !== cmd.operadorId) {
      throw new ErrorDeValidacion('La sede no pertenece a este operador');
    }

    // Verificar que no existe ya un ticket para esta sede
    const ticketExistente = await this.ticketKYBRepository.buscarPorSedeId(cmd.sedeId);
    if (ticketExistente) {
      throw new ErrorDeValidacion('Ya existe un ticket KYB para esta sede');
    }

    // Crear ticket KYB
    const ticket = TicketKYB.crear({
      id: this.generadorId.generar(),
      sedeId: cmd.sedeId,
      operadorId: cmd.operadorId,
      urlRut: cmd.urlRut,
      urlCamaraComercio: cmd.urlCamaraComercio,
      fechaCreacion: this.reloj.ahora(),
    });

    await this.ticketKYBRepository.guardar(ticket);

    // Actualizar estado de la sede
    const sedeActualizada = Sede.reconstituir({
      id: sede.id,
      nombre: sede.nombre,
      direccion: sede.direccion,
      latitud: sede.latitud,
      longitud: sede.longitud,
      capacidadTotal: sede.capacidadTotal,
      precioHora: sede.precioHora,
      estado: EstadoSede.PENDIENTE_KYB,
      operadorId: sede.operadorId,
    });
    await this.sedeRepository.guardar(sedeActualizada);

    return {
      ticketId: ticket.id,
      sedeId: ticket.sedeId,
      estado: ticket.estado,
    };
  }
}