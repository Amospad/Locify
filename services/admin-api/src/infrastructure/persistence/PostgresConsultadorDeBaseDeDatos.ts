import type { ConsultadorDeBaseDeDatos } from '../../application/ports/ConsultadorDeBaseDeDatos.js';
import { db } from '../../prisma/db.js';

/**
 * Adaptador de salida del puerto de salud sobre PostgreSQL vía Prisma.
 * `SELECT 1` no toca tablas: sólo comprueba que hay conexión viva.
 */
export class PostgresConsultadorDeBaseDeDatos implements ConsultadorDeBaseDeDatos {
  async consultar(): Promise<readonly unknown[]> {
    const plan = db.raw.sql`SELECT 1 AS ok`.returnsRow({ ok: 'pg/int4@1' }).build();
    return db.query(plan);
  }

  async cerrar(): Promise<void> {
    await db.close();
  }
}
