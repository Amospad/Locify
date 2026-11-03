import Fastify from 'fastify';
import { rutasPagos } from './src/interfaces/http/routes/payments.js';
import { Reserva, EstadoReserva } from './src/domain/entities/Reserva.js';
import { Sede, EstadoSede } from './src/domain/entities/Sede.js';

const reservaMock = Reserva.reconstituir({
  id: 'res-1',
  usuarioId: 'usr-1',
  sedeId: 'sede-1',
  modalidad: 'GARANTIZADA',
  estado: EstadoReserva.ACTIVA,
  codigoQr: 'ABCDEF123456',
  fechaEntrada: new Date('2026-11-01T10:00:00Z'),
});

const sedeMock = Sede.reconstituir({
  id: 'sede-1',
  nombre: 'Sede',
  direccion: 'Calle',
  latitud: 0,
  longitud: 0,
  capacidadTotal: 10,
  precioHora: 5000,
  estado: EstadoSede.ACTIVA,
  operadorId: 'op-1',
});

const app = Fastify();
await app.register(rutasPagos, {
  reservaRepository: {
    async buscarPorId(id) { console.log('buscarPorId', id); return id==='res-1'?reservaMock:null; },
    async guardar(){},
    async buscarActivaPorUsuario(){return null;},
    async buscarPorCodigoQr(){return null;},
    async buscarActivasPorSede(){return []},
    async buscarPorUsuario(){return []},
  },
  sedeRepository: {
    async buscarPorId(id){ console.log('buscarSede', id); return id==='sede-1'?sedeMock:null; },
    async guardar(){},
    async listarTodas(){return []},
    async listarActivas(){return []},
  },
  paymentGateway: {
    async crearPaymentIntent(reservaId,monto,moneda,metadata){ console.log('crearPaymentIntent', reservaId,monto,moneda,metadata); return {clientSecret:'x'}; },
    async reembolsar(){return {success:true}}
  }
});

const res = await app.inject({method:'POST',url:'/api/payments/create-intent',payload:{reservaId:'res-1'}});
console.log('status',res.statusCode, res.body);
await app.close();
