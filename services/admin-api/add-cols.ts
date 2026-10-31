import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

async function migrate() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(`ALTER TABLE sede ADD COLUMN IF NOT EXISTS operador_id TEXT`);
    await client.query(`ALTER TABLE sede ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'PENDIENTE_KYB'`);
    console.log('Columns added');
  } catch (e) {
    console.error(e);
  }
  await client.end();
}
migrate();
