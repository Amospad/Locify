import { Usuario, RolUsuario, EstadoUsuario } from '../entities/Usuario.js';
import { PoliticaPassword } from '../value-objects/PoliticaPassword.js';
import type { UsuarioRepository } from '../ports/UsuarioRepository.js';
import type { EmailService } from '../ports/EmailService.js';
import type { GeneradorId } from '../ports/GeneradorId.js';
import type { Reloj } from '../ports/Reloj.js';
import type { PasswordHasher } from '../ports/PasswordHasher.js';

const HORAS_VIGENCIA_INVITACION = 24;

interface RegistrarOperadorDTO {
  email: string;
  /** Contraseña en claro; sólo vive en memoria hasta que se hashea. */
  password: string;
}

export class RegistrarOperadorUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly emailService: EmailService,
    private readonly generadorId: GeneradorId,
    private readonly reloj: Reloj,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public async ejecutar(dto: RegistrarOperadorDTO): Promise<void> {
    // Se normaliza y valida antes de consultar y antes de hashear: PostgreSQL
    // compara emails distinguiendo mayúsculas, así que "Admin@X.co" y
    // "admin@x.co" serían cuentas distintas, y un email inválido no debe
    // consumir 64 MiB de Argon2.
    const email = Usuario.validarEmail(dto.email);

    // 1. Validar la contraseña antes de cualquier trabajo costoso (RF-06).
    PoliticaPassword.validar(dto.password);

    // 2. Validar que el correo no exista
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new Error('El correo ya está registrado en el sistema.');
    }

    // 3. Hashear la contraseña. Argon2 es deliberadamente costoso, por eso se
    //    ejecuta después de las validaciones y nunca se registra en logs.
    const passwordHash = await this.passwordHasher.hash(dto.password);

    // 4. Generar token de invitación (24 horas)
    const tokenInvitacion = this.generadorId.generar();
    const tokenExpiracion = new Date(
      this.reloj.ahora().getTime() + HORAS_VIGENCIA_INVITACION * 60 * 60 * 1000,
    );

    // 5. Crear la entidad (aquí se aplican las reglas de negocio)
    const nuevoOperador = Usuario.crear({
      id: this.generadorId.generar(),
      email,
      passwordHash,
      rol: RolUsuario.OPERADOR,
      estado: EstadoUsuario.PENDIENTE,
      tokenInvitacion,
      tokenExpiracion,
    });

    // 6. Persistir en base de datos (a través del puerto)
    //
    // Riesgo conocido: el guardado y el envío del correo son dos escrituras
    // independientes. Si el correo falla, el usuario queda PENDIENTE; el error
    // se propaga para que el llamador reintente la invitación (o para que un
    // outbox lo haga). El índice UNIQUE de email en la base es la última
    // barrera ante dos peticiones concurrentes que pasen el paso 2.
    await this.usuarioRepository.guardar(nuevoOperador);

    // 7. Enviar correo de invitación (a través del puerto)
    await this.emailService.enviarInvitacion(nuevoOperador.email, tokenInvitacion);
  }
}
