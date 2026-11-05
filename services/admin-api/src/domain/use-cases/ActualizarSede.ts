import { Sede, EstadoSede } from '../entities/Sede.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import { AccesoDenegadoError } from '../errors/AccesoDenegadoError.js';
import { ErrorDeConflicto } from '../errors/ErrorDeConflicto.js';
import type { SedeRepository } from '../ports/SedeRepository.js';

export interface ActualizarSedeInput {
  sedeId: string;
  operadorId: string;
  nombre?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  capacidadTotal?: number;
  precioHora?: number;
}

export interface SedeActualizada {
  sedeId: string;
  nombre: string;
}

/**
 * Actualiza datos de una sede verificando pertenencia y duplicidad.
 *
 * Flujo:
 * 1. Validar sedeId y operadorId presentes
 * 2. Buscar sede por id
 * 3. Verificar pertenencia al operador
 * 4. Validar duplicidad si cambia nombre/dirección
 * 5. Crear nueva entidad con valores merged y guardar
 * 6. Retornar { sedeId, nombre }
 */
export class ActualizarSedeUseCase {
  constructor(private readonly sedeRepository: SedeRepository) {}

  public async ejecutar(input: ActualizarSedeInput): Promise<SedeActualizada> {
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

    const nombreNuevo = input.nombre?.trim() ?? sede.nombre;
    const direccionNueva = input.direccion?.trim() ?? sede.direccion;

    // Validar duplicidad si cambia nombre o dirección
    if (nombreNuevo !== sede.nombre || direccionNueva !== sede.direccion) {
      const sedesOperador = await this.sedeRepository.buscarPorOperadorId(input.operadorId);
      const normalizadoNombre = nombreNuevo.toLowerCase();
      const normalizadaDireccion = direccionNueva.toLowerCase();

      const duplicada = sedesOperador.find(
        (s) =>
          s.id !== sede.id &&
          s.nombre.trim().toLowerCase() === normalizadoNombre &&
          s.direccion.trim().toLowerCase() === normalizadaDireccion
      );

      if (duplicada) {
        throw new ErrorDeConflicto('Ya existe otra sede con el mismo nombre y dirección para este operador');
      }
    }

    // Merge de valores
    const props = {
      id: sede.id,
      nombre: nombreNuevo,
      direccion: direccionNueva,
      latitud: input.latitud ?? sede.latitud,
      longitud: input.longitud ?? sede.longitud,
      capacidadTotal: input.capacidadTotal ?? sede.capacidadTotal,
      precioHora: input.precioHora ?? sede.precioHora,
      estado: sede.estado,
      operadorId: sede.operadorId,
    };

    // Validación de dominio a través de factory
    const sedeActualizada = Sede.crear(props);

    await this.sedeRepository.guardar(sedeActualizada);

    return {
      sedeId: sedeActualizada.id,
      nombre: sedeActualizada.nombre,
    };
  }
}
