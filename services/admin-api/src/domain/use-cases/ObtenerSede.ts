import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import { AccesoDenegadoError } from '../errors/AccesoDenegadoError.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import type { SedeRepository } from '../ports/SedeRepository.js';

export interface ObtenerSedeInput {
  sedeId: string;
  operadorId: string;
}

export interface SedeDetalleDTO {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
  estado: string;
  operadorId: string;
}

/**
 * Obtiene una sede específica verificando pertenencia al operador.
 *
 * Flujo:
 * 1. Validar sedeId y operadorId presentes
 * 2. Buscar sede por id
 * 3. Si no existe -> ErrorNoEncontrado
 * 4. Si operadorId no coincide -> AccesoDenegadoError
 * 5. Retornar DTO completo
 */
export class ObtenerSedeUseCase {
  constructor(private readonly sedeRepository: SedeRepository) {}

  public async ejecutar(input: ObtenerSedeInput): Promise<SedeDetalleDTO> {
    if (!input.sedeId || input.sedeId.trim() === '') {
      throw new ErrorDeValidacion('El sedeId es obligatorio');
    }
    if (!input.operadorId || input.operadorId.trim() === '') {
      throw new ErrorDeValidacion('El operadorId es obligatorio');
    }

    const sede = await this.sedeRepository.buscarPorId(input.sedeId);
    if (!sede) {
      throw new ErrorNoEncontrado('Sede no encontrada');
    }

    if (sede.operadorId !== input.operadorId) {
      throw new AccesoDenegadoError('No tienes acceso a esta sede');
    }

    return {
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
  }
}
