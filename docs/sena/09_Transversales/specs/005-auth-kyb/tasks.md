# Plan de Tareas: Especificación de Autenticación y KYB (005-auth-kyb)

## Resumen del Proyecto
Especificación e implementación del sistema completo de autenticación (usuarios y operadores) y verificación KYB (Know Your Business) para el SaaS de gestión de parqueaderos LOCIFY. Este flujo de onboarding es el pilar fundamental para la seguridad, cumplimiento normativo y calidad del servicio en Colombia.

**Referencia de Plan Técnico**: [`plan-tecnico.md`](./plan-tecnico.md)
**Desglose de Features**: [`feature_list.json`](./feature_list.json)

## Objetivo Principal
- Implementar autenticación JWT segura para Conductores y Operadores
- Desarrollar flujo completo de registro, verificación KYB y activación de sedes
- Integrar validación de documentos KYB con verificación de RUT
- Implementar control de acceso basado en roles (RBAC) con Supabase Auth y RLS
- Asegurar cumplimiento normativo (Ley 1581, GDPR, normativas Colombianas)

## Funcionalidades Clave (Desglose por Features)

### Feature 1: feat-005-1 — Registro de Conductor y OTP (Backend)
- [ ] Implementar `RegistrarUsuarioUseCase` con validación email, política password, celular colombiano
- [ ] Implementar `VerificarOtpUseCase` con transición PENDIENTE → ACTIVO
- [ ] Extender `EmailService` con método `enviarOtp`
- [ ] Añadir endpoint `POST /api/auth/register` con validación Zod
- [ ] Añadir endpoint `POST /api/auth/verify-otp`
- [ ] Tests unitarios para `RegistrarUsuarioUseCase` y `VerificarOtpUseCase`
- [ ] Tests HTTP para endpoints de registro y OTP

### Feature 2: feat-005-2 — Flujo KYB Backend y Estados
- [ ] Implementar endpoint `GET /api/kyb/status/:operatorId`
- [ ] Conectar `SubirDocumentosKYBUseCase` con validación de roles (`OPERADOR`, `ADMIN`)
- [ ] Implementar `CambiarEstadoTicketKYBUseCase` con estados APROBADO/RECHAZADO
- [ ] Tests de integración KYB (upload, status, approval)

### Feature 3: feat-005-3 — Interfaz PWA - Registro y Verificación (Frontend)
- [ ] Crear página `/registrarse` para Conductor (formulario OKLCH Liquid Glass, validación Zod)
- [ ] Crear página `/verificar-otp` con reenvío y expiración
- [ ] Actualizar `lib/api.ts` con clientes `register`, `verifyOtp`
- [ ] Tests de tipo `pnpm typecheck` verdes

### Feature 4: feat-005-4 — Interfaz PWA - KYB & Panel Admin
- [ ] Conectar `/operador/kyb` con API real (subida RUT + Cámara de Comercio)
- [ ] Crear `/admin/kyb` con listado tickets, ver documentos, aprobar/rechazar
- [ ] Pantalla de estado KYB para operadores pendientes
- [ ] Tests de tipo `pnpm typecheck` verdes

## Arquitectura de Implementación

### Capa Domain (Hexagonal - admin-api)
- **Entities**: `Usuario`, `TicketKYB`, `Sede`
- **Value Objects**: `PoliticaPassword`, `Email`, `TelefonoColombia`
- **Use Cases**: `LoginUsuario`, `RegistrarUsuario`, `VerificarOtp`, `RegistrarOperador`, `SubirDocumentosKYB`, `CambiarEstadoTicketKYB`

### Capa Application
- **Services**: `AuthService`, `SedeService` (gestión KYB)

### Capa Interfaces (HTTP - Fastify)
- Rutas: `auth.ts`, `kyb.ts`, `operadores.ts`
- Esquemas de validación JSON Schema / Zod
- PreHandlers: autenticación JWT Bearer, autorización por rol (`exigirRol`)

