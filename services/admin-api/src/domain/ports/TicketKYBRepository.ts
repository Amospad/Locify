import { TicketKYB } from '../entities/TicketKYB.js';

/** Puerto de salida para persistir y consultar tickets KYB. */
export interface TicketKYBRepository {
  /** Guarda un ticket KYB (insertar o actualizar). */
  guardar(ticket: TicketKYB): Promise<void>;

  /** Busca un ticket por su ID. */
  buscarPorId(id: string): Promise<TicketKYB | null>;

  /** Busca un ticket por el ID de la sede. */
  buscarPorSedeId(sedeId: string): Promise<TicketKYB | null>;

  /** Busca un ticket por el ID del operador. */
  buscarPorOperadorId(operadorId: string): Promise<TicketKYB | null>;

  /** Lista tickets EN_REVISION para auditoría de ADMIN. */
  listarPendientes(): Promise<TicketKYB[]>;
}