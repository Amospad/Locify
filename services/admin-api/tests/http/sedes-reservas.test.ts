import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildServer } from '../../src/interfaces/http/server.js';
import { Sede } from '../../src/domain/entities/Sede.js';
import { ModalidadReserva } from '../../src/domain/entities/Reserva.js';
import { RolUsuario } from '../../src/domain/entities/Usuario.js';
import type { SedeRepository } from '../../src/domain/ports/SedeRepository.js';
import type { GestorDeReservas } from '../../src/interfaces/http/routes/reservas.js';
import type { ServicioDeTokens, ContenidoToken } from '../../src/domain/ports/ServicioDeTokens.js';

class SedeRepositoryEnMemoria implements SedeRepository {
  private sedes: Sede[] = [];

  constructor(iniciales: Sede[] = []) {
    this.sedes = [...iniciales];
  }

  async listarActivas(): Promise<Sede[]> {
    return this.sedes;
  }

  async buscarPorId(id: string): Promise<Sede | null> {
    return this.sedes.find((s) => s.id === id) ?? null;
  }

  async guardar(sede: Sede): Promise<void> {
    // stub
  }

  async buscarPorOperadorId(operadorId: string): Promise<Sede[]> {
    return [];
  }

  async actualizarEstado(id: string, estado: any): Promise<void> {
    // stub
  }
}

class GestorReservasEnMemoria implements GestorDeReservas {
  async crearReserva(usuarioId: string, sedeId: string, modalidad: ModalidadReserva) {
    return {
      id: 'reserva-uuid-123',
      codigoQr: 'LOCIFYQR1234',
      sedeId,
    };
  }
}

class TokensEnMemoria implements ServicioDeTokens {
  async firmar(contenido: ContenidoToken): Promise<string> {
    return 'token-valido';
  }

  async verificar(token: string): Promise<ContenidoToken> {
    if (token === 'token-valido') {
      return { sub: 'usuario-1', email: 'test@locify.co', rol: RolUsuario.CONDUCTOR };
    }
    throw new Error('Token inválido');
  }
}

describe('Rutas HTTP: Sedes y Reservas (HU-C01)', () => {
  const sedeEjemplo = Sede.reconstituir({
    id: 'sede-1',
    nombre: 'Sede Poblado',
    direccion: 'Cra 43A # 1-50',
    latitud: 6.208,
    longitud: -75.567,
    capacidadTotal: 30,
    precioHora: 4500,
  });

  it('GET /api/sedes retorna 200 con la lista de sedes', async () => {
    const sedeRepo = new SedeRepositoryEnMemoria([sedeEjemplo]);
    const tokens = new TokensEnMemoria();
    const app = await buildServer({
      db: { consultar: async () => [{ ok: 1 }], cerrar: async () => {} },
      adminService: {} as any,
      authService: {} as any,
      reservaService: new GestorReservasEnMemoria(),
      servicioTokens: tokens,
      sedeRepository: sedeRepo,
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/sedes',
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.length, 1);
    assert.equal(body[0].id, 'sede-1');
    assert.equal(body[0].nombre, 'Sede Poblado');
    assert.equal(body[0].capacidadTotal, 30);
  });

  it('POST /api/reservas rechaza petición sin token con 401', async () => {
    const sedeRepo = new SedeRepositoryEnMemoria([sedeEjemplo]);
    const tokens = new TokensEnMemoria();
    const app = await buildServer({
      db: { consultar: async () => [{ ok: 1 }], cerrar: async () => {} },
      adminService: {} as any,
      authService: {} as any,
      reservaService: new GestorReservasEnMemoria(),
      servicioTokens: tokens,
      sedeRepository: sedeRepo,
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/reservas',
      payload: {
        sedeId: 'sede-1',
        modalidad: 'GARANTIZADA',
      },
    });

    assert.equal(res.statusCode, 401);
  });

  it('POST /api/reservas crea reserva exitosamente con 201 y código QR', async () => {
    const sedeRepo = new SedeRepositoryEnMemoria([sedeEjemplo]);
    const tokens = new TokensEnMemoria();
    const app = await buildServer({
      db: { consultar: async () => [{ ok: 1 }], cerrar: async () => {} },
      adminService: {} as any,
      authService: {} as any,
      reservaService: new GestorReservasEnMemoria(),
      servicioTokens: tokens,
      sedeRepository: sedeRepo,
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/reservas',
      headers: {
        authorization: 'Bearer token-valido',
      },
      payload: {
        sedeId: 'sede-1',
        modalidad: 'GARANTIZADA',
      },
    });

    assert.equal(res.statusCode, 201);
    const body = JSON.parse(res.body);
    assert.equal(body.id, 'reserva-uuid-123');
    assert.equal(body.codigoQr, 'LOCIFYQR1234');
    assert.equal(body.sedeId, 'sede-1');
  });
});
