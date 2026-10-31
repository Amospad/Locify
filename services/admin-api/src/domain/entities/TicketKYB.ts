import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';

/** Mínimo práctico: un ticket KYB debe tener sede, operador y documentos. */
const LONGITUD_MAXIMA_MOTIVO = 500;
const LONGITUD_MINIMA_URL = 10;

export enum EstadoKYB {
  EN_REVISION = 'EN_REVISION',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

export interface TicketKYBProps {
  id: string;
  sedeId: string;
  operadorId: string;
  estado: EstadoKYB;
  urlRut: string;
  urlCamaraComercio: string;
  motivoRechazo?: string;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
}

export class TicketKYB {
  private constructor(private props: TicketKYBProps) {}

  // Getters
  get id() { return this.props.id; }
  get sedeId() { return this.props.sedeId; }
  get operadorId() { return this.props.operadorId; }
  get estado() { return this.props.estado; }
  get urlRut() { return this.props.urlRut; }
  get urlCamaraComercio() { return this.props.urlCamaraComercio; }
  get motivoRechazo() { return this.props.motivoRechazo; }
  get fechaCreacion() { return this.props.fechaCreacion; }
  get fechaActualizacion() { return this.props.fechaActualizacion; }

  // Fábrica estática
  public static crear(props: {
    id: string;
    sedeId: string;
    operadorId: string;
    urlRut: string;
    urlCamaraComercio: string;
    fechaCreacion: Date;
  }): TicketKYB {
    const { sedeId, operadorId, urlRut, urlCamaraComercio } = props;

    if (props.id.trim().length === 0) {
      throw new Error('El id es obligatorio');
    }

    if (sedeId.trim().length === 0) {
      throw new ErrorDeValidacion('El sedeId es obligatorio');
    }

    if (operadorId.trim().length === 0) {
      throw new ErrorDeValidacion('El operadorId es obligatorio');
    }

    TicketKYB.validarUrl(urlRut, 'RUT');
    TicketKYB.validarUrl(urlCamaraComercio, 'Cámara de Comercio');

    if (!(props.fechaCreacion instanceof Date) || isNaN(props.fechaCreacion.getTime())) {
      throw new ErrorDeValidacion('La fecha de creación es obligatoria y debe ser válida');
    }

    return new TicketKYB({
      ...props,
      estado: EstadoKYB.EN_REVISION,
    });
  }

  public static validarUrl(url: string, nombreCampo: string): string {
    const recortada = url.trim();
    if (recortada.length < LONGITUD_MINIMA_URL) {
      throw new ErrorDeValidacion(`${nombreCampo} debe tener al menos ${LONGITUD_MINIMA_URL} caracteres`);
    }
    return recortada;
  }

  public aprobar(): TicketKYB {
    if (this.props.estado === EstadoKYB.APROBADO) {
      throw new ErrorDeValidacion('El ticket ya está aprobado');
    }
    if (this.props.estado === EstadoKYB.RECHAZADO) {
      throw new ErrorDeValidacion('No se puede aprobar un ticket rechazado');
    }
    return new TicketKYB({
      ...this.props,
      estado: EstadoKYB.APROBADO,
      fechaActualizacion: new Date(),
    });
  }

  public rechazar(motivo: string): TicketKYB {
    const motivoRecortado = motivo.trim();
    if (this.props.estado === EstadoKYB.APROBADO) {
      throw new ErrorDeValidacion('No se puede rechazar un ticket aprobado');
    }
    if (this.props.estado === EstadoKYB.RECHAZADO) {
      throw new ErrorDeValidacion('El ticket ya está rechazado');
    }
    if (motivoRecortado.length === 0 || motivoRecortado.length > LONGITUD_MAXIMA_MOTIVO) {
      throw new ErrorDeValidacion(
        `El motivo debe tener entre 1 y ${LONGITUD_MAXIMA_MOTIVO} caracteres`,
      );
    }
    return new TicketKYB({
      ...this.props,
      estado: EstadoKYB.RECHAZADO,
      motivoRechazo: motivoRecortado,
      fechaActualizacion: new Date(),
    });
  }

  // Rehidrata desde persistencia
  public static reconstituir(props: TicketKYBProps): TicketKYB {
    return new TicketKYB({ ...props });
  }
}