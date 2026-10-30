import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import type { Contract } from './src/prisma/contract.js';
import contractJson from '../src/prisma/contract.json' with { type: 'json' };
import { hash } from 'argon2';
import { randomUUID } from 'crypto';

const contract = contractFromJson<Contract>(contractJson);
const db = postgres({ contract, url: process.env['DATABASE_URL']! });

async function seed() {
  console.log('🌱 Iniciando seed masivo en base de datos...');
  const passwordHash = await hash('Password123!');

  // 1. 3 Administradores
  const admins = [
    { email: 'admin1@locify.co', rol: 'ADMIN' },
    { email: 'admin2@locify.co', rol: 'ADMIN' },
    { email: 'admin3@locify.co', rol: 'ADMIN' },
  ];

  for (const adm of admins) {
    const existing = await db.orm.public.Usuario.where({ email: adm.email }).first();
    if (!existing) {
      await db.orm.public.Usuario.create({
        id: randomUUID(),
        email: adm.email,
        passwordHash,
        rol: 'ADMIN' as any,
        estado: 'ACTIVO' as any,
      });
      console.log(`👤 Creado Admin: ${adm.email}`);
    }
  }

  // 2. 20 Operadores
  const operadoresList = [];
  for (let i = 1; i <= 20; i++) {
    const email = `operador${i}@test.com`;
    let user = await db.orm.public.Usuario.where({ email }).first();
    if (!user) {
      const id = randomUUID();
      await db.orm.public.Usuario.create({
        id,
        email,
        passwordHash,
        rol: 'OPERADOR' as any,
        estado: 'ACTIVO' as any,
      });
      user = { id, email, rol: 'OPERADOR' };
      console.log(`👤 Creado Operador: ${email}`);
    }
    operadoresList.push(user);
  }

  // Conductores para reservas (necesitamos algunos conductores)
  const conductoresList = [];
  for (let i = 1; i <= 10; i++) {
    const email = `conductor${i}@test.com`;
    let user = await db.orm.public.Usuario.where({ email }).first();
    if (!user) {
      const id = randomUUID();
      await db.orm.public.Usuario.create({
        id,
        email,
        passwordHash,
        rol: 'CONDUCTOR' as any,
        estado: 'ACTIVO' as any,
      });
      user = { id, email, rol: 'CONDUCTOR' };
      console.log(`🚗 Creado Conductor: ${email}`);
    }
    conductoresList.push(user);
  }

  // 3. 30 Sedes distribuidas en Medellín
  const nombresBarriosMedellin = [
    'El Poblado', 'Laureles', 'Envigado', 'Sabaneta', 'Belen', 'Estadio', 'Centro', 'Prado Centro',
    'Robledo', 'Castilla', 'Manrique', 'Poblado Milla', 'La Mota', 'Conquistadores', 'Florencia',
    'Buenos Aires', 'San Javier', 'Guayabal', 'La América', 'Loreto', 'Calasanz', 'Fátima',
    'Bolivariana', 'San Diego', 'Los Colores', 'Villas de Aburrá', 'Suramericana', 'Itagüí Central',
    'Bello Norte', 'La Aguacatala'
  ];

  const sedesList = [];
  for (let i = 0; i < 30; i++) {
    const nombre = `LOCIFY ${nombresBarriosMedellin[i] || 'Medellín'} #${i + 1}`;
    const operador = operadoresList[i % operadoresList.length];
    const estadoSede = i < 22 ? 'ACTIVA' : 'PENDIENTE_KYB';
    const direccion = `Calle ${10 + i} # ${20 + (i * 2)}-${i}, Medellín`;
    
    // Coordenadas reales centradas alrededor de Medellín (lat: 6.2442, lng: -75.5636)
    const latitud = 6.2442 + (Math.sin(i) * 0.05);
    const longitud = -75.5636 + (Math.cos(i) * 0.05);
    const capacidadTotal = 25 + (i * 3) % 50;
    const precioHora = 3500 + ((i * 500) % 6000);

    let sede = await db.orm.public.Sede.where({ nombre }).first();
    if (!sede) {
      const id = randomUUID();
      await db.orm.public.Sede.create({
        id,
        nombre,
        direccion,
        latitud,
        longitud,
        capacidadTotal,
        precioHora,
        estado: estadoSede as any,
        operadorId: operador.id,
      });
      sede = { id, nombre, operadorId: operador.id, estado: estadoSede };
      console.log(`🅿️ Creada Sede: ${nombre} (${estadoSede})`);
    }
    sedesList.push(sede);
  }

  // 4. 10 Tickets KYB pendientes (para las sedes PENDIENTE_KYB o algunas más)
  const sedesPendientes = sedesList.filter(s => s.estado === 'PENDIENTE_KYB');
  for (let i = 0; i < Math.min(10, sedesPendientes.length); i++) {
    const sede = sedesPendientes[i];
    const existingTicket = await db.orm.public.TicketKYB.where({ sedeId: sede.id }).first();
    if (!existingTicket) {
      await db.orm.public.TicketKYB.create({
        id: randomUUID(),
        sedeId: sede.id,
        operadorId: sede.operadorId,
        estado: 'EN_REVISION' as any,
        urlRut: `https://locify.co/docs/rut-${sede.id}.pdf`,
        urlCamaraComercio: `https://locify.co/docs/cc-${sede.id}.pdf`,
        fechaCreacion: new Date(),
      });
      console.log(`📋 Creado Ticket KYB para Sede: ${sede.id}`);
    }
  }

  // 5. 50 Reservas: 20 ACTIVAS, 20 COMPLETADAS (FINALIZADAS), 10 CANCELADAS
  const estadosReserva = [
    ...Array(20).fill('ACTIVA'),
    ...Array(20).fill('FINALIZADA'),
    ...Array(10).fill('CANCELADA'),
  ];

  const sedesActivas = sedesList.filter(s => s.estado === 'ACTIVA');
  for (let i = 0; i < 50; i++) {
    const estado = estadosReserva[i];
    const conductor = conductoresList[i % conductoresList.length];
    const sede = sedesActivas[i % sedesActivas.length];
    const codigoQr = `LOCIFY-QR-${i + 1000}-${Date.now().toString().slice(-4)}`;
    
    // Verificar si ya existe reserva con este código QR o crear único
    const existingReserva = await db.orm.public.Reserva.where({ codigoQr }).first();
    if (!existingReserva) {
      const fechaEntrada = new Date(Date.now() - (i * 3600000 * 2));
      const fechaSalida = estado === 'FINALIZADA' || estado === 'CANCELADA' ? new Date(fechaEntrada.getTime() + 3600000) : null;
      
      await db.orm.public.Reserva.create({
        id: randomUUID(),
        usuarioId: conductor.id,
        sedeId: sede.id,
        modalidad: (i % 2 === 0 ? 'GARANTIZADA' : 'EXPRES') as any,
        estado: estado as any,
        codigoQr,
        fechaEntrada,
        fechaSalida: fechaSalida as any,
      });
    }
  }
  console.log('🎟️ Creadas 50 reservas (20 activas, 20 finalizadas, 10 canceladas).');
  console.log('✅ Seed masivo completado con éxito.');
  await db.close();
}

seed().catch((e) => {
  console.error('❌ Error en seed masivo:', e);
  process.exit(1);
});
