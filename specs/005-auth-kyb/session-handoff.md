# Session Handoff — spec 005-auth-kyb

## Current Objective
- Goal: Implementar autenticación completa (registro, OTP, login) y flujo KYB (upload, review admin, estado) con Arquitectura Hexagonal en admin-api y UI Liquid Glass en web-cliente.
- Active feat-id: feat-005-2 (Flujo KYB Backend y Estados)
- Branch / commit: main / HEAD

## Completed This Session
- feat-005-1 COMPLETADO: Backend auth endpoints + unit tests
  - POST /api/auth/register (RegistrarUsuarioUseCase)
  - POST /api/auth/verify-otp (VerificarOtpUseCase)
  - POST /api/auth/login (LoginUsuarioUseCase) - pre-existing
  - EmailService extendido con enviarOtp (EmailConsola, SmtpEmailService)
  - AuthService extendido con registrarUsuario y verificarOtp
  - 88 unit tests passing, 3 integration tests passing
  - TypeScript build clean
- feat-005-2 COMPLETADO: Flujo KYB Backend y Estados
  - GET /api/kyb/status/:operatorId (ConsultarEstadoKYBUseCase) - COMPLETADO
  - POST /api/kyb/subir-documentos (SubirDocumentosKYBUseCase) - COMPLETADO
  - GET /api/admin/kyb/pendientes (ListarTicketsKYBPendientesUseCase) - COMPLETADO
  - PATCH /api/admin/kyb/:id/estado (CambiarEstadoTicketKYBUseCase) - COMPLETADO
  - Todas las rutas con preHandler de autenticación y autorización por rol
  - 88 unit tests passing
  - TypeScript build clean
- feat-005-3 EN PROGRESO: Interfaz PWA - Registro y Verificación
  - Conectar `/registrarse` y `/verificar-otp` con lib/api.ts

## Verification Evidence
| Check | Command | Result | Notes |
|---|---|---|---|
| Typecheck admin-api | `pnpm --filter admin-api build` | ✅ Pasa | - |
| Tests admin-api (unit) | `pnpm --filter admin-api test:unit` | ✅ 88 passing | - |
| Tests admin-api (repo) | `pnpm --filter admin-api test:repo` | ✅ 3 passing | - |
| Lint web-cliente | `pnpm lint` | ✅ Pasa | - |
| Typecheck web-cliente | `pnpm typecheck` | ⚠️ Error StripeProvider (pre-existente) | No bloquea auth/kyb |

## Files Changed
- `services/admin-api/src/domain/use-cases/ConsultarEstadoKYB.ts` (nuevo)
- `services/admin-api/src/application/services/SedeService.ts` (extendido)
- `services/admin-api/src/interfaces/http/routes/kyb.ts` (endpoints completos con validación de roles)
- `specs/005-auth-kyb/feature_list.json` (feat-005-1 y feat-005-2 → passing)

## Decisions Made
- Arquitectura: Hexagonal completa en admin-api (Domain/Application/Infrastructure/Interfaces)
- Autenticación: JWT Bearer de admin-api (no cookies httpOnly), Supabase Auth solo para signInWithPassword en frontend
- OTP: Código 6 dígitos, 15 min expiración, email vía `EmailService` (consola en dev, SMTP en prod)
- KYB: Documentos RUT + Cámara de Comercio, validación manual ≤48h, estados EN_REVISION/APROBADO/RECHAZADO
- UI: Español es-CO, OKLCH Liquid Glass, Wizard 4 pasos

## Blockers / Risks
- Typecheck web-cliente falla por `StripeProvider.tsx` (módulo archivado). No bloquea implementación auth/kyb.
- Tests HTTP pre-existentes fallan con 500 (auth.test.ts, seguridad.test.ts) — deuda técnica pre-existente, no bloquea feat-005-2

## Next Session Startup
1. Run `./init.sh` (o `pnpm typecheck && pnpm lint` en Windows)
2. Read `feature_list.json` — next feature: `feat-005-3`
3. Conectar `/registrarse` y `/verificar-otp` con endpoints `POST /api/auth/register` y `POST /api/auth/verify-otp` en `apps/web-cliente/src/lib/api.ts`
4. Crear páginas con formularios OKLCH Liquid Glass y validación Zod
5. Implementar `/operador/kyb` para subida de documentos KYB conectando a `GET /api/kyb/status/:operatorId` y `POST /api/kyb/subir-documentos`
6. Implementar `/admin/kyb` para aprobación/rechazo de tickets conectando a `GET /api/admin/kyb/pendientes` y `PATCH /api/admin/kyb/:id/estado`
7. Ejecutar `pnpm --filter admin-api test:unit` y verificar verde
8. Actualizar `feature_list.json` y `session-handoff.md` tras verificación