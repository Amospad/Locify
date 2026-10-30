import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './src/prisma/contract.js';
import contractJson from './src/prisma/contract.json' with { type: 'json' };
import { hash } from 'argon2';

const contract = contractFromJson<Contract>(contractJson);

const db = postgres({
  contract,
  url: process.env['DATABASE_URL']!,
});

async function seed() {
  console.log('Seeding database...');
  
  // Check existing users
  const existing = await db.orm.public.Usuario.where({}).all();
  console.log(`Existing users: ${existing.length}`);
  
  const passwordHash = await hash('Password123!');
  
  // Create test conductor
  const existingConductor = await db.orm.public.Usuario.where({ email: 'conductor@test.com' }).first();
  if (!existingConductor) {
    await db.orm.public.Usuario.create({
      email: 'conductor@test.com',
      passwordHash,
      rol: 'CONDUCTOR',
      estado: 'ACTIVO',
    });
    console.log('Created conductor@test.com');
  } else {
    console.log('conductor@test.com already exists');
  }

  // Create test admin
  const existingAdmin = await db.orm.public.Usuario.where({ email: 'admin@locify.co' }).first();
  if (!existingAdmin) {
    await db.orm.public.Usuario.create({
      email: 'admin@locify.co',
      passwordHash,
      rol: 'ADMIN',
      estado: 'ACTIVO',
    });
    console.log('Created admin@locify.co');
  } else {
    console.log('admin@locify.co already exists');
  }
  
  // Create test operador
  const existingOperador = await db.orm.public.Usuario.where({ email: 'operador@test.com' }).first();
  if (!existingOperador) {
    await db.orm.public.Usuario.create({
      email: 'operador@test.com',
      passwordHash,
      rol: 'OPERADOR',
      estado: 'ACTIVO',
    });
    console.log('Created operador@test.com');
  } else {
    console.log('operador@test.com already exists');
  }

  // Verify
  const users = await db.orm.public.Usuario.where({}).all();
  console.log(`Total users after seed: ${users.length}`);
  for (const u of users) {
    console.log(` - ${u.email} (${u.rol}) [${u.estado}]`);
  }

  await db.close();
}

seed().catch(console.error);