import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './src/prisma/contract.js';
import contractJson from './src/prisma/contract.json' with { type: 'json' };
import { hash } from 'argon2';
import { randomUUID } from 'crypto';

const contract = contractFromJson<Contract>(contractJson);
const db = postgres({ contract, url: process.env['DATABASE_URL']! });

async function seed() {
  console.log('Seeding 20 users + 20 sedes...');
  const passwordHash = await hash('Password123!');
  
  // Crear 20 usuarios: 10 conductores, 10 operadores
  const users = [];
  for (let i = 1; i <= 20; i++) {
    const rol = i <= 10 ? 'CONDUCTOR' : 'OPERADOR';
    const email = `${rol.toLowerCase()}${i}@test.com`;
    const exists = await db.orm.public.Usuario.where({ email }).first();
    if (!exists) {
      const id = randomUUID();
      await db.orm.public.Usuario.create({
        id,
        email,
        passwordHash,
        rol,
        estado: 'ACTIVO',
      });
      users.push({ id, email, rol });
      console.log(`Creado usuario ${email} (${rol})`);
    } else {
      console.log(`Usuario ${email} ya existe`);
    }
  }

  // Buscar operadores existentes (incluidos los creados en esta ejecución)
  const operadores = await db.orm.public.Usuario.where({ rol: 'OPERADOR' }).all();
  for (let i = 0; i < 20; i++) {
    const operador = operadores[i % operadores.length];
    const sedeId = randomUUID();
    const nombre = `Parqueadero ${i + 1}`;
    const direccion = `${i + 100} Calle ${i + 1} Medellín`;
    // Evitar duplicados por nombre
    const exists = await db.orm.public.Sede.where({ nombre }).first();
    if (!exists) {
      await db.orm.public.Sede.create({
        id: sedeId,
        nombre,
        direccion,
        latitud: 6.2442 + (Math.random() - 0.5) * 0.02,
        longitud: -75.5636 + (Math.random() - 0.5) * 0.02,
        capacidadTotal: 20 + Math.floor(Math.random() * 40),
        precioHora: 3500 + Math.floor(Math.random() * 3000),
        operadorId: operador.id,
      });
      console.log(`Creada sede ${nombre} para ${operador.email}`);
    } else {
      console.log(`Sede ${nombre} ya existe`);
    }
  }

  console.log('Seed completado.');
  await db.close();
}

seed().catch(console.error);
