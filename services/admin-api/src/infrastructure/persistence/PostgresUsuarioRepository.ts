import type { UsuarioRepository } from '../../domain/ports/UsuarioRepository.js';
import {
  Usuario,
  EstadoUsuario,
  RolUsuario,
} from '../../domain/entities/Usuario.js';
import { db } from '../../prisma/db.js';

/** Fila tal como la devuelve el contrato de Prisma (modelo Usuario). */
interface UsuarioRow {
  id: string;
  email: string;
  passwordHash: string;
  rol: 'CONDUCTOR' | 'OPERADOR' | 'ADMIN';
  estado: 'PENDIENTE' | 'ACTIVO' | 'SUSPENDIDO';
  tokenInvitacion: string | null;
  tokenExpiracion: Date | null;
}

/**
 * Adaptador de salida del puerto UsuarioRepository sobre PostgreSQL vía Prisma.
 * Traduce entre el modelo de dominio inmutable (Usuario) y la tabla "usuario".
 */
export class PostgresUsuarioRepository implements UsuarioRepository {
  async guardar(usuario: Usuario): Promise<void> {
    const datos = {
      id: usuario.id,
      email: usuario.email,
      passwordHash: usuario.passwordHash,
      rol: usuario.rol,
      estado: usuario.estado,
      tokenInvitacion: usuario.tokenInvitacion ?? null,
      tokenExpiracion: usuario.tokenExpiracion ?? null,
    };

    // Upsert por clave primaria: guardar() inserta o actualiza el mismo id.
    await db.orm.public.Usuario.upsert({
      create: datos,
      update: {
        email: datos.email,
        passwordHash: datos.passwordHash,
        rol: datos.rol,
        estado: datos.estado,
        tokenInvitacion: datos.tokenInvitacion,
        tokenExpiracion: datos.tokenExpiracion,
      },
    });
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const fila = await db.orm.public.Usuario.where({ email }).first();
    return fila ? this.aDominio(fila) : null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const fila = await db.orm.public.Usuario.first({ id });
    return fila ? this.aDominio(fila) : null;
  }

  private aDominio(fila: UsuarioRow): Usuario {
    return Usuario.reconstituir({
      id: fila.id,
      email: fila.email,
      passwordHash: fila.passwordHash,
      rol: RolUsuario[fila.rol],
      estado: EstadoUsuario[fila.estado],
      tokenInvitacion: fila.tokenInvitacion ?? undefined,
      tokenExpiracion: fila.tokenExpiracion ?? undefined,
    });
  }
}
