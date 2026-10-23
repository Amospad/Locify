import { RegistrarOperadorUseCase } from '../../domain/use-cases/RegistrarOperador';
import { UsuarioRepository } from '../../domain/ports/UsuarioRepository';
import { EmailService } from '../../domain/ports/EmailService';

export class AdminService {
  private registrarOperadorUseCase: RegistrarOperadorUseCase;

  constructor(
    usuarioRepository: UsuarioRepository,
    emailService: EmailService
  ) {
    this.registrarOperadorUseCase = new RegistrarOperadorUseCase(usuarioRepository, emailService);
  }

  public async registrarOperador(email: string, passwordHash: string) {
    return this.registrarOperadorUseCase.ejecutar({ email, passwordHash });
  }
}