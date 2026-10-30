# Comandos Git para commitear los cambios del Dashboard del Conductor

Ejecuta estos comandos en tu terminal local (PowerShell, CMD, Git Bash, etc.):

```bash
cd C:\Users\jufep\.local\share\opencode\worktree\30898f\sunny-star

git add -A

git commit -m "feat(web-cliente,admin-api): implementar dashboard del conductor con reserva activa e historial (RF-09, RF-21)

- Backend: endpoints GET /api/reservas/mis-reservas, GET /api/reservas/activa
- Casos de uso: ListarMisReservasUseCase, ObtenerReservaActivaUseCase
- Servicio: ReservaService con listarMisReservas() y obtenerReservaActiva()
- Repositorio: PostgresReservaRepository.buscarPorUsuario() orden descendente por fecha
- Dominio: EstadoReserva extendido con EXPIRADA
- Frontend: dashboard rediseñado en /dashboard con dos secciones animadas (Framer Motion):
  (a) Reserva Activa — tarjeta con sede, QR (qrcode.react), cronómetro tiempo real
  (b) Historial — tarjetas con badges estado (Azul Acero/Verde Esmeralda/Rojo/Ámbar), modalidad, QR
  (c) Estado vacío — icono + botón 'Buscar parqueadero' → /buscar
- Diseño LOCIFY: Azul Acero #2F5D9F, Grafito #1F2937, Poppins, sombras, esquinas 12px/24px
- Tests: backend 137/137 passing, frontend build exitoso (Next.js 16 Turbopack)
- Docs: PROJECT_STATE.md actualizado, 07-matriz-trazabilidad.md RF-09/RF-21 → Implementados"

git push origin main
```

## Resumen de cambios

### Backend (`services/admin-api`)
- `src/domain/entities/Reserva.ts`: `EstadoReserva.EXPIRADA` agregado
- `src/domain/ports/ReservaRepository.ts`: método `buscarPorUsuario(usuarioId)`
- `src/domain/use-cases/ListarMisReservas.ts`: nuevo caso de uso
- `src/domain/use-cases/ObtenerReservaActiva.ts`: nuevo caso de uso
- `src/application/services/ReservaService.ts`: métodos `listarMisReservas()` y `obtenerReservaActiva()`
- `src/infrastructure/persistence/PostgresReservaRepository.ts`: implementación `buscarPorUsuario()`
- `src/interfaces/http/routes/reservas.ts`: endpoints `GET /api/reservas/mis-reservas`, `GET /api/reservas/activa`

### Frontend (`apps/web-cliente`)
- `src/lib/api.ts`: funciones `listarMisReservas()`, `obtenerReservaActiva()` + tipos `ReservaUsuario`, `ReservaActivaUsuario`
- `src/app/dashboard/page.tsx`: dashboard completo con Framer Motion, QRCodeSVG, cronómetro tiempo real, badges de estado, estado vacío

### Docs
- `PROJECT_STATE.md`: entrada 2026-10-30 para Dashboard del Conductor
- `docs/docs/formativo/07-matriz-trazabilidad.md`: RF-09 y RF-21 marcados como Implementados, CU-07 referenciado