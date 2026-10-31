import { Sede } from '../entities/Sede.js';

/** Puerto de salida para persistir y consultar sedes. */
export interface SedeRepository {
  /** Guarda una sede (insertar o actualizar). */
  guardar(sede: Sede): Promise<void>;

  /** Busca una sede por su ID. */
  buscarPorId(id: string): Promise<Sede | null>;

  /** Busca sedes por operador. */
  buscarPorOperadorId(operadorId: string): Promise<Sede[]>;

  /** Lista todas las sedes ACTIVAS (para mapa público). */
  listarActivas(): Promise<Sede[]>;

  /** Actualiza el estado de una sede. */
  actualizarEstado(id: string, estado: any): Promise<void>;
}