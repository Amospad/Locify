/**
 * Puerto de salud de la base de datos. La capa HTTP sólo necesita saber si el
 * almacenamiento responde; cómo se ejecuta la consulta (Prisma, `pg`, un doble
 * de prueba) es un detalle del adaptador.
 */
export interface ConsultadorDeBaseDeDatos {
  /** Devuelve al menos una fila si la base responde; lanza si no es alcanzable. */
  consultar(): Promise<readonly unknown[]>;

  /** Libera las conexiones del adaptador al apagar el servidor. */
  cerrar(): Promise<void>;
}
