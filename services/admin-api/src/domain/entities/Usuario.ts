import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';

export enum RolUsuario {
  CONDUCTOR = 'CONDUCTOR',
  OPERADOR = 'OPERADOR',
  ADMIN = 'ADMIN',
}

export enum EstadoUsuario {
  PENDIENTE = 'PENDIENTE',
  ACTIVO = 'ACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
}

/** Formato mínimo aceptable: algo@dominio.tld (RFC 5321 práctico). */
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** BCrypt ($2a/$2b/$2y) o Argon2 ($argon2i/$argon2d/$argon2id). */
const PATRON_HASH = /^\$(2[aby]|argon2(?:i|d|id))\$/
const LONGITUD_MAXIMA_EMAIL = 254;

export interface UsuarioProps {
  id: string;
  email: string;
  passwordHash: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  tokenInvitacion?: string;
  tokenExpiracion?: Date;
}

export class Usuario {
  private constructor(private props: UsuarioProps) {}

  // Getters
  get id() { return this.props.id; }
  get email() { return this.props.email; }
  get passwordHash() { return this.props.passwordHash; }
  get rol() { return this.props.rol; }
  get estado() { return this.props.estado; }
  get tokenInvitacion() { return this.props.tokenInvitacion; }
  get tokenExpiracion() { return this.props.tokenExpiracion; }

  // Reglas de negocio (Métodos)
  public estaActivo(): boolean {
    return this.props.estado === EstadoUsuario.ACTIVO;
  }

  public puedeAccederAlDashboard(ahora: Date = new Date()): boolean {
    return this.estaActivo() && !this.tokenHaExpirado(ahora);
  }

  public tokenHaExpirado(ahora: Date = new Date()): boolean {
    if (!this.props.tokenExpiracion) return false;
    return ahora.getTime() > this.props.tokenExpiracion.getTime();
  }

  /**
   * Renueva el token de invitación y devuelve una **nueva** instancia: la
   * entidad es inmutable.
   *
   * Regla de negocio: sólo un usuario PENDIENTE puede ser reinvitado. Uno
   * ACTIVO ya tiene credenciales y uno SUSPENDIDO no debe recibir un enlace
   * nuevo. Se lanza `ErrorDeValidacion` porque la capa HTTP responde 400.
   */
  public regenerarInvitacion(tokenInvitacion: string, tokenExpiracion: Date): Usuario {
    if (this.props.estado !== EstadoUsuario.PENDIENTE) {
      throw new ErrorDeValidacion(
        'Solo se puede reinvitar a un operador en estado PENDIENTE.',
      );
    }

    if (tokenInvitacion.trim().length === 0) {
      throw new Error('El token de invitación es obligatorio');
    }

    return new Usuario({
      ...this.props,
      tokenInvitacion,
      tokenExpiracion,
    });
  }

  // Fábrica estática para crear usuarios de forma controlada
  public static crear(props: UsuarioProps): Usuario {
    const email = Usuario.validarEmail(props.email);

    if (!PATRON_HASH.test(props.passwordHash)) {
      throw new Error(
        'passwordHash debe ser un hash BCrypt o Argon2; nunca una contraseña en claro',
      );
    }

    if (props.id.trim().length === 0) {
      throw new Error('El id es obligatorio');
    }

    // Copia defensiva: el llamador no puede mutar el estado interno de la entidad.
    return new Usuario({ ...props, email });
  }

  /**
   * Normaliza y valida un email antes de cualquier trabajo costoso. El caso de
   * uso la llama antes de hashear: hashear un email inválido gastaría 64 MiB
   * de Argon2 para luego rechazarlo en `crear`.
   */
  public static validarEmail(email: string): string {
    const normalizado = email.trim().toLowerCase();

    if (
      normalizado.length === 0 ||
      normalizado.length > LONGITUD_MAXIMA_EMAIL ||
      !PATRON_EMAIL.test(normalizado)
    ) {
      throw new ErrorDeValidacion('El email no es válido');
    }

    return normalizado;
  }

  // Rehidrata un usuario que ya existe en persistencia. No revalida los datos:
  // son un hecho consumado, validarlos aquí impediría leer registros históricos.
  public static reconstituir(props: UsuarioProps): Usuario {
    return new Usuario({ ...props });
  }
}