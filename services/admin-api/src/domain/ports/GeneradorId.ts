/**
 * Puerto de generación de identificadores.
 * El dominio no depende de `node:crypto`: la infraestructura decide cómo se
 * generan los UUID y las pruebas pueden usar una secuencia determinista.
 */
export interface GeneradorId {
  generar(): string;
}
