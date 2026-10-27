import { Usuario, RolUsuario, EstadoUsuario } from '../entities/Usuario.js';
import type { UsuarioRepository } from '../ports/UsuarioRepository.js';
import type { EmailService } from '../ports/EmailService.js';
import type { GeneradorId } from '../ports/GeneradorId.js';
import type { Reloj } from '../ports/Reloj.js';

const HORAS_VIGENCIA_INVITACION = 24;

interface RegistrarOperadorDTO {
  email: string;
  passwordHash: string;
}

export class RegistrarOperadorUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly emailService: EmailService,
    private readonly generadorId: GeneradorId,
    private readonly reloj: Reloj,
  ) {}

  public async ejecutar(dto: RegistrarOperadorDTO): Promise<void> {
    // Se normaliza antes de consultar: PostgreSQL compara emails distinguiendo
    // mayúsculas, así que "Admin@X.co" y "admin@x.co" serían cuentas distintas.
    const email = dto.email.trim().toLowerCase();

    // 1. Validar que el correo no exista
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new Error('El correo ya está registrado en el sistema.');
    }

    // 2. Generar token de invitación (24 horas)
    const tokenInvitacion = this.generadorId.generar();
    const tokenExpiracion = new Date(
      this.reloj.ahora().getTime() + HORAS_VIGENCIA_INVITACION * 60 * 60 * 1000,
    );

    // 3. Crear la entidad (aquí se aplican las reglas de negocio)
    const nuevoOperador = Usuario.crear({
      id: this.generadorId.generar(),
      email,
      passwordHash: dto.passwordHash,
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.PENDIENTE,
      tokenInvitacion,
      tokenExpiracion,
    });

    // 4. Persistir en base de datos (a través del puerto)
    //
    // Riesgo conocido: el guardado y el envío del correo son dos escrituras
    // independientes. Si el correo falla, el usuario queda PENDIENTE; el error
    // se propaga para que el llamador reintente la invitación (o para que un
    // outbox lo haga). El índice UNIQUE de email en la base es la última
    // barrera ante dos peticiones concurrentes que pasen el paso 1.
    await this.usuarioRepository.guardar(nuevoOperador);

    // 5. Enviar correo de invitación (a través del puerto)
    await this.emailService.enviarInvitacion(nuevoOperador.email, tokenInvitacion);
  }
}
