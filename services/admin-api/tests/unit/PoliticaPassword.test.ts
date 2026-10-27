import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { PoliticaPassword } from '../../src/domain/value-objects/PoliticaPassword.js';

/**
 * Contraseñas que cumplen todas las reglas. La de 12 caracteres exactos y la
 * que empieza con emoji fijan dos bordes: longitud mínima y conteo por puntos
 * de código (un emoji ocupa 2 unidades UTF-16 pero es 1 carácter).
 */
const VALIDAS = [
  'Password123!',
  'aB3!aB3!aB3!',
  'C0ntraseña-Larga#2026',
  'Ñandú2026$Seguro',
  '😀Aa1!xxxxxxx',
];

describe('PoliticaPassword — contraseñas válidas', () => {
  for (const password of VALIDAS) {
    it(`acepta ${JSON.stringify(password)}`, () => {
      assert.doesNotThrow(() => PoliticaPassword.validar(password));
    });
  }
});

describe('PoliticaPassword — longitud', () => {
  it('rechaza 11 caracteres aunque tenga todas las categorías', () => {
    assert.throws(() => PoliticaPassword.validar('Short123!Ab'), /al menos 12/);
  });

  it('acepta exactamente 12 caracteres', () => {
    assert.doesNotThrow(() => PoliticaPassword.validar('Password123!'));
  });

  it('acepta exactamente 128 caracteres', () => {
    const password = `Aa1!${'x'.repeat(124)}`;
    assert.equal(Array.from(password).length, 128);
    assert.doesNotThrow(() => PoliticaPassword.validar(password));
  });

  it('rechaza 129 caracteres', () => {
    const password = `Aa1!${'x'.repeat(125)}`;
    assert.equal(Array.from(password).length, 129);
    assert.throws(() => PoliticaPassword.validar(password), /128/);
  });

  it('rechaza la cadena vacía con el mensaje de longitud', () => {
    assert.throws(() => PoliticaPassword.validar(''), /al menos 12/);
  });
});

describe('PoliticaPassword — categorías', () => {
  it('exige al menos una mayúscula', () => {
    assert.throws(() => PoliticaPassword.validar('password123!x'), /mayúscula/);
  });

  it('exige al menos una minúscula', () => {
    assert.throws(() => PoliticaPassword.validar('PASSWORD123!X'), /minúscula/);
  });

  it('exige al menos un número', () => {
    assert.throws(() => PoliticaPassword.validar('NoDigitsHere!'), /número/);
  });

  it('exige al menos un carácter especial', () => {
    assert.throws(() => PoliticaPassword.validar('NoSpecial1234'), /especial/);
  });
});

describe('PoliticaPassword — contraseñas comunes', () => {
  it('rechaza una contraseña de la lista aunque cumpla la complejidad', () => {
    assert.throws(() => PoliticaPassword.validar('Welcome12345!'), /común/);
  });

  it('compara sin distinguir mayúsculas', () => {
    // "WeLcOmE12345!" cumple las categorías, así que sólo la lista puede rechazarla.
    assert.throws(() => PoliticaPassword.validar('WeLcOmE12345!'), /común/);
  });

  it('rechaza las variantes en español más usadas', () => {
    assert.throws(() => PoliticaPassword.validar('Contraseña123!'), /común/);
  });

  it('no rechaza una contraseña larga y única', () => {
    assert.doesNotThrow(() => PoliticaPassword.validar('Locify2026-$Parqueadero'));
  });
});
