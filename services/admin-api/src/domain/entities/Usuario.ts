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
  get rol() { return this.props.rol; }
  get estado() { return this.props.estado; }
  get tokenInvitacion() { return this.props.tokenInvitacion; }
  get tokenExpiracion() { return this.props.tokenExpiracion; }

  // Reglas de negocio (Métodos)
  public estaActivo(): boolean {
    return this.props.estado === EstadoUsuario.ACTIVO;
  }

  public puedeAccederAlDashboard(): boolean {
    return this.estaActivo() && !this.tokenHaExpirado();
  }

  public tokenHaExpirado(): boolean {
    if (!this.props.tokenExpiracion) return false;
    return new Date() > this.props.tokenExpiracion;
  }

  // Fábrica estática para crear usuarios de forma controlada
  public static crear(props: UsuarioProps): Usuario {
    if (!props.email.includes('@')) {
      throw new Error('El email no es válido');
    }
    return new Usuario(props);
  }
}