/**
 * La entrada del usuario no cumple una regla de negocio (email o contraseña).
 *
 * Es un error del cliente, no del servidor: la capa HTTP lo traduce a 400 y
 * devuelve el mensaje, que está escrito para ser mostrado a una persona.
 */
export class ErrorDeValidacion extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorDeValidacion';
  }
}
