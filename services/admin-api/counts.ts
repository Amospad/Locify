import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;
async function count() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const users = await client.query(`SELECT COUNT(*) FROM usuario`);
  const sedes = await client.query(`SELECT COUNT(*) FROM sede`);
  const tickets = await client.query(`SELECT COUNT(*) FROM ticket_kyb`);
  console.log('usuarios', users.rows[0].count);
  console.log('sedes', sedes.rows[0].count);
  console.log('tickets', tickets.rows[0].count);
  await client.end();
}
count();
