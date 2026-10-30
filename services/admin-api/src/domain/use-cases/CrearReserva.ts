import { Reserva, ModalidadReserva } from '../entities/Reserva.js';
import { Sede } from '../entities/Sede.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import { PagoRechazadoError } from '../errors/PagoRechazadoError.js';
import type { ReservaRepository } from '../ports/ReservaRepository.js';
import type { SedeRepository } from '../ports/SedeRepository.js';
import type { GeneradorId } from '../ports/GeneradorId.js';
import type { Reloj } from '../ports/Reloj.js';
import type { PaymentGateway } from '../ports/PaymentGateway.js';

export interface CrearReservaDTO {
  usuarioId: string;
  sedeId: string;
  modalidad: ModalidadReserva;
  tokenTarjeta?: string;
}

export interface ReservaCreada {
  id: string;
  codigoQr: string;
  sedeId: string;
}

/**
 * Crea una reserva para un usuario en una sede (RF-09/RF-11/HU-C01).
 *
 * Reglas de negocio:
 * - El usuario debe existir (se valida en el caso de uso de login, aquí asumimos id válido).
 * - La sede debe existir.
 * - El usuario no puede tener otra reserva ACTIVA simultánea.
 * - Se genera un código QR único.
 * - La reserva nace en estado ACTIVA con fechaEntrada = ahora.
 * - Si la modalidad es GARANTIZADA, se procesa el pago antes de guardar.
 */
export class CrearReservaUseCase {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly sedeRepository: SedeRepository,
    private readonly generadorId: GeneradorId,
    private readonly reloj: Reloj,
    private readonly paymentGateway?: PaymentGateway,
  ) {}

  public async ejecutar(dto: CrearReservaDTO): Promise<ReservaCreada> {
    // 1. Validar que la sede existe
    const sede = await this.sedeRepository.buscarPorId(dto.sedeId);
    if (!sede) {
      throw new ErrorNoEncontrado('La sede indicada no existe');
    }

    // 2. Regla de negocio: un usuario solo puede tener una reserva ACTIVA a la vez
    const reservaActiva = await this.reservaRepository.buscarActivaPorUsuario(dto.usuarioId);
    if (reservaActiva) {
      throw new ErrorDeValidacion(
        'Ya tienes una reserva activa. Finalízala o cancélala antes de crear una nueva.',
      );
    }

    // 3. Generar código QR único (verificando que no exista)
    let codigoQr: string;
    let existe = true;
    let intentos = 0;
    const MAX_INTENTOS = 5;
    do {
      codigoQr = Reserva.generarCodigoQr();
      const existente = await this.reservaRepository.buscarPorCodigoQr(codigoQr);
      existe = !!existente;
      intentos++;
    } while (existe && intentos < MAX_INTENTOS);

    if (existe) {
      throw new ErrorDeValidacion('No se pudo generar un código QR único. Inténtalo de nuevo.');
    }

    // 4. Procesar pago si es modalidad GARANTIZADA
    if (dto.modalidad === ModalidadReserva.GARANTIZADA) {
      if (!dto.tokenTarjeta) {
        throw new ErrorDeValidacion('Token de tarjeta requerido para reservas garantizadas');
      }
      if (!this.paymentGateway) {
        throw new Error('PaymentGateway no configurado');
      }

      const monto = sede.precioHora * 1; // 1 hora mínima
      const resultado = await this.paymentGateway.procesarPago(monto, 'COP', dto.tokenTarjeta);
      
      if (!resultado.exitoso) {
        throw new PagoRechazadoError('El pago fue rechazado por el gateway');
      }
    }

    // 5. Crear la entidad de dominio
    const nuevaReserva = Reserva.crear({
      id: this.generadorId.generar(),
      usuarioId: dto.usuarioId,
      sedeId: dto.sedeId,
      modalidad: dto.modalidad,
      codigoQr: codigoQr!,
      fechaEntrada: this.reloj.ahora(),
    });

    // 5. Persistir
    await this.reservaRepository.guardar(nuevaReserva);

    return {
      id: nuevaReserva.id,
      codigoQr: nuevaReserva.codigoQr,
      sedeId: nuevaReserva.sedeId,
    };
  }
}