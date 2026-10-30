import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';

/** Mínimo práctico: una sede debe tener nombre, dirección y coordenadas. */
const LONGITUD_MAXIMA_NOMBRE = 120;
const LONGITUD_MAXIMA_DIRECCION = 200;

export enum EstadoSede {
  ACTIVA = 'ACTIVA',
  PENDIENTE_KYB = 'PENDIENTE_KYB',
  RECHAZADA = 'RECHAZADA',
}

export interface SedeProps {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
  estado: EstadoSede;
  operadorId: string;
}

export class Sede {
  private constructor(private props: SedeProps) {}

  // Getters
  get id() { return this.props.id; }
  get nombre() { return this.props.nombre; }
  get direccion() { return this.props.direccion; }
  get latitud() { return this.props.latitud; }
  get longitud() { return this.props.longitud; }
  get capacidadTotal() { return this.props.capacidadTotal; }
  get precioHora() { return this.props.precioHora; }
  get estado() { return this.props.estado; }
  get operadorId() { return this.props.operadorId; }

  // Fábrica estática
  public static crear(props: SedeProps): Sede {
    const nombre = Sede.validarNombre(props.nombre);
    const direccion = Sede.validarDireccion(props.direccion);

    if (props.id.trim().length === 0) {
      throw new Error('El id es obligatorio');
    }

    if (!Number.isFinite(props.latitud) || props.latitud < -90 || props.latitud > 90) {
      throw new ErrorDeValidacion('La latitud debe estar entre -90 y 90');
    }

    if (!Number.isFinite(props.longitud) || props.longitud < -180 || props.longitud > 180) {
      throw new ErrorDeValidacion('La longitud debe estar entre -180 y 180');
    }

    if (!Number.isInteger(props.capacidadTotal) || props.capacidadTotal < 1) {
      throw new ErrorDeValidacion('La capacidad total debe ser un entero positivo');
    }

    if (!Number.isInteger(props.precioHora) || props.precioHora < 0) {
      throw new ErrorDeValidacion('El precio por hora debe ser un entero no negativo');
    }

    if (props.operadorId.trim().length === 0) {
      throw new ErrorDeValidacion('El operadorId es obligatorio');
    }

    // Copia defensiva
    return new Sede({ 
      ...props, 
      nombre, 
      direccion,
      estado: props.estado ?? EstadoSede.PENDIENTE_KYB
    });
  }

  public static validarNombre(nombre: string): string {
    const recortado = nombre.trim();
    if (recortado.length === 0 || recortado.length > LONGITUD_MAXIMA_NOMBRE) {
      throw new ErrorDeValidacion(
        `El nombre de la sede debe tener entre 1 y ${LONGITUD_MAXIMA_NOMBRE} caracteres`,
      );
    }
    return recortado;
  }

  public static validarDireccion(direccion: string): string {
    const recortada = direccion.trim();
    if (recortada.length === 0 || recortada.length > LONGITUD_MAXIMA_DIRECCION) {
      throw new ErrorDeValidacion(
        `La dirección debe tener entre 1 y ${LONGITUD_MAXIMA_DIRECCION} caracteres`,
      );
    }
    return recortada;
  }

  // Rehidrata desde persistencia (no revalida)
  public static reconstituir(props: SedeProps): Sede {
    return new Sede({ ...props });
  }
}