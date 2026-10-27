/**
 * El recurso solicitado no existe. La capa HTTP lo traduce a 404.
 *
 * Se distingue de `ErrorDeValidacion` para no confundir "el id está mal" con
 * "el id es válido pero no hay nada con ese id".
 */
export class ErrorNoEncontrado extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorNoEncontrado';
  }
}
