import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import Stripe from 'stripe';

import { Reserva, ModalidadReserva, EstadoReserva } from '../../src/domain/entities/Reserva.js';
import { buildServer } from '../../src/interfaces/http/server.js';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';
process.env.STRIPE_WEBHOOK_SECRET = webhookSecret;
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-10-28.endive' });

// Repositorio en memoria para pruebas
class InMemoryReservaRepository {
  private store = new Map<string, Reserva>();

  async guardar(reserva: Reserva): Promise<void> {
    this.store.set(reserva.id, reserva);
  }

  async buscarPorId(id: string): Promise<Reserva | null> {
    return this.store.get(id) ?? null;
  }

  async buscarPorCodigoQr(codigoQr: string): Promise<Reserva | null> {
    for (const r of this.store.values()) {
      if (r.codigoQr === codigoQr) return r;
    }
    return null;
  }

  async buscarActivaPorUsuario(usuarioId: string): Promise<Reserva | null> {
    for (const r of this.store.values()) {
      if (r.usuarioId === usuarioId && r.estado === EstadoReserva.ACTIVA) return r;
    }
    return null;
  }

  async buscarActivasPorSede(sedeId: string): Promise<Reserva[]> {
    return Array.from(this.store.values()).filter(r => r.sedeId === sedeId && r.estado === EstadoReserva.ACTIVA);
  }

  async buscarPorUsuario(usuarioId: string): Promise<Reserva[]> {
    return Array.from(this.store.values()).filter(r => r.usuarioId === usuarioId);
  }
}

const reservaRepository = new InMemoryReservaRepository();

const reservaId = randomUUID();
const reservaInicial = Reserva.crear({
  id: reservaId,
  usuarioId: randomUUID(),
  sedeId: randomUUID(),
  modalidad: ModalidadReserva.GARANTIZADA,
  codigoQr: 'ABCD12345678',
  fechaEntrada: new Date(),
});
await reservaRepository.guardar(reservaInicial);

describe('Webhook Stripe integración', () => {
  it('genera payload firmado, invoca endpoint y marca reserva como PAGADA', async () => {
    // Construir servidor mínimo
    const app = await buildServer({
      db: {
        consultar: async () => [],
        cerrar: async () => {},
      },
      adminService: { registrarOperador: async () => ({}), reinvitarOperador: async () => ({}) },
      authService: { iniciarSesion: async () => ({}) },
      reservaService: {} as any,
      operadorService: {} as any,
      servicioTokens: { firmar: async () => '', verificar: async () => { throw new Error(''); } },
      sedeRepository: {} as any,
      reservaRepository,
      sedeService: {},
      paymentGateway: {} as any,
    });

    try {
      const payload = {
        id: 'evt_test_webhook',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            object: 'payment_intent',
            metadata: {
              reservaId,
            },
          },
        },
      };
      const payloadString = JSON.stringify(payload);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret,
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/webhooks/stripe',
        headers: {
          'stripe-signature': header,
          'content-type': 'application/json',
        },
        payload: payloadString,
      });

      assert.equal(response.statusCode, 200);
      assert.deepEqual(JSON.parse(response.body), { received: true });

      const reservaActualizada = await reservaRepository.buscarPorId(reservaId);
      assert.ok(reservaActualizada);
      assert.equal(reservaActualizada.estado, EstadoReserva.PAGADA);
    } finally {
      await app.close();
    }
  });
});
