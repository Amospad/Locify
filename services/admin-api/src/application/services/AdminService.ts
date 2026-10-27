import { RegistrarOperadorUseCase } from '../../domain/use-cases/RegistrarOperador.js';
import { ReinvitarOperadorUseCase } from '../../domain/use-cases/ReinvitarOperador.js';
import type { OperadorRegistrado } from '../../domain/use-cases/RegistrarOperador.js';
import type { UsuarioRepository } from '../../domain/ports/UsuarioRepository.js';
import type { EmailService } from '../../domain/ports/EmailService.js';
import type { GeneradorId } from '../../domain/ports/GeneradorId.js';
import type { Reloj } from '../../domain/ports/Reloj.js';
import type { PasswordHasher } from '../../domain/ports/PasswordHasher.js';

export class AdminService {
  private registrarOperadorUseCase: RegistrarOperadorUseCase;
  private reinvitarOperadorUseCase: ReinvitarOperadorUseCase;

  constructor(
    usuarioRepository: UsuarioRepository,
    emailService: EmailService,
    generadorId: GeneradorId,
    reloj: Reloj,
    passwordHasher: PasswordHasher,
  ) {
    this.registrarOperadorUseCase = new RegistrarOperadorUseCase(
      usuarioRepository,
      emailService,
      generadorId,
      reloj,
      passwordHasher,
    );

    this.reinvitarOperadorUseCase = new ReinvitarOperadorUseCase(
      usuarioRepository,
      emailService,
      generadorId,
      reloj,
    );
  }

  /** Recibe la contraseña en claro; el caso de uso la hashea antes de persistir. */
  public async registrarOperador(email: string, password: string): Promise<OperadorRegistrado> {
    return this.registrarOperadorUseCase.ejecutar({ email, password });
  }

  /** Renueva el token de un operador PENDIENTE y reenvía la invitación. */
  public async reinvitarOperador(id: string): Promise<OperadorRegistrado> {
    return this.reinvitarOperadorUseCase.ejecutar(id);
  }
}
