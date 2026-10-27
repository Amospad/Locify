import { ErrorDeValidacion } from '../errors/ErrorDeValidacion.js';

/**
 * Lista de contraseñas comunes (filtraciones públicas y variantes obvias en
 * español). Se compara en minúsculas y por coincidencia exacta: no pretende
 * ser exhaustiva, sólo bloquear las elecciones más predecibles antes de que
 * lleguen a Argon2.
 */
const CONTRASEÑAS_COMUNES: ReadonlySet<string> = new Set([
  'password', '123456', '123456789', '12345678', '12345', 'qwerty', 'abc123',
  'password1', '1234567', '111111', 'iloveyou', 'admin', '123123', '1234567890',
  '000000', 'monkey', 'dragon', 'football', 'letmein', 'welcome', '654321',
  'qwerty123', '1q2w3e4r', 'sunshine', 'princess', 'admin123', '1234',
  '12345678910', 'p@ssw0rd', 'passw0rd', 'password123', '1qaz2wsx', 'qwertyuiop',
  '123321', '666666', '888888', '123qwe', '1q2w3e', '987654321', '112233',
  '121212', '555555', '131313', '777777', '159753', '147258369', '123654',
  '5201314', '000000000', '999999', '333333', '444444', '222222', '121314',
  'qazwsx', 'asdfgh', 'zxcvbnm', 'qwerty12345', '12341234', '12344321',
  '1qazxsw2', 'q1w2e3r4', '123abc', 'a123456', 'abcd1234', 'password!',
  'password12', 'password1234', 'password12345', 'password1234!', 'password@123',
  'p@ssw0rd123', 'welcome1', 'welcome123', 'welcome1234', 'welcome12345!',
  'admin123456!', 'qwerty12345!', 'letmein123!', 'iloveyou123!', 'football123!',
  'contraseña', 'contraseña1', 'contraseña123', 'contraseña123!', 'usuario123',
  'colombia123', 'medellin123', 'parqueadero1', 'locify123', 'qwerty1',
  'asdf1234', 'zxcv1234', '1q2w3e4r5t', '!qaz2wsx', '123456a', 'a1234567',
  '1password', 'whatever', 'trustno1',
]);

const LONGITUD_MINIMA = 12;
const LONGITUD_MAXIMA = 128;

/** Categorías Unicode: funcionan con "Ñ", "á" o caracteres de otros alfabetos. */
const TIENE_MAYUSCULA = /\p{Lu}/u;
const TIENE_MINUSCULA = /\p{Ll}/u;
const TIENE_NUMERO = /\p{N}/u;
/** Cualquier cosa que no sea letra ni número (puntuación, símbolo, emoji, espacio). */
const TIENE_ESPECIAL = /[^\p{L}\p{N}]/u;

/**
 * Política de complejidad de contraseñas (RF-06).
 *
 * Se valida sobre el texto plano **antes** de hashear: una contraseña débil no
 * debe consumir 64 MiB de Argon2 ni llegar a persistirse.
 */
export class PoliticaPassword {
  /**
   * Valida la contraseña y lanza `Error` con un mensaje accionable si no
   * cumple. No devuelve booleano a propósito: obliga al llamador a decidir
   * explícitamente qué hacer con el rechazo.
   */
  public static validar(password: string): void {
    // Se cuenta por puntos de código: un emoji es 1 carácter, no 2 unidades UTF-16.
    const longitud = Array.from(password).length;

    if (longitud < LONGITUD_MINIMA) {
      throw new ErrorDeValidacion(
        `La contraseña debe tener al menos ${LONGITUD_MINIMA} caracteres.`,
      );
    }

    if (longitud > LONGITUD_MAXIMA) {
      throw new ErrorDeValidacion(
        `La contraseña no puede superar los ${LONGITUD_MAXIMA} caracteres.`,
      );
    }

    if (!TIENE_MAYUSCULA.test(password)) {
      throw new ErrorDeValidacion('La contraseña debe incluir al menos una mayúscula.');
    }

    if (!TIENE_MINUSCULA.test(password)) {
      throw new ErrorDeValidacion('La contraseña debe incluir al menos una minúscula.');
    }

    if (!TIENE_NUMERO.test(password)) {
      throw new ErrorDeValidacion('La contraseña debe incluir al menos un número.');
    }

    if (!TIENE_ESPECIAL.test(password)) {
      throw new ErrorDeValidacion('La contraseña debe incluir al menos un carácter especial.');
    }

    if (CONTRASEÑAS_COMUNES.has(password.toLowerCase())) {
      throw new ErrorDeValidacion(
        'La contraseña es demasiado común; elige una que no aparezca en listas de filtraciones.',
      );
    }
  }
}
