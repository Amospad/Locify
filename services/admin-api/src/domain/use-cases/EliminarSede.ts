import { EstadoSede } from '../entities/Sede.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import { AccesoDenegadoError } from '../errors/AccesoDenegadoError.js';
import type { SedeRepository } from '../ports/SedeRepository.js';

export interface EliminarSedeInput {
  sedeId: string;
  operadorId: string;
}

export interface SedeEliminada {
  sedeId: string;
}

/**
 * Elimina (soft delete) una sede cambiando su estado a RECHAZADA.
 *
 * Flujo:
 * 1. Validar sedeId y operadorId presentes
 * 2. Buscar sede por id
 * 3. Verificar pertenencia al operador
 * 4. Actualizar estado a RECHAZADA via SedeRepository.actualizarEstado
 * 5. Retornar { sedeId }
 */
export class EliminarSedeUseCase {
  constructor(private readonly sedeRepository: SedeRepository) {}

  public async ejecutar(input: EliminarSedeInput): Promise<SedeEliminada> {
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

    await this.sedeRepository.actualizarEstado(input.sedeId, EstadoSede.RECHAZADA);

    return {
      sedeId: input.sedeId,
    };
  }
}
