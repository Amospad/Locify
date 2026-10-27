import { RegistrarOperadorUseCase } from '../../domain/use-cases/RegistrarOperador.js';
import type { UsuarioRepository } from '../../domain/ports/UsuarioRepository.js';
import type { EmailService } from '../../domain/ports/EmailService.js';
import type { GeneradorId } from '../../domain/ports/GeneradorId.js';
import type { Reloj } from '../../domain/ports/Reloj.js';

export class AdminService {
  private registrarOperadorUseCase: RegistrarOperadorUseCase;

  constructor(
    usuarioRepository: UsuarioRepository,
    emailService: EmailService,
    generadorId: GeneradorId,
    reloj: Reloj,
  ) {
    this.registrarOperadorUseCase = new RegistrarOperadorUseCase(
      usuarioRepository,
      emailService,
      generadorId,
      reloj,
    );
  }

  public async registrarOperador(email: string, passwordHash: string) {
    return this.registrarOperadorUseCase.ejecutar({ email, passwordHash });
  }
}
