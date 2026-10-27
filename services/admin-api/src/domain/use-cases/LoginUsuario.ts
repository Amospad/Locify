import { CredencialesInvalidasError } from '../errors/CredencialesInvalidasError.js';
import { UsuarioNoActivoError } from '../errors/UsuarioNoActivoError.js';
import type { RolUsuario } from '../entities/Usuario.js';
import type { UsuarioRepository } from '../ports/UsuarioRepository.js';
import type { PasswordHasher } from '../ports/PasswordHasher.js';
import type { ServicioDeTokens } from '../ports/ServicioDeTokens.js';

/**
 * Hash Argon2id de una contraseña aleatoria descartada.
 *
 * Cuando el email no existe se compara igualmente contra este hash: así el
 * tiempo de respuesta es el mismo que con un usuario real y un atacante no
 * puede enumerar cuentas midiendo latencias. Nunca corresponde a una cuenta.
 */
const HASH_SEÑUELO =
  '$argon2id$v=19$m=65536,p=4,t=3$Yt+z6/l56mQrEsKb/lXyPQ$h+BaOysW6jOH7YFJxhu/GksEVQO41S+bU8XQIlavtzg';

export interface CredencialesDeAcceso {
  email: string;
  password: string;
}

export interface SesionIniciada {
  token: string;
  usuario: { id: string; email: string; rol: RolUsuario };
}

/**
 * Inicia sesión con email y contraseña (RF-07).
 *
 * Orden de comprobaciones, pensado para no filtrar información:
 * 1. Se busca el usuario por email normalizado; si no existe, se hace una
 *    comparación señuelo y se lanza el mismo error genérico.
 * 2. Se verifica la contraseña con Argon2id. Si falla: mismo error genérico.
 * 3. Sólo con la contraseña correcta se revela que la cuenta no está activa.
 * 4. Se firma un token con `id` y `rol`.
 */
export class LoginUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly servicioTokens: ServicioDeTokens,
  ) {}

  public async ejecutar({
    email,
    password,
  }: CredencialesDeAcceso): Promise<SesionIniciada> {
    const emailNormalizado = email.trim().toLowerCase();
    const usuario = await this.usuarioRepository.buscarPorEmail(emailNormalizado);

    if (!usuario) {
      // Señuelo: gastar el mismo Argon2 que un usuario real antes de fallar.
      await this.passwordHasher.compare(password, HASH_SEÑUELO);
      throw new CredencialesInvalidasError();
    }

    const passwordValida = await this.passwordHasher.compare(
      password,
      usuario.passwordHash,
    );

    if (!passwordValida) {
      throw new CredencialesInvalidasError();
    }

    if (!usuario.estaActivo()) {
      throw new UsuarioNoActivoError();
    }

    const token = await this.servicioTokens.firmar({
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return {
      token,
      usuario: { id: usuario.id, email: usuario.email, rol: usuario.rol },
    };
  }
}
