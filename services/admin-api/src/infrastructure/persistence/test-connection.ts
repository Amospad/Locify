import { db } from '../../prisma/db.js';

async function main(): Promise<void> {
  const plan = db.raw.sql`SELECT 1 AS ok`.returnsRow({ ok: 'pg/int4@1' }).build();
  const rows = await db.query(plan);

  if (!rows.length) {
    throw new Error('Prisma conectó pero SELECT 1 no devolvió filas.');
  }

  console.log('✅ Conexión Prisma → PostgreSQL OK');
  console.log('Resultado:', rows);
}

main()
  .catch((error: unknown) => {
    console.error('❌ Falló la prueba de conexión de Prisma');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });
