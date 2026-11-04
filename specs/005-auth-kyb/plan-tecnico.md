# Plan Técnico: Autenticación y KYB (005-auth-kyb)

## 1. Visión Arquitectural
El módulo de Autenticación y KYB sigue la **Arquitectura Hexagonal** (Clean Architecture) implementada en el monolito modular de LOCIFY (`services/admin-api`) y la interfaz PWA (`apps/web-cliente`).

```
[apps/web-cliente PWA] --(JWT Bearer)--> [admin-api (Fastify)] 
                                              │
                                       (Prisma ORM)
                                              │
                                       [Supabase PostgreSQL + RLS]
```

---

## 2. Componentes y Capas (Hexagonal)

### 2.1 Domain Layer (`services/admin-api/src/domain/`)
- **Entities & Value Objects**:
  - `Usuario`: Gestión de credenciales, roles (`CONDUCTOR`, `OPERADOR`, `ADMIN`), estados (`PENDIENTE`, `ACTIVO`, `SUSPENDIDO`).
  - `TicketKYB`: Gestión de documentos legales (RUT, Cámara de Comercio) y estados de verificación (`EN_REVISION`, `APROBADO`, `RECHAZADO`).
  - `PoliticaPassword`: Reglas de complejidad (≥ 12 caracteres, mayúsculas, minúsculas, números, símbolos).
- **Use Cases**:
  - `LoginUsuarioUseCase`: Autenticación segura mediante Argon2id y JWT (RF-07).
  - `RegistrarUsuarioUseCase`: Autoregistro de conductores con validación de celular colombiano y OTP.
  - `VerificarOtpUseCase`: Validación de código OTP de 6 dígitos y activación de cuenta.
  - `RegistrarOperadorUseCase`: Alta de operador mediante invitación con token.
  - `SubirDocumentosKYBUseCase`: Carga y validación de documentos legales para KYB.
  - `CambiarEstadoTicketKYBUseCase`: Aprobación o rechazo de tickets KYB por parte del ADMIN.

### 2.2 Ports (`services/admin-api/src/domain/ports/`)
- `UsuarioRepository`: Persistencia de usuarios.
- `TicketKYBRepository`: Persistencia y consulta de tickets KYB.
- `SedeRepository`: Gestión de sedes y asociación con operadores.
- `PasswordHasher`: Hash de contraseñas (Argon2id).
- `ServicioDeTokens`: Emisión y validación de JWT.
- `EmailService`: Envío de invitaciones y códigos OTP (con adaptadores `EmailConsola` y `SmtpEmailService`).

### 2.3 Infrastructure Layer (`services/admin-api/src/infrastructure/`)
- **Persistence**: `PostgresUsuarioRepository`, `PostgresTicketKYBRepository`, `PostgresSedeRepository` con Prisma ORM.
- **Security**: `Argon2Hasher`, `JwtService`.
- **Notifications**: `EmailConsola`, `SmtpEmailService` con plantillas HTML/Texto.

### 2.4 Interfaces / HTTP Layer (`services/admin-api/src/interfaces/http/`)
- Endpoints Fastify validados con esquemas JSON Schema / Zod:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/verify-otp`
  - `POST /api/kyb/subir-documentos`
  - `GET /api/kyb/status/:operatorId`
  - `GET /api/admin/kyb/pendientes`
  - `PATCH /api/admin/kyb/:id/estado`
  - `POST /api/operadores/invitacion`

---

## 3. Plan de Implementación por Fases (Feature List Breakdown)

Actualización de `specs/005-auth-kyb/feature_list.json` y desglose de tareas:

1. **feat-005-1**: Registro de Conductor y OTP (Backend)
   - Implementar `RegistrarUsuarioUseCase` y `VerificarOtpUseCase`.
   - Extender `EmailService` con `enviarOtp`.
   - Añadir rutas POST `/api/auth/register` y POST `/api/auth/verify-otp`.
   - Pruebas unitarias e integración.
2. **feat-005-2**: Flujo KYB Backend & Estado
   - Implementar endpoint `GET /api/kyb/status/:operatorId`.
   - Conectar `SubirDocumentosKYBUseCase` y `CambiarEstadoTicketKYBUseCase` con validación de roles (`OPERADOR`, `ADMIN`).
   - Pruebas de integración KYB.
3. **feat-005-3**: Interfaz PWA - Registro y Verificación (Frontend)
   - Crear `/registrarse` (Conductor) con validación Zod / formularios OKLCH Liquid Glass.
   - Crear `/verificar-otp` para validación de cuenta.
   - Actualizar `lib/api.ts` con clientes de registro y OTP.
4. **feat-005-4**: Interfaz PWA - KYB & Panel Admin
   - Conectar `/operador/kyb` con el backend real para subida de RUT y Cámara de Comercio.
   - Crear `/admin/kyb` para que el superusuario apruebe o rechace tickets KYB.
   - Pantalla de estado KYB para operadores pendientes de aprobación.

---

## 4. Estrategia de Verificación y Calidad
- **Typecheck**: `pnpm typecheck` (TypeScript estricto en frontend y backend).
- **Lint**: `pnpm lint`.
- **Tests**: `pnpm test` (tests unitarios e integración en admin-api).
- **Quality Gates**: Respetar separación de capas hexagonales, sin lógica de negocio en controladores HTTP.
