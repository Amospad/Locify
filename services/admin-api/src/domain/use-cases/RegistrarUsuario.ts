import { Usuario, RolUsuario, EstadoUsuario } from '../entities/Usuario.js';
import { PoliticaPassword } from '../value-objects/PoliticaPassword.js';
import { ErrorDeConflicto } from '../errors/ErrorDeConflicto.js';
import type { UsuarioRepository } from '../ports/UsuarioRepository.js';
import type { EmailService } from '../ports/EmailService.js';
import type { GeneradorId } from '../ports/GeneradorId.js';
import type { Reloj } from '../ports/Reloj.js';
import type { PasswordHasher } from '../ports/PasswordHasher.js';

interface RegistrarUsuarioDTO {
  email: string;
  /** Contraseña en claro; sólo vive en memoria hasta que se hashea. */
  password: string;
  /** Nombre completo del usuario */
  nombre: string;
  /** Número de celular para OTP */
  celular: string;
}

/**
 * Resultado del registro. Es lo único que la capa HTTP puede devolver:
 * nunca el hash, ni el token de invitación, ni la contraseña.
 */
export interface UsuarioRegistrado {
  id: string;
  email: string;
}

/**
 * Registra un conductor (autoregistro).
 *
 * Flujo:
 * 1. Validar email y contraseña (política de contraseñas)
 * 2. Verificar que el email no exista
 * 3. Hashear la contraseña
 * 4. Generar código OTP y guardarlo temporalmente
 * 5. Crear la entidad Usuario con estado INCOMPLETO (pendiente OTP)
 * 6. Persistir en base de datos
 * 7. Enviar OTP por email/SMS
 */
export class RegistrarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly emailService: EmailService,
    private readonly generadorId: GeneradorId,
    private readonly reloj: Reloj,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public async ejecutar(dto: RegistrarUsuarioDTO): Promise<UsuarioRegistrado> {
    // Se normaliza y valida antes de consultar y antes de hashear
    const email = Usuario.validarEmail(dto.email);

    // 1. Validar la contraseña antes de cualquier trabajo costoso
    PoliticaPassword.validar(dto.password);

    // 2. Validar que el correo no exista
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new ErrorDeConflicto('El correo ya está registrado en el sistema.');
    }

    // 3. Validar celular (formato colombiano básico)
    this.validarCelular(dto.celular);

    // 4. Hashear la contraseña
    const passwordHash = await this.passwordHasher.hash(dto.password);

    // 5. Generar OTP (6 dígitos)
    const codigoOtp = this.generarOtp();
    const otpExpiracion = new Date(
      this.reloj.ahora().getTime() + 15 * 60 * 1000, // 15 minutos
    );

    // 6. Crear la entidad (estado INCOMPLETO hasta verificar OTP)
    const nuevoUsuario = Usuario.crear({
      id: this.generadorId.generar(),
      email,
      passwordHash,
      rol: RolUsuario.CONDUCTOR,
      estado: EstadoUsuario.PENDIENTE, // PENDIENTE = pendiente de OTP
      tokenInvitacion: codigoOtp, // Reutilizamos el campo para OTP temporal
      tokenExpiracion: otpExpiracion,
    });

    // 7. Persistir en base de datos
    await this.usuarioRepository.guardar(nuevoUsuario);

    // 8. Enviar OTP por email
    try {
      await this.emailService.enviarOtp(nuevoUsuario.email, codigoOtp);
    } catch (error) {
      // Si falla el envío, el usuario queda PENDIENTE; se propaga el error
      throw new ErrorEnvioDeOtp(error, { idUsuario: nuevoUsuario.id });
    }

    return { id: nuevoUsuario.id, email: nuevoUsuario.email };
  }

  private validarCelular(celular: string): void {
    const limpio = celular.replace(/\D/g, '');
    // Formato colombiano: 10 dígitos empezando por 3
    if (limpio.length !== 10 || !limpio.startsWith('3')) {
      throw new ErrorDeValidacion('El número de celular debe tener 10 dígitos y empezar por 3 (formato colombiano).');
    }
  }

  private generarOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

/** Error específico cuando falla el envío de OTP pero el usuario ya se creó. */
export class ErrorEnvioDeOtp extends Error {
  constructor(
    causa: unknown,
    public readonly contexto: { idUsuario: string },
  ) {
    super(`Usuario creado pero no se pudo enviar el OTP: ${causa instanceof Error ? causa.message : String(causa)}`);
    this.name = 'ErrorEnvioDeOtp';
  }
}

/** Re-export para uso en capa HTTP */
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
export { ErrorDeValidacion };