import { Sede } from '../entities/Sede.js';

/** Puerto de salida: busca sedes para mostrar en el mapa y crear reservas. */
export interface SedeRepository {
  /** Busca todas las sedes (para el mapa del cliente). */
  buscarTodas(): Promise<Sede[]>;

  /** Busca una sede por su id (para validar al crear reserva). */
  buscarPorId(id: string): Promise<Sede | null>;
}