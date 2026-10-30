import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;
async function migrate() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS ticket_kyb (
      id TEXT PRIMARY KEY,
      sede_id TEXT UNIQUE,
      operador_id TEXT,
      estado TEXT DEFAULT 'EN_REVISION',
      url_rut TEXT,
      url_camara_comercio TEXT,
      motivo_rechazo TEXT,
      fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
      fecha_actualizacion TIMESTAMPTZ
    )
  `);
  console.log('ticket_kyb table ensured');
  await client.end();
}
migrate();
