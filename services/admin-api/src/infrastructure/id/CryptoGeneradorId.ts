import { randomUUID } from 'node:crypto';

import type { GeneradorId } from '../../domain/ports/GeneradorId.js';

/** Adaptador de producción: UUID v4 provisto por el runtime de Node. */
export class CryptoGeneradorId implements GeneradorId {
  generar(): string {
    return randomUUID();
  }
}
