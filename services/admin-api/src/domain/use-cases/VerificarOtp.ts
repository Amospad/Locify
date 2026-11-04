import { Usuario, EstadoUsuario } from '../entities/Usuario.js';
import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';
import type { UsuarioRepository } from '../ports/UsuarioRepository.js';
import type { GeneradorId } from '../ports/GeneradorId.js';
import type { Reloj } from '../ports/Reloj.js';

interface VerificarOtpDTO {
  email: string;
  codigo: string;
}

export interface OtpVerificado {
  id: string;
  email: string;
  rol: string;
}

/**
 * Verifica el código OTP enviado al email del usuario.
 *
 * Flujo:
 * 1. Buscar usuario por email
 * 2. Verificar que el OTP coincida y no haya expirado
 * 3. Cambiar estado de PENDIENTE a ACTIVO
 * 4. Limpiar el token de invitación (que se usó para OTP)
 * 5. Persistir cambios
 */
export class VerificarOtpUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly generadorId: GeneradorId,
    private readonly reloj: Reloj,
  ) {}

  public async ejecutar(dto: VerificarOtpDTO): Promise<OtpVerificado> {
    const email = Usuario.validarEmail(dto.email);

    // 1. Buscar usuario
    const usuario = await this.usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new ErrorDeValidacion('Usuario no encontrado');
    }

    // 2. Verificar que esté en estado PENDIENTE (pendiente de OTP)
    if (usuario.estado !== EstadoUsuario.PENDIENTE) {
      throw new ErrorDeValidacion('Este usuario no está pendiente de verificación');
    }

    // 3. Verificar OTP
    if (!usuario.tokenInvitacion || usuario.tokenInvitacion !== dto.codigo.trim()) {
      throw new ErrorDeValidacion('Código OTP incorrecto');
    }

    // 4. Verificar expiración
    if (usuario.tokenHaExpirado(this.reloj.ahora())) {
      throw new ErrorDeValidacion('El código OTP ha expirado. Solicita uno nuevo.');
    }

    // 5. Cambiar estado a ACTIVO y limpiar token
    const usuarioActualizado = Usuario.reconstituir({
      id: usuario.id,
      email: usuario.email,
      passwordHash: usuario.passwordHash,
      rol: usuario.rol,
      estado: EstadoUsuario.ACTIVO,
      tokenInvitacion: undefined,
      tokenExpiracion: undefined,
    });

    // 6. Persistir
    await this.usuarioRepository.guardar(usuarioActualizado);

    return {
      id: usuarioActualizado.id,
      email: usuarioActualizado.email,
      rol: usuarioActualizado.rol,
    };
  }
}

/** Re-export para uso en capa HTTP */
export { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';