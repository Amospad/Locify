/**
 * La operación choca con un recurso que ya existe (por ejemplo, un email ya
 * registrado). La capa HTTP lo traduce a 409.
 */
export class ErrorDeConflicto extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorDeConflicto';
  }
}
