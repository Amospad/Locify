import { Usuario } from '../entities/Usuario';

export interface UsuarioRepository {
  guardar(usuario: Usuario): Promise<void>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorId(id: string): Promise<Usuario | null>;
}