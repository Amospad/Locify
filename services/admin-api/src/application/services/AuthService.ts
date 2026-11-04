import { LoginUsuarioUseCase } from '../../domain/use-cases/LoginUsuario.js';
import { RegistrarUsuarioUseCase } from '../../domain/use-cases/RegistrarUsuario.js';
import { VerificarOtpUseCase } from '../../domain/use-cases/VerificarOtp.js';
import type { SesionIniciada } from '../../domain/use-cases/LoginUsuario.js';
import type { UsuarioRegistrado } from '../../domain/use-cases/RegistrarUsuario.js';
import type { OtpVerificado } from '../../domain/use-cases/VerificarOtp.js';
import type { UsuarioRepository } from '../../domain/ports/UsuarioRepository.js';
import type { EmailService } from '../../domain/ports/EmailService.js';
import type { PasswordHasher } from '../../domain/ports/PasswordHasher.js';
import type { ServicioDeTokens } from '../../domain/ports/ServicioDeTokens.js';
import type { GeneradorId } from '../../domain/ports/GeneradorId.js';
import type { Reloj } from '../../domain/ports/Reloj.js';

/**
 * Puerto de entrada del módulo de identidad para la capa HTTP.
 *
 * La ruta de login depende de esta interfaz estructural, no de la clase: las
 * pruebas pueden sustituirla sin instanciar Argon2 ni JWT.
 */
export class AuthService {
  private readonly loginUseCase: LoginUsuarioUseCase;
  private readonly registrarUsuarioUseCase: RegistrarUsuarioUseCase;
  private readonly verificarOtpUseCase: VerificarOtpUseCase;

  constructor(
    usuarioRepository: UsuarioRepository,
    emailService: EmailService,
    passwordHasher: PasswordHasher,
    servicioTokens: ServicioDeTokens,
    generadorId: GeneradorId,
    reloj: Reloj,
  ) {
    this.loginUseCase = new LoginUsuarioUseCase(
      usuarioRepository,
      passwordHasher,
      servicioTokens,
    );
    this.registrarUsuarioUseCase = new RegistrarUsuarioUseCase(
      usuarioRepository,
      emailService,
      generadorId,
      reloj,
      passwordHasher,
    );
    this.verificarOtpUseCase = new VerificarOtpUseCase(
      usuarioRepository,
      generadorId,
      reloj,
    );
  }

  /** Verifica credenciales y devuelve token + datos públicos del usuario. */
  public async iniciarSesion(email: string, password: string): Promise<SesionIniciada> {
    return this.loginUseCase.ejecutar({ email, password });
  }

  /** Registra un nuevo usuario (Conductor) y envía OTP. */
  public async registrarUsuario(dto: {
    email: string;
    password: string;
    nombre: string;
    celular: string;
  }): Promise<UsuarioRegistrado> {
    return this.registrarUsuarioUseCase.ejecutar(dto);
  }

  /** Verifica el código OTP y activa la cuenta. */
  public async verificarOtp(email: string, codigo: string): Promise<OtpVerificado> {
    return this.verificarOtpUseCase.ejecutar({ email, codigo });
  }
}
