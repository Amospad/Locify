import { Sede, EstadoSede } from '../entities/Sede.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import { ErrorDeConflicto } from '../errors/ErrorDeConflicto.js';
import type { SedeRepository } from '../ports/SedeRepository.js';
import type { GeneradorId } from '../ports/GeneradorId.js';

export interface CrearSedeDTO {
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
  operadorId: string;
}

export interface SedeCreada {
  sedeId: string;
  nombre: string;
}

/**
 * Crea una sede de parqueadero para un operador.
 *
 * Flujo:
 * 1. Validar campos obligatorios
 * 2. Verificar que el operador no tenga ya una sede con el mismo nombre en la misma dirección
 * 3. Crear entidad Sede con id generado via GeneradorId port
 * 4. Guardar sede via SedeRepository.guardar
 * 5. Retornar { sedeId, nombre }
 */
export class CrearSedeUseCase {
  constructor(
    private readonly sedeRepository: SedeRepository,
    private readonly generadorId: GeneradorId,
  ) {}

  public async ejecutar(dto: CrearSedeDTO): Promise<SedeCreada> {
    // 1. Validar campos obligatorios
    if (!dto.nombre || dto.nombre.trim() === '') {
      throw new ErrorDeValidacion('El nombre de la sede es obligatorio');
    }
    if (!dto.direccion || dto.direccion.trim() === '') {
      throw new ErrorDeValidacion('La dirección de la sede es obligatoria');
    }
    if (dto.latitud === undefined || dto.latitud === null || !Number.isFinite(dto.latitud)) {
      throw new ErrorDeValidacion('La latitud es obligatoria y debe ser un número válido');
    }
    if (dto.longitud === undefined || dto.longitud === null || !Number.isFinite(dto.longitud)) {
      throw new ErrorDeValidacion('La longitud es obligatoria y debe ser un número válido');
    }
    if (dto.capacidadTotal === undefined || dto.capacidadTotal === null) {
      throw new ErrorDeValidacion('La capacidad total es obligatoria');
    }
    if (dto.precioHora === undefined || dto.precioHora === null) {
      throw new ErrorDeValidacion('El precio por hora es obligatorio');
    }
    if (!dto.operadorId || dto.operadorId.trim() === '') {
      throw new ErrorDeValidacion('El operadorId es obligatorio');
    }

    const nombreNormalizado = dto.nombre.trim().toLowerCase();
    const direccionNormalizada = dto.direccion.trim().toLowerCase();

    // 2. Verificar que el operador no tenga ya una sede con mismo nombre y dirección
    const sedesOperador = await this.sedeRepository.buscarPorOperadorId(dto.operadorId);
    const sedeDuplicada = sedesOperador.find(
      (s) =>
        s.nombre.trim().toLowerCase() === nombreNormalizado &&
        s.direccion.trim().toLowerCase() === direccionNormalizada
    );

    if (sedeDuplicada) {
      throw new ErrorDeConflicto('Ya existe una sede registrada con el mismo nombre y dirección para este operador.');
    }

    // 3. Crear entidad Sede con id generado via GeneradorId port
    const id = this.generadorId.generar();
    const nuevaSede = Sede.crear({
      id,
      nombre: dto.nombre,
      direccion: dto.direccion,
      latitud: dto.latitud,
      longitud: dto.longitud,
      capacidadTotal: dto.capacidadTotal,
      precioHora: dto.precioHora,
      estado: EstadoSede.PENDIENTE_KYB,
      operadorId: dto.operadorId,
    });

    // 4. Guardar sede via SedeRepository.guardar
    await this.sedeRepository.guardar(nuevaSede);

    // 5. Retornar { sedeId, nombre }
    return {
      sedeId: nuevaSede.id,
      nombre: nuevaSede.nombre,
    };
  }
}
