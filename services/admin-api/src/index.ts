// Punto de entrada del microservicio admin-api.
//
// Estado actual: NO existe un adaptador de entrada HTTP. Arrancar el proceso
// solo para imprimir que "la arquitectura está configurada" sería una señal
// falsa de disponibilidad, así que el proceso termina con código 1 hasta que
// exista `src/interfaces/http` (ver ADR-001 y PROJECT_STATE.md).
console.error(
  '[admin-api] Sin capa HTTP: el servicio no puede atender peticiones. ' +
    'Implementa src/interfaces/http antes de desplegarlo.',
);
process.exitCode = 1;
