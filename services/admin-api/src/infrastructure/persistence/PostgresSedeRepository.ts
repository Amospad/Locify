import type { SedeRepository } from '../../domain/ports/SedeRepository.js';
import { Sede } from '../../domain/entities/Sede.js';
import { db } from '../../prisma/db.js';

interface SedeRow {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
}

export class PostgresSedeRepository implements SedeRepository {
  async buscarTodas(): Promise<Sede[]> {
    const filas = await db.orm.public.Sede.all();
    return filas.map((fila) => this.aDominio(fila));
  }

  async buscarPorId(id: string): Promise<Sede | null> {
    const fila = await db.orm.public.Sede.first({ id });
    return fila ? this.aDominio(fila) : null;
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
    });
  }
}