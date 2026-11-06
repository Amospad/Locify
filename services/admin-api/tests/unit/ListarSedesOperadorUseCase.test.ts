import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ListarSedesOperadorUseCase } from '../../src/domain/use-cases/ListarSedesOperador.js';
import { ErrorDeValidacion } from '../../src/domain/errors/ErrorDeValidacion.js';
import { EstadoSede } from '../../src/domain/entities/Sede.js';

describe('ListarSedesOperadorUseCase', () => {
  const repoMock = {
    buscarPorOperadorId: async (id: string) => {
      if (id === 'op-vacio') return [];
      return [
        {
          id: 'sede-1',
          nombre: 'Sede A',
          direccion: 'Dir A',
          latitud: 1,
          longitud: 1,
          capacidadTotal: 10,
          precioHora: 1000,
          estado: EstadoSede.ACTIVA,
        },
      ];
    },
  };

  it('lista las sedes de un operador correctamente', async () => {
    const useCase = new ListarSedesOperadorUseCase(repoMock as any);
    const result = await useCase.ejecutar({ operadorId: 'op-1' });
    
    assert.equal(result.length, 1);
    assert.equal(result[0].nombre, 'Sede A');
  });

  it('retorna array vacío si el operador no tiene sedes', async () => {
    const useCase = new ListarSedesOperadorUseCase(repoMock as any);
    const result = await useCase.ejecutar({ operadorId: 'op-vacio' });
    
    assert.equal(result.length, 0);
  });

  it('lanza ErrorDeValidacion si no se provee operadorId', async () => {
    const useCase = new ListarSedesOperadorUseCase(repoMock as any);
    await assert.rejects(
      () => useCase.ejecutar({ operadorId: '' }),
      ErrorDeValidacion
    );
  });
});