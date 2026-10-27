/**
 * Puerto de hashing de contraseñas.
 *
 * El dominio nunca ve la contraseña en claro: recibe el texto plano del
 * adaptador de entrada, pide el hash a este puerto y persiste sólo el hash.
 * Cambiar Argon2id por otro algoritmo (o subir sus parámetros) no toca los
 * casos de uso.
 */
export interface PasswordHasher {
  /** Devuelve un hash autocontenido (algoritmo, parámetros y sal incluidos). */
  hash(password: string): Promise<string>;

  /** Compara una contraseña en claro con un hash almacenado. */
  compare(password: string, hash: string): Promise<boolean>;
}
