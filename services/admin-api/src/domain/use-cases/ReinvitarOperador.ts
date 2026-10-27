import { ErrorNoEncontrado } from '../errors/ErrorNoEncontrado.js';
import { ErrorEnvioDeInvitacion } from '../errors/ErrorEnvioDeInvitacion.js';
import type { OperadorRegistrado } from './RegistrarOperador.js';
import type { UsuarioRepository } from '../ports/UsuarioRepository.js';
import type { EmailService } from '../ports/EmailService.js';
import type { GeneradorId } from '../ports/GeneradorId.js';
import type { Reloj } from '../ports/Reloj.js';

const HORAS_VIGENCIA_INVITACION = 24;

/**
 * Reenvía la invitación a un operador que aún no ha activado su cuenta.
 *
 * Resuelve el callejón sin salida del registro: si el correo falló después de
 * persistir, el cliente recibe el id en el 502 y puede reinvitar sin duplicar
 * el usuario (que respondería 409).
 */
export class ReinvitarOperadorUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly emailService: EmailService,
    private readonly generadorId: GeneradorId,
    private readonly reloj: Reloj,
  ) {}

  public async ejecutar(id: string): Promise<OperadorRegistrado> {
    const usuario = await this.usuarioRepository.buscarPorId(id);

    if (!usuario) {
      throw new ErrorNoEncontrado('No existe un operador con ese id.');
    }

    const tokenInvitacion = this.generadorId.generar();
    const tokenExpiracion = new Date(
      this.reloj.ahora().getTime() + HORAS_VIGENCIA_INVITACION * 60 * 60 * 1000,
    );

    // La entidad valida que el estado sea PENDIENTE antes de renovar nada.
    const reinvitado = usuario.regenerarInvitacion(tokenInvitacion, tokenExpiracion);

    // Se persiste antes de enviar: si el SMTP falla, el token nuevo ya es el
    // vigente y reintentar la reinvitación es seguro (no queda un enlace
    // enviado que la base desconozca).
    await this.usuarioRepository.guardar(reinvitado);

    try {
      await this.emailService.enviarInvitacion(reinvitado.email, tokenInvitacion);
    } catch (error) {
      throw new ErrorEnvioDeInvitacion(error, {
        idOperador: reinvitado.id,
        mensaje: 'Se renovó la invitación, pero no se pudo enviar el correo.',
      });
    }

    return { id: reinvitado.id, email: reinvitado.email };
  }
}
