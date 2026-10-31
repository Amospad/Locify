import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'sede'`);
  console.log('Columns in sede:', res.rows.map(r => r.column_name));
  await client.end();
}

check().catch(console.error);
