import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;
async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_name = 'ticket_kyb'`);
  console.log(res.rows);
  const cols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'ticket_kyb'`);
  console.log(cols.rows);
  await client.end();
}
check();
