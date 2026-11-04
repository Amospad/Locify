# Session Handoff — spec 005-auth-kyb

## Current Objective
- Goal: Implementar autenticación completa (registro, OTP, login) y flujo KYB (upload, review admin, estado) con Arquitectura Hexagonal en admin-api y UI Liquid Glass en web-cliente.
- Active feat-id: feat-005-1 (Registro Conductor + OTP Backend)
- Branch / commit: main / HEAD (no commits nuevos aún)

## Completed This Session
- Plan técnico creado: `specs/005-auth-kyb/plan-tecnico.md`
- Feature list descompuesta en 4 features atómicas con `depends_on` y `verification` concreta
- `tasks.md` actualizado con checklist por feature y criterios de éxito
- `.agent/progress.md` actualizado con estado actual
- Documentación SENA sincronizada (scripts/sync-docs.js ejecutado)
- Matriz trazabilidad exportada (scripts/export-trazabilidad.js)

## Verification Evidence
| Check | Command | Result | Notes |
|---|---|---|---|
| Typecheck web-cliente | `pnpm typecheck` | ⚠️ Error StripeProvider (pre-existente) | No bloquea auth/kyb |
| Typecheck admin-api | `pnpm --filter admin-api build` | ✅ Pasa | - |
| Tests admin-api | `pnpm --filter admin-api test` | ✅ Pasa | - |
| Lint web-cliente | `pnpm lint` | ✅ Pasa | - |

## Files Changed
- `specs/005-auth-kyb/plan-tecnico.md` (nuevo)
- `specs/005-auth-kyb/feature_list.json` (actualizado: 4 features atómicas)
- `specs/005-auth-kyb/tasks.md` (actualizado: checklist por feature)
- `.agent/progress.md` (actualizado)

## Decisions Made
- Arquitectura: Hexagonal completa en admin-api (Domain/Application/Infrastructure/Interfaces)
- Autenticación: JWT Bearer de admin-api (no cookies httpOnly), Supabase Auth solo para signInWithPassword en frontend
- OTP: Código 6 dígitos, 15 min expiración, email vía `EmailService` (consola en dev, SMTP en prod)
- KYB: Documentos RUT + Cámara de Comercio, validación manual ≤48h, estados EN_REVISION/APROBADO/RECHAZADO
- UI: Español es-CO, OKLCH Liquid Glass, Wizard 4 pasos

## Blockers / Risks
- Typecheck web-cliente falla por `StripeProvider.tsx` (módulo archivado). No bloquea implementación auth/kyb.
- Verificar que `EmailService.enviarOtp` funcione con `EmailConsola` y `SmtpEmailService` antes de feat-005-3.

## Next Session Startup
1. Run `./init.sh` (o `pnpm typecheck && pnpm lint` en Windows)
2. Read `feature_list.json` — next feature: `feat-005-1`
3. Implementar `RegistrarUsuarioUseCase` y `VerificarOtpUseCase` en `services/admin-api/src/domain/use-cases/`
4. Extender `EmailService` port y adaptadores (ya preparado en sesión anterior)
5. Añadir endpoints `POST /api/auth/register` y `POST /api/auth/verify-otp` en `services/admin-api/src/interfaces/http/routes/auth.ts`
6. Ejecutar tests unitarios e integración (`pnpm --filter admin-api test`)
7. Actualizar `feature_list.json` `status` y `evidence` tras verificación verde