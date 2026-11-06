import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EliminarSedeUseCase } from '../../src/domain/use-cases/EliminarSede.js';
import { ErrorDeValidacion } from '../../src/domain/errors/ErrorDeValidacion.js';
import { ErrorNoEncontrado } from '../../src/domain/errors/ErrorNoEncontrado.js';
import { AccesoDenegadoError } from '../../src/domain/errors/AccesoDenegadoError.js';
import { EstadoSede } from '../../src/domain/entities/Sede.js';

describe('EliminarSedeUseCase', () => {
  const repoMock = {
    buscarPorId: async (id: string) => {
      if (id === 'sede-1') {
        return {
          id: 'sede-1',
          nombre: 'Sede A',
          direccion: 'Dir A',
          latitud: 1,
          longitud: 1,
          capacidadTotal: 10,
          precioHora: 1000,
          estado: EstadoSede.ACTIVA,
          operadorId: 'op-1',
        };
      }
      return null;
    },
    actualizarEstado: async () => {},
  };

  it('elimina (soft delete) una sede existente que pertenece al operador', async () => {
    const useCase = new EliminarSedeUseCase(repoMock as any);
    const result = await useCase.ejecutar({ sedeId: 'sede-1', operadorId: 'op-1' });

    assert.equal(result.sedeId, 'sede-1');
  });

  it('lanza ErrorDeValidacion si faltan sedeId u operadorId', async () => {
    const useCase = new EliminarSedeUseCase(repoMock as any);
    await assert.rejects(
      () => useCase.ejecutar({ sedeId: '', operadorId: 'op-1' }),
      ErrorDeValidacion
    );
  });

  it('lanza ErrorNoEncontrado si la sede no existe', async () => {
    const useCase = new EliminarSedeUseCase(repoMock as any);
    await assert.rejects(
      () => useCase.ejecutar({ sedeId: 'no-existe', operadorId: 'op-1' }),
      ErrorNoEncontrado
    );
  });

  it('lanza AccesoDenegadoError si la sede pertenece a otro operador', async () => {
    const useCase = new EliminarSedeUseCase(repoMock as any);
    await assert.rejects(
      () => useCase.ejecutar({ sedeId: 'sede-1', operadorId: 'op-otro' }),
      AccesoDenegadoError
    );
  });
});