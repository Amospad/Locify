import type { TicketKYBRepository } from '../../domain/ports/TicketKYBRepository.js';
import { TicketKYB, EstadoKYB } from '../../domain/entities/TicketKYB.js';
import type { Sede } from '../../domain/entities/Sede.js';

interface TicketKYBRow {
  id: string;
  sedeId: string;
  operadorId: string;
  estado: 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';
  urlRut: string;
  urlCamaraComercio: string;
  motivoRechazo: string | null;
  fechaCreacion: Date;
  fechaActualizacion: Date | null;
}

export class PostgresTicketKYBRepository implements TicketKYBRepository {
  async guardar(ticket: TicketKYB): Promise<void> {
    const datos = {
      id: ticket.id,
      sedeId: ticket.sedeId,
      operadorId: ticket.operadorId,
      estado: ticket.estado,
      urlRut: ticket.urlRut,
      urlCamaraComercio: ticket.urlCamaraComercio,
      motivoRechazo: ticket.motivoRechazo ?? null,
      fechaCreacion: ticket.fechaCreacion,
      fechaActualizacion: ticket.fechaActualizacion ?? null,
    };

    await this.db.orm.public.TicketKYB.upsert({
      create: datos,
      update: {
        estado: datos.estado,
        motivoRechazo: datos.motivoRechazo,
        fechaActualizacion: datos.fechaActualizacion,
      },
    });
  }

  async buscarPorId(id: string): Promise<TicketKYB | null> {
    const fila = await this.db.orm.public.TicketKYB.first({ id });
    return fila ? this.aDominio(fila) : null;
  }

  async buscarPorSedeId(sedeId: string): Promise<TicketKYB | null> {
    const fila = await this.db.orm.public.TicketKYB.where({ sedeId }).first();
    return fila ? this.aDominio(fila) : null;
  }

  async buscarPorOperadorId(operadorId: string): Promise<TicketKYB | null> {
    const fila = await this.db.orm.public.TicketKYB.where({ operadorId }).first();
    return fila ? this.aDominio(fila) : null;
  }

  async listarPendientes(): Promise<TicketKYB[]> {
    const filas = await this.db.orm.public.TicketKYB.where({ estado: EstadoKYB.EN_REVISION }).all();
    return filas.map((fila) => this.aDominio(fila));
  }

  private aDominio(fila: TicketKYBRow): TicketKYB {
    return TicketKYB.reconstituir({
      id: fila.id,
      sedeId: fila.sedeId,
      operadorId: fila.operadorId,
      estado: EstadoKYB[fila.estado],
      urlRut: fila.urlRut,
      urlCamaraComercio: fila.urlCamaraComercio,
      motivoRechazo: fila.motivoRechazo ?? undefined,
      fechaCreacion: fila.fechaCreacion,
      fechaActualizacion: fila.fechaActualizacion ?? undefined,
    });
  }

  private get db() {
    // This would be injected in real code
    return require('../prisma/db.js').db;
  }
}