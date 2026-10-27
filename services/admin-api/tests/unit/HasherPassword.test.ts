import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Argon2Hasher } from '../../src/infrastructure/security/Argon2Hasher.js';

const PASSWORD = 'ContraseñaSegura123!';

describe('Argon2Hasher', () => {
  const hasher = new Argon2Hasher();

  it('genera un hash con el prefijo de Argon2id', async () => {
    const hash = await hasher.hash(PASSWORD);

    assert.equal(
      hash.startsWith('$argon2id$'),
      true,
      `se esperaba un hash Argon2id, se recibió: ${hash}`,
    );
  });

  it('no devuelve la contraseña en claro', async () => {
    const hash = await hasher.hash(PASSWORD);

    assert.equal(hash.includes(PASSWORD), false);
  });

  it('reconoce la contraseña correcta', async () => {
    const hash = await hasher.hash(PASSWORD);

    assert.equal(await hasher.compare(PASSWORD, hash), true);
  });

  it('rechaza una contraseña incorrecta', async () => {
    const hash = await hasher.hash(PASSWORD);

    assert.equal(await hasher.compare('OtraClave123!', hash), false);
  });

  it('usa una sal distinta en cada hash de la misma contraseña', async () => {
    const primero = await hasher.hash(PASSWORD);
    const segundo = await hasher.hash(PASSWORD);

    assert.notEqual(primero, segundo);
    // Ambas siguen siendo válidas para la misma contraseña.
    assert.equal(await hasher.compare(PASSWORD, primero), true);
    assert.equal(await hasher.compare(PASSWORD, segundo), true);
  });

  it('registra los parámetros OWASP en el hash (m=65536, p=4, t=3)', async () => {
    const hash = await hasher.hash(PASSWORD);

    // Argon2 codifica los parámetros en el propio hash; el orden es m,p,t.
    assert.match(hash, /m=65536/);
    assert.match(hash, /p=4/);
    assert.match(hash, /t=3/);
  });
});
