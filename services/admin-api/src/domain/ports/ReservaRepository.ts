import { Reserva } from '../entities/Reserva.js';

/** Puerto de salida: persiste y consulta reservas. */
export interface ReservaRepository {
  /** Guarda una reserva (inserta o actualiza). */
  guardar(reserva: Reserva): Promise<void>;

  /** Busca una reserva por su id (UUID). */
  buscarPorId(id: string): Promise<Reserva | null>;

  /** Busca una reserva por su código QR. */
  buscarPorCodigoQr(codigoQr: string): Promise<Reserva | null>;

  /** Busca la reserva ACTIVA de un usuario (regla: un usuario = 1 reserva activa). */
  buscarActivaPorUsuario(usuarioId: string): Promise<Reserva | null>;

  /** Busca todas las reservas ACTIVAS de una sede (para el dashboard del operador). */
  buscarActivasPorSede(sedeId: string): Promise<Reserva[]>;

  /** Busca todas las reservas de un usuario, ordenadas por fecha de creación descendente. */
  buscarPorUsuario(usuarioId: string): Promise<Reserva[]>;
}