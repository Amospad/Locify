import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './contract.js';
import contractJson from './contract.json' with { type: 'json' };

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error('DATABASE_URL no está definida. Copia .env.example a .env.');
}

export const contract = contractFromJson<Contract>(contractJson);

export const db = postgres({
  contract,
  url: databaseUrl,
});
