import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CrearSedeUseCase } from '../../src/domain/use-cases/CrearSede.js';
import { ErrorDeValidacion } from '../../src/domain/errors/ErrorDeValidacion.js';
import { ErrorDeConflicto } from '../../src/domain/errors/ErrorDeConflicto.js';

describe('CrearSedeUseCase', () => {
  const generadorId = { generar: () => 'sede-uuid-123' };
  const repositorioMock = {
    buscarPorOperadorId: async () => [],
    guardar: async () => {},
  };

  it('crea una sede válida y retorna sedeId y nombre', async () => {
    const useCase = new CrearSedeUseCase(
      repositorioMock as any,
      generadorId as any
    );

    const dto = {
      nombre: 'Sede Centro',
      direccion: 'Cra 50 # 10-20',
      latitud: 6.2442,
      longitud: -75.5812,
      capacidadTotal: 50,
      precioHora: 5000,
      operadorId: 'op-1',
    };

    const result = await useCase.ejecutar(dto);
    assert.equal(result.sedeId, 'sede-uuid-123');
    assert.equal(result.nombre, 'Sede Centro');
  });

  it('lanza ErrorDeValidacion si el nombre está vacío', async () => {
    const useCase = new CrearSedeUseCase(repositorioMock as any, generadorId as any);
    await assert.rejects(
      () => useCase.ejecutar({
        nombre: '',
        direccion: 'Dir',
        latitud: 1,
        longitud: 1,
        capacidadTotal: 10,
        precioHora: 1000,
        operadorId: 'op-1',
      }),
      ErrorDeValidacion
    );
  });

  it('lanza ErrorDeConflicto si ya existe sede con mismo nombre y dirección', async () => {
    const repoConDuplicado = {
      buscarPorOperadorId: async () => [
        { nombre: 'Sede Centro', direccion: 'Cra 50 # 10-20' },
      ],
      guardar: async () => {},
    };
    const useCase = new CrearSedeUseCase(repoConDuplicado as any, generadorId as any);
    await assert.rejects(
      () => useCase.ejecutar({
        nombre: 'Sede Centro',
        direccion: 'Cra 50 # 10-20',
        latitud: 6.2442,
        longitud: -75.5812,
        capacidadTotal: 50,
        precioHora: 5000,
        operadorId: 'op-1',
      }),
      ErrorDeConflicto
    );
  });
});
