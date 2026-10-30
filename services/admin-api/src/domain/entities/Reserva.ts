import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';

export enum ModalidadReserva {
  GARANTIZADA = 'GARANTIZADA',
  EXPRES = 'EXPRES',
}

export enum EstadoReserva {
  ACTIVA = 'ACTIVA',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA',
  EXPIRADA = 'EXPIRADA',
}

/** Código QR: alfanumérico, longitud fija para legibilidad en impresión. */
const LONGITUD_CODIGO_QR = 12;
const PATRON_CODIGO_QR = /^[A-Z0-9]{12}$/;

export interface ReservaProps {
  id: string;
  usuarioId: string;
  sedeId: string;
  modalidad: ModalidadReserva;
  estado: EstadoReserva;
  codigoQr: string;
  fechaEntrada: Date;
  fechaSalida?: Date;
}

export class Reserva {
  private constructor(private props: ReservaProps) {}

  // Getters
  get id() { return this.props.id; }
  get usuarioId() { return this.props.usuarioId; }
  get sedeId() { return this.props.sedeId; }
  get modalidad() { return this.props.modalidad; }
  get estado() { return this.props.estado; }
  get codigoQr() { return this.props.codigoQr; }
  get fechaEntrada() { return this.props.fechaEntrada; }
  get fechaSalida() { return this.props.fechaSalida; }

  // Reglas de negocio
  public estaActiva(): boolean {
    return this.props.estado === EstadoReserva.ACTIVA;
  }

  public finalizar(fechaSalida: Date = new Date()): Reserva {
    if (!this.estaActiva()) {
      throw new ErrorDeValidacion('Solo se puede finalizar una reserva ACTIVA');
    }
    if (fechaSalida < this.props.fechaEntrada) {
      throw new ErrorDeValidacion('La fecha de salida no puede ser anterior a la de entrada');
    }
    return new Reserva({ ...this.props, estado: EstadoReserva.FINALIZADA, fechaSalida });
  }

  public cancelar(): Reserva {
    if (!this.estaActiva()) {
      throw new ErrorDeValidacion('Solo se puede cancelar una reserva ACTIVA');
    }
    return new Reserva({ ...this.props, estado: EstadoReserva.CANCELADA });
  }

  // Fábrica estática para crear nuevas reservas
  public static crear(props: {
    id: string;
    usuarioId: string;
    sedeId: string;
    modalidad: ModalidadReserva;
    codigoQr: string;
    fechaEntrada: Date;
  }): Reserva {
    if (props.id.trim().length === 0) {
      throw new Error('El id de la reserva es obligatorio');
    }
    if (props.usuarioId.trim().length === 0) {
      throw new Error('El usuarioId es obligatorio');
    }
    if (props.sedeId.trim().length === 0) {
      throw new Error('El sedeId es obligatorio');
    }
    if (!Object.values(ModalidadReserva).includes(props.modalidad)) {
      throw new ErrorDeValidacion('Modalidad de reserva no válida');
    }
    if (!PATRON_CODIGO_QR.test(props.codigoQr)) {
      throw new ErrorDeValidacion(`El código QR debe ser alfanumérico de ${LONGITUD_CODIGO_QR} caracteres`);
    }
    if (!(props.fechaEntrada instanceof Date) || isNaN(props.fechaEntrada.getTime())) {
      throw new ErrorDeValidacion('La fecha de entrada es obligatoria y debe ser válida');
    }

    return new Reserva({
      id: props.id,
      usuarioId: props.usuarioId,
      sedeId: props.sedeId,
      modalidad: props.modalidad,
      estado: EstadoReserva.ACTIVA,
      codigoQr: props.codigoQr,
      fechaEntrada: props.fechaEntrada,
      fechaSalida: undefined,
    });
  }

  // Genera un código QR aleatorio único
  public static generarCodigoQr(): string {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin I, O, 0, 1 para legibilidad
    let codigo = '';
    for (let i = 0; i < LONGITUD_CODIGO_QR; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  }

  // Rehidrata desde persistencia
  public static reconstituir(props: ReservaProps): Reserva {
    return new Reserva({ ...props });
  }
}