import { Usuario, RolUsuario, EstadoUsuario } from '../entities/Usuario.js';
import { UsuarioRepository } from '../ports/UsuarioRepository.js';
import { EmailService } from '../ports/EmailService.js';
import { randomUUID } from 'crypto';

interface RegistrarOperadorDTO {
  email: string;
  passwordHash: string;
}

export class RegistrarOperadorUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly emailService: EmailService
  ) {}

  public async ejecutar(dto: RegistrarOperadorDTO): Promise<void> {
    // 1. Validar que el correo no exista
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(dto.email);
    if (usuarioExistente) {
      throw new Error('El correo ya está registrado en el sistema.');
    }

    // 2. Generar token de invitación (24 horas)
    const tokenInvitacion = randomUUID();
    const tokenExpiracion = new Date();
    tokenExpiracion.setHours(tokenExpiracion.getHours() + 24);

    // 3. Crear la entidad (aquí se aplican las reglas de negocio)
    const nuevoOperador = Usuario.crear({
      id: randomUUID(),
      email: dto.email,
      passwordHash: dto.passwordHash,
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.PENDIENTE,
      tokenInvitacion,
      tokenExpiracion,
    });

    // 4. Persistir en base de datos (a través del puerto)
    await this.usuarioRepository.guardar(nuevoOperador);

    // 5. Enviar correo de invitación (a través del puerto)
    await this.emailService.enviarInvitacion(nuevoOperador.email, tokenInvitacion);
  }
}