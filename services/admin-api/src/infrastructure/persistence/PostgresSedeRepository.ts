import type { SedeRepository } from '../../domain/ports/SedeRepository.js';
import { Sede, EstadoSede } from '../../domain/entities/Sede.js';
import { db } from '../prisma/db.js';

interface SedeRow {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
  estado: 'ACTIVA' | 'PENDIENTE_KYB' | 'RECHAZADA';
  operadorId: string;
}

export class PostgresSedeRepository implements SedeRepository {
  async guardar(sede: Sede): Promise<void> {
    const datos = {
      id: sede.id,
      nombre: sede.nombre,
      direccion: sede.direccion,
      latitud: sede.latitud,
      longitud: sede.longitud,
      capacidadTotal: sede.capacidadTotal,
      precioHora: sede.precioHora,
      estado: sede.estado,
      operadorId: sede.operadorId,
    };

    await db.orm.public.Sede.upsert({
      create: datos,
      update: {
        nombre: datos.nombre,
        direccion: datos.direccion,
        latitud: datos.latitud,
        longitud: datos.longitud,
        capacidadTotal: datos.capacidadTotal,
        precioHora: datos.precioHora,
      },
    });
  }

  async buscarPorId(id: string): Promise<Sede | null> {
    const fila = await db.orm.public.Sede.first({ id });
    return fila ? this.aDominio(fila) : null;
  }

  async buscarPorOperadorId(operadorId: string): Promise<Sede[]> {
    const filas = await db.orm.public.Sede.where({ operadorId }).all();
    return filas.map((fila) => this.aDominio(fila));
  }

  async listarActivas(): Promise<Sede[]> {
    const filas = await db.orm.public.Sede.where({ estado: 'ACTIVA' }).all();
    return filas.map((fila) => this.aDominio(fila));
  }

  async actualizarEstado(id: string, estado: EstadoSede): Promise<void> {
    await db.orm.public.Sede.where({ id }).update({ estado });
  }

  private aDominio(fila: SedeRow): Sede {
    return Sede.reconstituir({
      id: fila.id,
      nombre: fila.nombre,
      direccion: fila.direccion,
      latitud: fila.latitud,
      longitud: fila.longitud,
      capacidadTotal: fila.capacidadTotal,
      precioHora: fila.precioHora,
      estado: EstadoSede[fila.estado],
      operadorId: fila.operadorId,
    });
  }
}