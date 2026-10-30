import type { ReservaRepository } from '../../domain/ports/ReservaRepository.js';
import { Reserva, EstadoReserva, ModalidadReserva } from '../../domain/entities/Reserva.js';
import { db } from '../../prisma/db.js';

interface ReservaRow {
  id: string;
  usuarioId: string;
  sedeId: string;
  modalidad: 'GARANTIZADA' | 'EXPRES';
  estado: 'ACTIVA' | 'FINALIZADA' | 'CANCELADA' | 'EXPIRADA';
  codigoQr: string;
  fechaEntrada: Date;
  fechaSalida: Date | null;
}

export class PostgresReservaRepository implements ReservaRepository {
  async guardar(reserva: Reserva): Promise<void> {
    const datos = {
      id: reserva.id,
      usuarioId: reserva.usuarioId,
      sedeId: reserva.sedeId,
      modalidad: reserva.modalidad,
      estado: reserva.estado,
      codigoQr: reserva.codigoQr,
      fechaEntrada: reserva.fechaEntrada,
      fechaSalida: reserva.fechaSalida ?? null,
    };

    await db.orm.public.Reserva.upsert({
      create: datos,
      update: {
        usuarioId: datos.usuarioId,
        sedeId: datos.sedeId,
        modalidad: datos.modalidad,
        estado: datos.estado,
        codigoQr: datos.codigoQr,
        fechaEntrada: datos.fechaEntrada,
        fechaSalida: datos.fechaSalida,
      },
    });
  }

  async buscarPorId(id: string): Promise<Reserva | null> {
    const fila = await db.orm.public.Reserva.first({ id });
    return fila ? this.aDominio(fila) : null;
  }

  async buscarPorCodigoQr(codigoQr: string): Promise<Reserva | null> {
    const fila = await db.orm.public.Reserva.where({ codigoQr }).first();
    return fila ? this.aDominio(fila) : null;
  }

  async buscarActivaPorUsuario(usuarioId: string): Promise<Reserva | null> {
    const fila = await db.orm.public.Reserva.where({ usuarioId, estado: EstadoReserva.ACTIVA }).first();
    return fila ? this.aDominio(fila) : null;
  }

  async buscarActivasPorSede(sedeId: string): Promise<Reserva[]> {
    const filas = await db.orm.public.Reserva.where({ sedeId, estado: EstadoReserva.ACTIVA }).all();
    return filas.map((fila) => this.aDominio(fila));
  }

  async buscarPorUsuario(usuarioId: string): Promise<Reserva[]> {
    const filas = await db.orm.public.Reserva.where({ usuarioId })
      .orderBy({ fechaEntrada: 'desc' })
      .all();
    return filas.map((fila) => this.aDominio(fila));
  }

  private aDominio(fila: ReservaRow): Reserva {
    return Reserva.reconstituir({
      id: fila.id,
      usuarioId: fila.usuarioId,
      sedeId: fila.sedeId,
      modalidad: ModalidadReserva[fila.modalidad],
      estado: EstadoReserva[fila.estado],
      codigoQr: fila.codigoQr,
      fechaEntrada: fila.fechaEntrada,
      fechaSalida: fila.fechaSalida ?? undefined,
    });
  }
}