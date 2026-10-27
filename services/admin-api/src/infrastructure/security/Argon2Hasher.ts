import argon2, { type HashOptions } from 'argon2';
import type { PasswordHasher } from '../../domain/ports/PasswordHasher.js';

/**
 * Parámetros recomendados por OWASP para Argon2id (mínimo exigido):
 * 64 MiB de memoria, 3 iteraciones y 4 carriles. Se declaran explícitamente
 * para no heredar los valores por defecto si la librería cambia.
 */
const OPCIONES: HashOptions = {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MiB
  timeCost: 3,
  parallelism: 4,
};

/**
 * Adaptador del puerto PasswordHasher sobre la librería `argon2` (binding
 * nativo). El hash resultante es autocontenido: `$argon2id$v=19$m=65536,p=4,t=3$sal$digest`,
 * así que cambiar los parámetros no invalida los hashes ya guardados.
 */
export class Argon2Hasher implements PasswordHasher {
  public async hash(password: string): Promise<string> {
    return argon2.hash(password, OPCIONES);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      // Hash malformado o de un algoritmo no soportado: se trata como
      // credencial inválida, nunca como error que autentique.
      return false;
    }
  }
}
