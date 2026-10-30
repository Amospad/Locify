import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import contractJson from './src/prisma/contract.json' with { type: 'json' };

const contract = contractFromJson(contractJson);
const db = postgres({ contract, url: process.env.DATABASE_URL! });

async function check() {
  try {
    const res = await db.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'sede'`);
    console.log('Columns in sede:', res.rows.map((r: any) => r.column_name));
  } catch (e) {
    console.error(e);
  } finally {
    await db.close();
  }
}

check();
