import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import type { SedeRepository } from '../ports/SedeRepository.js';

export interface ListarSedesOperadorInput {
  operadorId: string;
}

export interface SedeListadoDTO {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
  estado: string;
}

/**
 * Lista las sedes pertenecientes a un operador.
 *
 * Flujo:
 * 1. Validar operadorId presente
 * 2. Consultar SedeRepository.buscarPorOperadorId
 * 3. Mapear a DTO
 */
export class ListarSedesOperadorUseCase {
  constructor(private readonly sedeRepository: SedeRepository) {}

  public async ejecutar(input: ListarSedesOperadorInput): Promise<SedeListadoDTO[]> {
    if (!input.operadorId || input.operadorId.trim() === '') {
      throw new ErrorDeValidacion('El operadorId es obligatorio para listar sedes');
    }

    const sedes = await this.sedeRepository.buscarPorOperadorId(input.operadorId);

    return sedes.map((s) => ({
      id: s.id,
      nombre: s.nombre,
      direccion: s.direccion,
      latitud: s.latitud,
      longitud: s.longitud,
      capacidadTotal: s.capacidadTotal,
      precioHora: s.precioHora,
      estado: s.estado,
    }));
  }
}
