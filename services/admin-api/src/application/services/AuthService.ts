import { LoginUsuarioUseCase } from '../../domain/use-cases/LoginUsuario.js';
import type { SesionIniciada } from '../../domain/use-cases/LoginUsuario.js';
import type { UsuarioRepository } from '../../domain/ports/UsuarioRepository.js';
import type { PasswordHasher } from '../../domain/ports/PasswordHasher.js';
import type { ServicioDeTokens } from '../../domain/ports/ServicioDeTokens.js';

/**
 * Puerto de entrada del módulo de identidad para la capa HTTP.
 *
 * La ruta de login depende de esta interfaz estructural, no de la clase: las
 * pruebas pueden sustituirla sin instanciar Argon2 ni JWT.
 */
export class AuthService {
  private readonly loginUseCase: LoginUsuarioUseCase;

  constructor(
    usuarioRepository: UsuarioRepository,
    passwordHasher: PasswordHasher,
    servicioTokens: ServicioDeTokens,
  ) {
    this.loginUseCase = new LoginUsuarioUseCase(
      usuarioRepository,
      passwordHasher,
      servicioTokens,
    );
  }

  /** Verifica credenciales y devuelve token + datos públicos del usuario. */
  public async iniciarSesion(email: string, password: string): Promise<SesionIniciada> {
    return this.loginUseCase.ejecutar({ email, password });
  }
}
