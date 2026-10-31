import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import contractJson from './src/prisma/contract.json' with { type: 'json' };
import { randomUUID } from 'crypto';

const contract = contractFromJson(contractJson);
const db = postgres({ contract, url: process.env.DATABASE_URL! });

async function seedTickets() {
  const sedes = await db.orm.public.Sede.all();
  for (const sede of sedes) {
    const exists = await db.orm.public.TicketKYB.where({ sedeId: sede.id }).first();
    if (!exists) {
      await db.orm.public.TicketKYB.create({
        id: randomUUID(),
        sedeId: sede.id,
        operadorId: sede.operadorId,
        estado: 'EN_REVISION',
        urlRut: `https://example.com/rut/${sede.id}.pdf`,
        urlCamaraComercio: `https://example.com/cc/${sede.id}.pdf`,
        fechaCreacion: new Date(),
      });
      console.log(`Ticket KYB creado para ${sede.nombre}`);
    } else {
      console.log(`Ticket ya existe para ${sede.nombre}`);
    }
  }
  console.log('Tickets seed completado');
  await db.close();
}
seedTickets().catch(console.error);
