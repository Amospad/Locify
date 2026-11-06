import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ActualizarSedeUseCase } from '../../src/domain/use-cases/ActualizarSede.js';
import { ErrorDeValidacion } from '../../src/domain/errors/ErrorDeValidacion.js';
import { ErrorNoEncontrado } from '../../src/domain/errors/ErrorNoEncontrado.js';
import { AccesoDenegadoError } from '../../src/domain/errors/AccesoDenegadoError.js';
import { ErrorDeConflicto } from '../../src/domain/errors/ErrorDeConflicto.js';
import { EstadoSede } from '../../src/domain/entities/Sede.js';

describe('ActualizarSedeUseCase', () => {
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
    buscarPorOperadorId: async () => [
      {
        id: 'sede-1',
        nombre: 'Sede A',
        direccion: 'Dir A',
      },
    ],
    guardar: async () => {},
  };

  it('actualiza campos de una sede existente', async () => {
    const useCase = new ActualizarSedeUseCase(repoMock as any);
    const result = await useCase.ejecutar({
      sedeId: 'sede-1',
      operadorId: 'op-1',
      nombre: 'Sede A Actualizada',
      precioHora: 2000,
    });

    assert.equal(result.sedeId, 'sede-1');
    assert.equal(result.nombre, 'Sede A Actualizada');
  });

  it('lanza ErrorDeValidacion si faltan campos obligatorios', async () => {
    const useCase = new ActualizarSedeUseCase(repoMock as any);
    await assert.rejects(
      () => useCase.ejecutar({ sedeId: '', operadorId: 'op-1' }),
      ErrorDeValidacion
    );
  });

  it('lanza ErrorNoEncontrado si la sede no existe', async () => {
    const useCase = new ActualizarSedeUseCase(repoMock as any);
    await assert.rejects(
      () => useCase.ejecutar({ sedeId: 'no-existe', operadorId: 'op-1' }),
      ErrorNoEncontrado
    );
  });

  it('lanza AccesoDenegadoError si la sede es de otro operador', async () => {
    const useCase = new ActualizarSedeUseCase(repoMock as any);
    await assert.rejects(
      () => useCase.ejecutar({ sedeId: 'sede-1', operadorId: 'op-otro' }),
      AccesoDenegadoError
    );
  });

  it('lanza ErrorDeConflicto al intentar renombrar a nombre ya existente', async () => {
    const repoConDuplicado = {
      ...repoMock,
      buscarPorOperadorId: async () => [
        { id: 'sede-1', nombre: 'Sede A', direccion: 'Dir A' },
        { id: 'sede-2', nombre: 'Sede B', direccion: 'Dir B' },
      ],
    };
    const useCase = new ActualizarSedeUseCase(repoConDuplicado as any);
    await assert.rejects(
      () => useCase.ejecutar({
        sedeId: 'sede-1',
        operadorId: 'op-1',
        nombre: 'Sede B',
        direccion: 'Dir B',
      }),
      ErrorDeConflicto
    );
  });
});