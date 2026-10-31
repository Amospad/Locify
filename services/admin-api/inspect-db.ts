import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import contractJson from './src/prisma/contract.json' with { type: 'json' };

const contract = contractFromJson(contractJson);

const db = postgres({
  contract,
  url: process.env['DATABASE_URL']!,
});

console.log('db:', Object.keys(db));
console.log('orm:', Object.keys(db.orm));
console.log('orm.public:', Object.keys(db.orm.public));
console.log('orm.public.Usuario:', db.orm.public.Usuario);
console.log('orm.public.Usuario prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(db.orm.public.Usuario)));