### Frontend (Next.js App Router)
- Páginas: `registrarse`, `verificar-otp`, `operador/kyb`, `admin/kyb`
- Cliente API: `lib/api.ts` (JWT Bearer a admin-api)
- Sesión: localStorage + `useSyncExternalStore`

## Criterios de Éxito (por Feature)

### feat-005-1
- [ ] Usuario Conductor se registra con email, password ≥12, celular colombiano
- [ ] OTP 6 dígitos se envía por email (consola en dev)
- [ ] Verificación OTP exitosa activa cuenta (estado ACTIVO)
- [ ] Tests unitarios ≥ 90% cobertura en use cases

### feat-005-2
- [ ] Operador sube RUT y Cámara de Comercio vía endpoint
- [ ] Admin ve tickets pendientes y puede aprobar/rechazar
- [ ] Cambio de estado notifica por email
- [ ] Tests de integración cubren flujo completo KYB

### feat-005-3
- [ ] Página `/registrarse` renderiza sin errores de tipo
- [ ] Formulario valida en cliente y envía a `/api/auth/register`
- [ ] Página `/verificar-otp` valida código y redirige a login
- [ ] Typecheck y lint sin errores

### feat-005-4
- [ ] `/operador/kyb` sube archivos reales y muestra progreso
- [ ] `/admin/kyb` lista tickets, permite aprobar/rechazar con motivo
- [ ] Estado KYB visible en tiempo real para operador
- [ ] Typecheck y lint sin errores

## Riesgos y Mitigaciones

### Riesgo 1: Documentos KYB rechazados por formato/ilegibilidad
- **Mitigación**: Validación en frontend con preview, instrucciones claras en español es-CO

### Riesgo 2: Experiencia de usuario compleja en KYB
- **Mitigación**: Wizard paso a paso con progreso visual, tooltips informativos

### Riesgo 3: Carga excesiva en OCR
- **Mitigación**: Procesamiento asíncrono con colas de trabajo (futuro)

### Riesgo 4: Fallo en notificaciones
- **Mitigación**: Reintentos con backoff exponencial, múltiples canales (SMTP + consola dev)

### Riesgo 5: Brecha de seguridad en gestión de documentos
- **Mitigación**: Almacenamiento seguro, firma de documentos, eliminación segura (Supabase Storage con RLS)

## Cronograma de Implementación (Estimado)

### Sprint 1: Core Auth Backend (feat-005-1)
- Setup Use Cases y Endpoints
- Tests unitarios e integración

### Sprint 2: KYB Backend (feat-005-2)
- Endpoints de estado y aprobación
- Tests de integración

### Sprint 3: Frontend Registro/OTP (feat-005-3)
- Páginas PWA con Liquid Glass
- Typecheck/Lint

### Sprint 4: Frontend KYB/Admin (feat-005-4)
- Conexión real API
- Panel admin KYB

## Checklist de Verificación Global

### Funcional
- [ ] Registro de Conductores y Operadores funciona
- [ ] Verificación OTP en tiempo real
- [ ] Subida segura de documentos KYB
- [ ] Aprobación/Rechazo KYB por admin
- [ ] Activación de sede automática
- [ ] Flujo completo: Registro → KYB → Login

### Técnico
- [ ] JWT tokens seguros implementados (Argon2id + JWT)
- [ ] Políticas RLS aplicadas en Supabase
- [ ] Rate limiting configurado en Fastify
- [ ] Logging de auditoría completo
- [ ] Manejo de errores robusto
- [ ] Todas las APIs documentadas (OpenAPI)

### Calidad
- [ ] Typecheck limpio en frontend y backend
- [ ] Tests unitarios ≥ 90% en domain layer
- [ ] Tests de integración HTTP pasando
- [ ] Accesibilidad WCAG 2.1 AA en formularios
- [ ] Performance: auth < 2s, KYB upload < 10s

---

Este plan de tareas proporciona una guía detallada para implementar la especificación de Autenticación y KYB, asegurando una experiencia de usuario fluida, seguridad robusta y cumplimiento normativo completo.