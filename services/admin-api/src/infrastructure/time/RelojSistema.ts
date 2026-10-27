import type { Reloj } from '../../domain/ports/Reloj.js';

/** Adaptador de producción: hora del sistema. */
export class RelojSistema implements Reloj {
  ahora(): Date {
    return new Date();
  }
}
