/**
 * Puerto de tiempo. Inyectar el reloj hace deterministas las reglas con
 * expiración (token de invitación) en lugar de depender de `new Date()`.
 */
export interface Reloj {
  ahora(): Date;
}
