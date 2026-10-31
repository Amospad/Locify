# Estado del Proyecto LOCIFY

## Fase Actual
- [x] Reescribir el documento de Antecedentes y Justificación con investigación exhaustiva y fuentes APA 7 (2026-10-30).
- [x] Documentación de flujos de usuario completos (mapa general y flujos detallados 1, 2, 3, 5, 6 con Mermaid en Docusaurus) (2026-10-30).
- [x] Publicación de la documentación en Vercel con rediseño UI/UX
- [x] Configuración de Skills (QA, CI/CD, Seguridad, Diseño)
- [x] Auditoría técnica de código, documentación y arquitectura (2026-10-27)
- [x] Ratificación del ADR-003: monolito modular con un esquema por módulo (2026-10-27)
- [x] Capa HTTP mínima: `buildServer()` (sin `listen`) + `GET /health` con Fastify, helmet, CORS y rate limit (2026-10-27)
- [x] Registro de operadores por HTTP: `POST /api/operadores` + composition root en `src/index.ts` (2026-10-27)
- [x] Correo SMTP y reinvitación: `SmtpEmailService` (nodemailer, timeouts de 10 s) + `POST /api/operadores/:id/reinvitar` (2026-10-27)
- [x] Autenticación JWT y RBAC: `POST /api/auth/login` + `preHandler` Bearer y reinvitación sólo para ADMIN (2026-10-27)
- [x] Cambio de alcance: App del Cliente como PWA *mobile-first* usable también desde escritorio (2026-10-27)
- [x] Trazabilidad RF→HU al 100 % (32/32) con 30 historias de usuario (2026-10-27)
- [x] Backlog del Administrador: HU-A05…HU-A11 con criterios de aceptación (2026-10-28)
- [x] Skill de diseño de identidad visual **brand-identity** instalada (`.agents/skills/brand-identity/`, fuente `Esi-Abolfazl/skills`; evaluación de riesgo: Safe/0 alerts/Low) y fijada en `skills-lock.json` (2026-10-28)
- [x] Conceptos de logo LOCIFY generados en `docs/static/img/brand/` (2026-10-28)
- [x] Logo **C-1 «Vía libre» aprobado** por el equipo e integrado en Docusaurus: navbar (`logo.svg` + `logo-dark.svg`), favicon.ico multi-tamaño, set de favicon moderno en `headTags`, social card 1200×630 y guía de diseño §5 (2026-10-29)
- [x] Casos de uso CU-11…CU-16 y RF-33/RF-34 sincronizados con el nuevo backlog (2026-10-28)
- [x] Auditoría de seguridad ofensiva + sincronización docs↔código del backend (17 pruebas AN-A…AN-E, `bodyLimit` 32 KiB, `TRUST_PROXY`; correcciones en 03/07/modelo-datos) (2026-10-29)
- [x] PWA del cliente inicializada: Next.js 16 (`apps/web-cliente`) con identidad visual LOCIFY y Hero de la landing (2026-10-29)
- [x] Login conectado al backend (`POST /api/auth/login` vía `NEXT_PUBLIC_API_URL`), dashboard placeholder y manifiesto PWA — validado E2E con el admin-api real (401/403/200/logout/guard) (2026-10-29)
- [x] Mapa interactivo `/buscar` con MapLibre GL + OpenFreeMap, marcadores mock (RF-11), buscador de direcciones (Nominatim) y geolocalización — validado en navegador (2026-10-29)
- [x] Flujo completo de reserva (HU-C01 / RF-09 / RF-11): endpoint público `GET /api/sedes`, conexión de `MapaParqueaderos.tsx` a `POST /api/reservas` con JWT, modal de confirmación con modalidades Garantizada/Exprés y visualización de código QR (2026-10-29)
- [x] Modal premium de reserva exitosa (`ReservaExitosaModal.tsx`): animaciones Framer Motion (fade-in + scale), código QR generado con `qrcode.react`, botón de descarga PNG con `html-to-image`, badge de modalidad (Garantizada/Exprés), contador regresivo 5 min solo para Exprés con alerta de expiración, diseño Apple HIG/LOCIFY (esquinas 24px, sombra suave, Verde Esmeralda #00C853) (2026-10-30)
- [x] **Dashboard del Operador (App del Parqueadero)** — `apps/web-cliente/src/app/operador/dashboard/page.tsx` + endpoints `POST /api/operador/check-in`, `POST /api/operador/check-out`, `GET /api/operador/reservas-activas` (2026-10-30):
  - **Backend**: nuevos casos de uso `CheckInReservaUseCase`, `CheckOutReservaUseCase`, `ListarReservasActivasUseCase`; servicio `OperadorServiceImpl`; rutas protegidas con JWT + `exigirRol(OPERADOR, ADMIN)`; check-in valida QR y confirma reserva ACTIVA; check-out finaliza la reserva, calcula duración en minutos y libera cupo; listado filtra por sede y muestra tiempo transcurrido
  - **Frontend**: página protegida (redirige CONDUCTOR a `/dashboard`); selector de sede; escáner QR con `html5-qrcode` (cámara trasera, caja de escaneo 250×250, 10 fps); tabla de vehículos activos con Placa/QR, hora de ingreso, tiempo transcurrido (formato legible), badge modalidad (Garantizada/Exprés) y botón Check-out por fila; alertas de éxito/error (verde/rojo) con auto-dismiss; actualización automática cada 30s; diseño LOCIFY (Azul Acero #2F5D9F, Grafito #1F2937, Poppins, sombras suaves, esquinas 12px/24px)
- [x] **Dashboard del Conductor (RF-09, RF-21, HU-27)** — `apps/web-cliente/src/app/dashboard/page.tsx` + endpoints `GET /api/reservas/mis-reservas`, `GET /api/reservas/activa` (2026-10-30):
  - **Backend**: nuevos casos de uso `ListarMisReservasUseCase`, `ObtenerReservaActivaUseCase`; métodos en `ReservaService`; rutas protegidas con JWT (cualquier rol); `buscarPorUsuario` en `PostgresReservaRepository` con orden descendente por fecha; `buscarActivaPorUsuario` reutilizado; `EstadoReserva` extendido con `EXPIRADA`
  - **Frontend**: página rediseñada con dos secciones animadas (Framer Motion): (a) **Reserva Activa** — tarjeta destacada con sede, QR (`qrcode.react`), cronómetro en tiempo real (actualización cada segundo) si estado ACTIVA; (b) **Historial** — lista de tarjetas con sede, fecha, badge de estado (colores LOCIFY: Azul Acero=Activa, Verde Esmeralda=Completada, Rojo=Cancelada, Ámbar=Expirada), modalidad (Garantizada/Exprés) y código QR; **Estado vacío** amigable con icono y botón "Buscar parqueadero" → `/buscar`; diseño LOCIFY consistente (Azul Acero, Grafito, Poppins, sombras, esquinas 12px/24px)
- [x] **Onboarding KYB (Know Your Business) — RF-23, RF-24, RF-29 (2026-10-30):**
  - **Backend**: entidad `TicketKYB`; nuevos casos de uso `SubirDocumentosKYBUseCase`, `ListarTicketsKYBPendientesUseCase`, `CambiarEstadoTicketKYBUseCase`; repositorio `PostgresTicketKYBRepository`; endpoints `POST /api/kyb/subir-documentos` (OPERADOR), `GET /api/admin/kyb/pendientes` (ADMIN), `PATCH /api/admin/kyb/:id/estado` (ADMIN); `Sede` extendida con `EstadoSede` (ACTIVA, PENDIENTE_KYB, RECHAZADA); aprobación de ticket activa automáticamente la sede
  - **Frontend (Operador)**: `src/app/operador/kyb/page.tsx` con formulario de registro de sede (nombre, dirección, coordenadas, capacidad, precio) y campos para URLs de documentos (RUT, Cámara de Comercio); estados de envío y mensajes de revisión
  - **Frontend (Admin)**: `src/app/admin/kyb/page.tsx` con tabla de solicitudes pendientes; modal de revisión con visualización de documentos, botones de Aprobar/Rechazar y campo de motivo de rechazo; animaciones Framer Motion; diseño LOCIFY
- [x] **Diseño 3D Futurista y Animaciones Avanzadas (2026-10-30):**
  - **Tecnologías**: Instaladas `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `framer-motion`, `lenis` (@studio-freight/lenis).
  - **Landing Page (`/`)**: Escena 3D interactiva (`Hero3D.tsx`) con React Three Fiber (modelos abstractos geométricos flotantes, iluminación dinámica, materiales metálicos con emissive); diseño glassmorphism avanzado; animaciones de entrada escalonadas con Framer Motion; Scroll suave con **Lenis**.
  - **Profundidad visual**: Sombras multicapa, gradientes con colores LOCIFY (Azul Acero #2F5D9F, Grafito #1F2937, Verde Esmeralda #00C853); iluminación ambiental y efectos de profundidad.
  - **Glassmorphism**: Formularios de búsqueda, tarjetas de parqueaderos y modales con efecto vidrio esmerilado (`backdrop-blur`, bordes semitransparentes `border-white/20`).
  - **Micro-interacciones**: Efectos hover/scale con Framer Motion en botones, modales y tarjetas.
  - **Validación**: `npm run build` totalmente en verde para `apps/web-cliente`.
- [x] **Flujo de Pagos y Cancelación (RF-14, RF-16, RF-19) — 2026-10-30:**
  - **Backend**: Puerto `PaymentGateway` y adaptador `MockPaymentGateway`; `CrearReserva` procesa pago para reservas GARANTIZADAS y lanza `PagoRechazadoError` (HTTP 402) si falla; `CancelarReserva` con lógica de reembolso y ventana de 30 min.
  - **API**: `POST /api/reservas` con `{ sedeId, modalidad, tokenTarjeta? }`; `POST /api/reservas/:id/cancelar`.
  - **Frontend**: Modal de reserva con formulario simulado de datos de tarjeta para modalidad GARANTIZADA; botón de cancelación en Dashboard.
  - **Validación**: Backend tests 140/140 pasando; Frontend build exitoso.
- [x] **Adaptador Stripe + Webhooks — 2026-10-30:**
  - `StripePaymentGateway` implementa `PaymentGateway` usando `stripe.charges.create` y `stripe.refunds.create`.
  - Composition root selecciona `StripePaymentGateway` cuando `STRIPE_SECRET_KEY` está presente, de lo contrario usa `MockPaymentGateway`.
  - Ruta `POST /api/webhooks/stripe` preparada para validar firma con `STRIPE_WEBHOOK_SECRET`.
  - Variables de entorno documentadas en `.env.example`.
- [x] **Pruebas E2E con Playwright — 2026-10-30:**
  - Playwright configurado con `tests-e2e/`.
  - `flujo-critico.spec.ts` con smoke test y flujos de conductor (GARANTIZADA y EXPRES).
  - Configuración `webServer` para levanta `apps/web-cliente` en puerto 3001.
  - Estructura lista para flujos de operador/check-in y KYB.
- [x] **Seed masivo de datos — 2026-10-30:**
  - `services/admin-api/prisma/seed.ts` genera 3 Admin, 20 Operadores, 30 Sedes Medellín, 50 Reservas (20 ACTIVAS, 20 FINALIZADAS, 10 CANCELADAS) y 10 Tickets KYB.
  - Contraseñas Argon2id, coordenadas reales aproximadas, estados ACTIVA/PENDIENTE_KYB.
- [x] **Corrección de contraste WCAG AA — 2026-10-30:**
  - Textos principales Grafito #1F2937 sobre fondos claros #F4F6F8/Blanco; textos sobre Azul Acero #2F5D9F en Blanco #FFFFFF.
  - Badges dashboard cambiados a `text-grafito` en fondos tintados, etc.
- [x] **Rediseño mapa conductor estilo Apple Maps — 2026-10-30:**
  - Mapa 3D con `pitch:45` y `bearing:-17.6`.
  - Marcadores tipo pill flotantes con precio/hora.
  - Bottom sheet con Framer Motion para detalle de sede y botón Reservar.
  - Barra de búsqueda pill y botón de ubicación flotante.
- [] Implementación del módulo `admin-api` (Prisma + PostgreSQL)
- [] Implementación de los demás módulos (`operador`, `cliente`, `pagos`)

## Stack Tecnológico
- Backend: Node.js + TypeScript + Prisma
- Base de Datos: PostgreSQL (Docker)
- Arquitectura: Hexagonal (Puertos y Adaptadores)

## Decisiones Clave (ADRs)
- ADR-001: Arquitectura Hexagonal.
- ADR-002: Modelo Híbrido de Reservas.
- ADR-003: Monolito modular antes que microservicios (**Aceptado**, ratificado el 2026-10-27; un esquema por módulo).
- ADR-004: Fastify 5 como framework HTTP (**Aceptado**, 2026-10-27).
- Decisión de negocio (no es ADR): buffer de seguridad del 95 % de celdas, documentado en `docs/docs/formativo/09-modelo-negocio-y-resiliencia.md`.

## Tareas Pendientes (Backlog Técnico)
- [x] Terminar la prueba de conexión de Prisma. (`npm run test:db` en `services/admin-api` → `SELECT 1`)
- [x] Aplicar el contrato de Prisma a PostgreSQL. (`npm run db:init` → tabla `usuario` con índice único en `email` y checks de enums)
- [x] Implementar el adaptador `PostgresUsuarioRepository`. (`npm test` → 23/23 tests verdes: 20 unitarios + 3 de integración real contra PostgreSQL)
- [x] Documentar la arquitectura de agentes IA. (`docs/docs/tecnico/arquitectura-agentes.md` + sección "Automatización y Agentes de IA" en el documento formativo 09)
- [x] Ratificar el ADR-003 y marcar `modelo-datos.md` y `arquitectura-hexagonal.md` como módulos de un monolito modular.
- [x] Capa HTTP mínima: `buildServer()` sin `listen`, `GET /health` con `SELECT 1`, helmet, CORS y rate limit. (`npm test` → 27/27; `curl /health` → 200 contra PostgreSQL real)
- [x] Cerrar la trazabilidad RF→HU: **32/32** requerimientos con historia (HU-27…HU-30) y matriz actualizada.
- [x] Hashing de contraseñas con Argon2id: puerto `PasswordHasher`, adaptador `Argon2Hasher` y `RegistrarOperador` hasheando antes de persistir. (`npm test` → 33/33)
- [x] Política de complejidad de contraseñas (RF-06): 12–128 caracteres, 4 categorías, 100 contraseñas comunes rechazadas, validada antes del hasher. (`npm test` → 53/53)
- [x] Registro de operadores de extremo a extremo: `POST /api/operadores` (201/400/409/502/429) con composition root real y verificación contra PostgreSQL. (`npm test` → 64/64)
- [x] Bloqueante 3 (correo): `SmtpEmailService` con timeouts de 10 s, `EmailConsola` para desarrollo, reinvitación con token nuevo y 502 que devuelve el id para reintentar la invitación. (`npm test` → 88/88)
- [x] Autenticación JWT y RBAC: login con Argon2id, JWT HS256 (`jose`), `preHandler` Bearer y `exigirRol(ADMIN)` en la reinvitación. (`npm test` → 117/117)

## Auditoría Técnica (2026-10-27)

Revisión de 360° sobre código, documentación y arquitectura. Las skills `crucible`, `code-refactor-review` y
`awesome-code-review` **no están instaladas** en el repositorio: `skills-lock.json` solo fija `apple-hig` y `rig`.
La revisión se hizo por lectura directa con evidencia `archivo:línea`, sin simular herramientas inexistentes.

### Corregido en esta pasada

| Hallazgo | Evidencia | Corrección |
| :--- | :--- | :--- |
| PowerShell incrustado en un documento | `03-alcance-requerimientos.md:1-5,105-107` | Frontmatter restaurado; el HTML generado ya no contiene `$contenido` ni `Out-File` |
| Dos bloques Mermaid sin cerrar | `modelo-datos.md:12,116` | Vallas cerradas; las secciones 2 a 5 se renderizan como `<h2>` (antes eran código) |
| Matriz de trazabilidad incompleta | `07-matriz-trazabilidad.md` cubría 8 de 32 RF | Matriz completa de 32 RF + 10 RNF, con huecos declarados |
| CU/HU inexistentes en la matriz | `HU-P01`, `HU-A04`, `CU-02 (Validación)` | IDs alineados con `04-casos-uso.md` y `05-historias-usuario.md` |
| ER de 6 entidades vs. contrato de 1 | `modelo-datos.md` vs. `contract.prisma` | Sección "Estado de implementación" + entidades faltantes + `text` en vez de `VARCHAR(255)` |
| FK entre servicios en un modelo database-per-service | `modelo-datos.md` | Referencias marcadas como lógicas; solo FK físicas intra-servicio |
| Bibliografía APA deficiente y cifras sin fuente | `06-antecedentes-justificacion.md` | APA 7 corregida (incluye DOI de Shoup) + nota de verificación de fuentes |
| Escenarios y estados inventados | `09-modelo-negocio-y-resiliencia.md` | "7 escenarios" → 8; `SINCRONIZANDO` inexistente → `sincronizado = false`; índice UNIQUE marcado como diseño |
| Dos guías de diseño con el mismo título y paletas contradictorias | `tecnico/guia-diseno-ui.md` vs. `referencia/guia-diseno-ui.md` | La guía HIG ya no define colores; ambas están en el sidebar |
| Dominio importaba `node:crypto` y `new Date()` | `RegistrarOperador.ts:4,26` | Puertos `GeneradorId` y `Reloj` + adaptadores en infraestructura |
| Validación de email trivial y contraseñas en claro aceptadas | `Usuario.ts:51` | Regex, normalización a minúsculas, límite de 254 y exigencia de hash BCrypt/Argon2 |
| Caso de uso sin ninguna prueba | `RegistrarOperador` | `tests/unit/RegistrarOperador.test.ts` (7 casos con fakes) |
| Variable de entorno con `!` no verificada | `prisma.config.ts:9` | Validación explícita con mensaje accionable |
| Entrada que declaraba éxito sin atender peticiones | `src/index.ts` | Mensaje honesto y `exit code 1` |
| ADR-003 citado pero inexistente | `PROJECT_STATE.md` | ADR-003 real (monolito modular); el buffer 95 % se reclasifica como decisión de negocio |

### Bloqueantes abiertos (no se corrigieron aquí)

| Bloqueante | Evidencia | Motivo |
| :--- | :--- | :--- |
| Sin capa HTTP ni autenticación | `src/interfaces/http/` (antes inexistente) | **Resuelto en lo esencial (2026-10-27):** `POST /api/operadores`, `GET /health` y `POST /api/auth/login` verificados E2E; la reinvitación exige JWT de ADMIN. Quedan: registro público, activación de cuenta y pruebas de allowlist CORS |
| Sin hashing real de contraseñas | `package.json` no incluía bcrypt/argon2 | **Resuelto (2026-10-27):** puerto `PasswordHasher` + `Argon2Hasher` (Argon2id, m=65536 t=3 p=4) + `RegistrarOperador` hashea antes de persistir |
| Sin adaptador de correo | `EmailService` sin implementación | **Resuelto (2026-10-27):** `SmtpEmailService` (nodemailer, timeouts de 10 s) + `EmailConsola` para desarrollo + reinvitación. Pendiente probar contra un proveedor real (Mailtrap/SMTP) |
| CI roto | `.gitlab-ci.yml:20-40`: imagen `ubuntu:24.04` sin Node y `verify.sh` inexistente | Requiere reescribir el pipeline completo |
| `init.ps1` no parsea | Error en la línea 30 (`—` mal codificado) | Rompe el paso "Resume" del harness |
| Registro sin transacción ni outbox | `RegistrarOperador` guarda y luego envía correo | Requiere una decisión de diseño (ADR) |
| Prisma 8 **release candidate** en un servicio que se pretende productivo | `package.json:28-30` (`^8.0.0-rc.27`) | Decisión del equipo: fijar versión estable |
| Pruebas de integración contra la base de desarrollo | `tests/integration` usa el mismo `DATABASE_URL` | Requiere contenedor de test dedicado |
| Afirmaciones de disponibilidad y rendimiento sin instrumento | RNF-04, RNF-05, RNF-07 | Definir métrica y comando de verificación antes de afirmarlas |

### Verificación de esta pasada

- `services/admin-api`: `npm run build` limpio; `npm test` → **27/27** (20 unitarios + 4 HTTP + 3 de integración contra PostgreSQL).
- `docs`: `npm run build` → `Generated static files in "build"`; el HTML emitido no contiene el texto de PowerShell y `modelo-datos` renderiza sus cinco secciones como encabezados.

### Capa HTTP (2026-10-27)

- `src/interfaces/http/server.ts`: `buildServer(deps, opciones)` registra helmet, CORS por allowlist (`CORS_ORIGINS`) y rate limit global (100 req/min) y **no** llama a `listen`; el logger nace con `redact` sobre `password`, `passwordHash` y `authorization`.
- `src/interfaces/http/routes/health.ts`: `GET /health` ejecuta `SELECT 1`; responde `200 {status:'ok',db:'up'}` o `503 {status:'error',db:'down'}` sin filtrar el error interno. Exento de rate limit para no gastar cuota del monitor.
- `src/application/ports/ConsultadorDeBaseDeDatos.ts` + `src/infrastructure/persistence/PostgresConsultadorDeBaseDeDatos.ts`: puerto y adaptador del chequeo; el dominio y la capa HTTP no conocen Prisma.
- `src/index.ts`: valida `PORT` (1–65535) y `DATABASE_URL`, construye el servidor, escucha en `PORT` (3000 por defecto) y cierra ordenadamente con `SIGINT`/`SIGTERM`.
- **Evidencia:** `npm run test:http` → **4/4**; `npm test` → **27/27**; `node dist/index.js` en el puerto 3100 + `Invoke-WebRequest /health` → `200 {"status":"ok","db":"up"}` con `x-content-type-options: nosniff`.
- **Pendiente de este bloqueante:** pruebas de allowlist CORS y protección del resto de rutas. (Autenticación/RBAC y `POST /api/operadores` quedaron cerrados el 2026-10-27; ver las secciones siguientes.)

## Registro de operadores por HTTP (2026-10-27)

**El flujo completo ya se ejecuta de extremo a extremo**, no sólo en pruebas.

- `src/interfaces/http/routes/operadores.ts`: `POST /api/operadores` con JSON Schema (`required: ['email','password']`, `additionalProperties: false`, `maxLength` 254/128) y rate limit propio de 10 req/min. Responde `201 { id, email }` —nunca hash, token ni contraseña— y delega la complejidad de la contraseña en `PoliticaPassword` para que exista un único mensaje de error.
- `src/interfaces/http/errores.ts`: `mapearError` traduce **tipos, no mensajes**: `ErrorDeValidacion → 400`, `ErrorDeConflicto → 409`, `ErrorEnvioDeInvitacion → 502`. El manejador global normaliza los 400 de esquema y responde 500 sin `stack` ni detalles de Prisma/SMTP.
- `src/domain/errors/`: tres errores con nombre propio. `ErrorEnvioDeInvitacion` conserva la causa (`cause`) para el log.
- **Composition root en `src/index.ts`** (desviación consciente del plan, que proponía `src/composition.ts`): instancia `PostgresUsuarioRepository`, `Argon2Hasher`, `CryptoGeneradorId`, `RelojSistema`, `EmailConsola` y `AdminService`, y los inyecta en `buildServer({ db, adminService })`. El dominio y la capa HTTP sólo ven puertos.
- `src/infrastructure/email/EmailConsola.ts`: imprime el enlace de invitación en desarrollo y **se niega a arrancar** con `NODE_ENV=production` salvo `EMAIL_CONSOLA_PERMITIDA=true`: el token es una credencial y el log no es un canal seguro.
- Fastify se configura con `removeAdditional: false` y `coerceTypes: false`; por defecto Fastify **elimina** las propiedades extra en lugar de rechazarlas, lo que habría dejado pasar `{"rol":"ADMIN"}` en silencio.
- `RegistrarOperador.ejecutar` ahora devuelve `OperadorRegistrado { id, email }` (antes `void`) y envuelve el fallo del correo en `ErrorEnvioDeInvitacion`.

**Evidencia ejecutada**

- `npm test` → **64/64** (46 unitarios + 15 HTTP + 3 de integración contra PostgreSQL), 0 fallos. `tests/http/operadores.test.ts` cubre 11 casos: 201, normalización del email, 409, 400 (política, longitud, email, campo faltante, propiedad extra, contraseña > 128), 502 y 429.
- `npm run build` → `tsc` sin errores.
- **E2E contra PostgreSQL real** (`node dist/index.js`, puerto 3131): `POST /api/operadores` → `201 {"id":"99b2972f-…","email":"e2e-…@locify.test"}`; repetido → `409`; contraseña sin mayúscula → `400`; `GET /health` → `200`. En la base quedó `estado=PENDIENTE`, `rol=OPERADOR`, `hash=$argon2id$v=19$m=65536,p=4,t=3$…`, token presente y expiración a 24 h; la fila de prueba se eliminó después.
- El log de `EmailConsola` mostró el enlace `/activar?token=…`, lo que prueba que el composition root conecta el caso de uso con el adaptador de correo.

**Riesgos que siguen abiertos**

- Si el correo falla, el operador queda persistido y la respuesta es **502 con su `id`**: reintentar el registro da 409, pero `POST /api/operadores/:id/reinvitar` reenvía la invitación (2026-10-27).
- Una colisión real del índice UNIQUE (dos peticiones concurrentes) no se traduce a 409: llega como 500, porque la comprobación previa no es atómica.
- El registro (`POST /api/operadores`) sigue sin autenticación: sólo lo protege el rate limit. La reinvitación ya exige un ADMIN (2026-10-27). **No debe exponerse a Internet** hasta cerrar el registro y el flujo de activación.

## Correo SMTP y reinvitación (2026-10-27)

**Estado: cerrado.** Commits: `9081f17` (adaptador SMTP y reinvitación) y `d939a58` (política de contraseñas, base del flujo de autenticación).

- **`src/infrastructure/notifications/SmtpEmailService.ts`**: adaptador del puerto `EmailService` sobre `nodemailer@10.2.1`. Configura `connectionTimeout`, `greetingTimeout` y `socketTimeout` en **10 000 ms**; sin ellos, un servidor SMTP lento deja la petición HTTP colgada. El transporte se reutiliza y se libera con `cerrar()` en el apagado ordenado.
- **Configuración validada al arrancar** (`opcionesSmtpDesdeEntorno`): `SMTP_HOST` y `SMTP_FROM` obligatorias; `SMTP_PORT` entero 1–65535 (587 STARTTLS, 465 TLS directo, o `SMTP_SECURE`); `SMTP_USER` y `SMTP_PASS` van juntas; el servidor local sin autenticación se admite. `EMAIL_DRIVER=console|smtp` elige el adaptador; un valor desconocido detiene el proceso nombrándolo.
- **Plantilla** (`notifications/plantillas/invitacion.ts`): HTML + texto plano con enlace `APP_URL/activar?token=…`, el token como código y la vigencia de 24 h; los valores se escapan antes de tocar el HTML.
- **Reinvitación**: `ReinvitarOperadorUseCase` busca por id (404 si no existe), delega en `Usuario.regenerarInvitacion` la regla "sólo PENDIENTE" (400 si está ACTIVO o SUSPENDIDO) y devuelve una **instancia nueva** —la entidad sigue siendo inmutable—, persiste el token nuevo y reenvía el correo. El token anterior deja de ser válido porque sólo se guarda uno.
- **502 con `id`**: el registro que falla al enviar devuelve `{ error, id }` para que el cliente pueda reinvitar en vez de duplicar el usuario (que daría 409).
- **Log de la causa**: el manejador global registra el `cause` real (p. ej. `connect ECONNREFUSED 127.0.0.1:2525`) sólo en el log; el cliente recibe un mensaje genérico.

**Evidencia ejecutada**

- `npm test` → **88/88** (65 unitarios + 20 HTTP + 3 de integración), 0 fallos.
  - `tests/unit/ReinvitarOperador.test.ts` (5): renueva token y expiración, 404, ACTIVO, SUSPENDIDO, fallo de correo con token persistido.
  - `tests/unit/SmtpEmailService.test.ts` (11): lectura y validación de entorno, `secure` por puerto, auth opcional, los tres timeouts, mensaje con enlace y token, barra final en `APP_URL`.
  - `tests/http/operadores.test.ts` (+5): 200 con token rotado, 404, 400 si está ACTIVO, 502 en reinvitación y **registro fallido → 502 con id → reinvitación 200 sin duplicar**.
- `npm run build` → `tsc` sin errores.
- **SMTP real (sin servidor levantado)**: `EMAIL_DRIVER=smtp` sin `SMTP_HOST` → `[admin-api] SMTP_HOST no está definida…` y salida 1. Con `SMTP_HOST=127.0.0.1:2525` apagado, el registro devuelve **502 con id**, la reinvitación **502**, y el log registra `connect ECONNREFUSED 127.0.0.1:2525`.
- **Reinvitación contra PostgreSQL**: registro → 201; reinvitación → 200; los dos tokens impresos por `EmailConsola` son distintos y el persistido coincide con el segundo; `estado=PENDIENTE`, expiración a 24 h. La fila de prueba se eliminó.

**Pendiente / riesgos**

- No se ha validado contra un proveedor SMTP real (Mailtrap, SES, Brevo): hace falta credenciales y un remitente verificado. La lógica de error y timeout está probada, el envío feliz real no.
- Sigue sin outbox: si el proceso muere entre `guardar` y `sendMail`, el operador queda PENDIENTE sin correo; la reinvitación manual lo resuelve.
- `POST /api/operadores/:id/reinvitar` no está autenticado ni limitado por rol: cualquiera con el id puede provocar correos. El rate limit (10/min) acota el abuso, no la autorización.
- El HTML de la plantilla es deliberadamente simple y no se ha probado en clientes de correo (Outlook/Gmail) ni con un verificador de spam.

## Autenticación JWT y RBAC (2026-10-27)

**RF-07 (nombre usado en el sprint: login): implementado.** En la matriz de trazabilidad RF-07 es la *activación* de la cuenta, que sigue parcial; la nota al final lo aclara.

- **`LoginUsuarioUseCase`** (`src/domain/use-cases/LoginUsuario.ts`): normaliza el email (`trim` + minúsculas), busca por email, compara con Argon2id y **sólo entonces** revela el estado de la cuenta.
  - Email inexistente → comparación **señuelo** contra un hash Argon2id descartado y `CredencialesInvalidasError` (401). Igualar el costo de Argon2 evita enumerar cuentas midiendo latencia.
  - Contraseña incorrecta → el mismo `CredencialesInvalidasError`. La respuesta es idéntica byte a byte (probado).
  - PENDIENTE o SUSPENDIDO con contraseña correcta → `UsuarioNoActivoError` (403). La contraseña se verifica antes del estado: sin credenciales válidas no se aprende nada de la cuenta.
  - Éxito → `{ token, usuario: { id, email, rol } }`; nunca hash, token de invitación ni contraseña.
- **Puerto `ServicioDeTokens`** + **`JwtService`** (`jose@6.2.13`): HS256, `iss`/`aud` verificados, `sub` = id, claims `email` y `rol`, expiración de 1 h por defecto. Sin `JWT_SECRET` (≥ 32 caracteres) el proceso no arranca. Se eligió `jose` sobre `jsonwebtoken` por ser ESM nativo y no necesitar `@types`.
- **`POST /api/auth/login`**: body estricto (`additionalProperties: false`), rate limit **5/min**, respuestas 200/400/401/403/429. La política de contraseñas no se aplica aquí: un usuario con contraseña antigua debe poder entrar y repetir la política permitiría deducirla.
- **PreHandler** (`src/interfaces/http/auth.ts`): exige `Authorization: Bearer <token>`, verifica el JWT y deja el contenido en `request.usuarioAutenticado`; `exigirRol(ADMIN)` devuelve 403 si el rol no alcanza. Aplicado a `POST /api/operadores/:id/reinvitar`; el registro sigue público.
- **Decisión:** cuenta no activa → **403** (no 401) para que el dueño de las credenciales sepa que debe activar; un atacante sin contraseña sólo ve 401.

**Evidencia ejecutada**

- `npm test` → **117/117** (81 unitarios + 33 HTTP + 3 de integración), 0 fallos.
  - `tests/unit/LoginUsuario.test.ts` (8): éxito con token, normalización del email, email inexistente con comparación señuelo, contraseña incorrecta, PENDIENTE, SUSPENDIDO, contraseña incorrecta sobre cuenta suspendida y ausencia de token en los fallos.
  - `tests/unit/JwtService.test.ts` (8): configuración y valores por defecto, secreto corto, ida y vuelta de la firma, token manipulado, otro secreto, token expirado y rol desconocido.
  - `tests/http/auth.test.ts` (10): login 200 con JWT real de tres segmentos, normalización, 401, **401 idéntico para email inexistente**, 403 PENDIENTE y 400 de esquema; reinvitación 401 sin token, 401 con token inválido, 200 con el token ADMIN emitido por el login y 403 con token de OPERADOR.
  - `tests/http/operadores.test.ts` (+3): 401 sin header, 401 con token inválido y 403 por rol.
- `npm run build` → `tsc` sin errores.
- **E2E contra PostgreSQL real** (puerto 3135, JWT HS256 real):
  - `JWT_SECRET` vacío → `[admin-api] JWT_SECRET no está definida…`, salida 1.
  - Login ADMIN → 200, JWT de tres segmentos, `rol=ADMIN`, sin hash ni contraseña en el cuerpo.
  - Contraseña incorrecta y email inexistente → 401 con el **mismo** cuerpo.
  - Usuario SUSPENDIDO con contraseña correcta → 403.
  - Reinvitar sin token → 401 y el operador PENDIENTE quedó **sin** token en la base.
  - Reinvitar con JWT de OPERADOR → 403; el token del operador PENDIENTE siguió vacío.
  - Reinvitar con JWT de ADMIN → 200; el token impreso por `EmailConsola` coincide con el persistido (`PENDIENTE`, expiración +24 h). Filas de prueba eliminadas.

**Riesgos abiertos**

- No hay *refresh token* ni revocación: el token de una cuenta suspendida sigue siendo válido hasta expirar (1 h). Mitigación: vigencia corta y autorización por rol en cada petición.
- `POST /api/operadores` (registro) sigue sin autenticación; sólo lo protege el rate limit.
- No existe endpoint de activación: el enlace del correo aún no puede consumirse (RF-07 de la matriz).
- El rate limit usa la IP del socket; detrás de un proxy hay que configurar `trustProxy` o todos los clientes comparten el mismo cubo.
- Sin pruebas de allowlist CORS (heredado).

> **Nota de nomenclatura.** El sprint llamó "RF-07" al login; la matriz numeró RF-07 como *activación* y no tiene RF propio para el login. Para no falsear la trazabilidad, la matriz marca RF-07 como **Parcial** (login hecho, activación pendiente), RF-05/RF-08 como parciales por la expiración y el bloqueo de cuentas inactivas, y RF-32 (RBAC) como parcial. Si el equipo renumera RF-07 como "autenticación", el estado pasa a Implementado sin cambios de código.

## Hashing con Argon2id (2026-10-27)

- **Puerto:** `src/domain/ports/PasswordHasher.ts` con `hash(password)` y `compare(password, hash)`. El dominio no conoce Argon2.
- **Adaptador:** `src/infrastructure/security/Argon2Hasher.ts` sobre `argon2@0.45.1`, con Argon2id y parámetros OWASP explícitos (`memoryCost 65536`, `timeCost 3`, `parallelism 4`). `compare` devuelve `false` ante un hash malformado en lugar de lanzar: un fallo de formato no puede convertirse en una autenticación exitosa.
- **Caso de uso:** `RegistrarOperador` recibe `PasswordHasher` y un DTO `{ email, password }`; valida el email con `Usuario.validarEmail` **antes** de hashear (un email inválido no debe gastar 64 MiB de Argon2) y hashea después del chequeo de duplicados. La contraseña en claro nunca se guarda ni se registra.
- **Entidad:** `Usuario.validarEmail` se extrajo de `crear` para reutilizar la misma validación sin duplicar la regex.
- **Pruebas:** `tests/unit/HasherPassword.test.ts` (6) — prefijo `$argon2id$`, ausencia del texto plano, `compare` correcto/incorrecto, sal distinta en cada hash, parámetros en el hash; `tests/unit/RegistrarOperador.test.ts` (7) — hashing único, texto plano nunca persistido, duplicado sin gastar Argon2, fallo del hasher sin persistir.

**Evidencia ejecutada**

- `npm test` → **33/33** (23 unitarios + 4 HTTP + 3 de integración contra PostgreSQL).
- `npm run build` → `tsc` sin errores.
- `import('argon2')` en Node 24.22.1 → `OK $argon2id$v=19$m=65536,p=4,t=3` (binding precompilado; el *install script* quedó bloqueado por `allowScripts` de npm y **no** hizo falta).

**Pendiente de este bloqueante**

- Flujo de activación (consumir el token de invitación y pasar a ACTIVO): `compare` ya lo consume el login (2026-10-27), pero la activación sigue pendiente (RF-07 de la matriz).

## Política de contraseñas (RF-06) — 2026-10-27

- **`src/domain/value-objects/PoliticaPassword.ts`**: `validar(password): void` con 12–128 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial (Unicode: `Ñ`, `á` y otros alfabetos cuentan), y rechazo de 100 contraseñas comunes comparadas en minúsculas.
- **Dónde se valida:** en `RegistrarOperador.ejecutar`, **antes** del chequeo de duplicados y del hasher. No se puso en `Usuario.crear` porque la entidad recibe un hash, no la contraseña: validar complejidad allí es imposible sin romper la regla de que el dominio nunca ve texto plano.
- **Conteo de longitud por puntos de código** (`Array.from`), no por unidades UTF-16: un emoji ocupa 2 unidades pero es 1 carácter y no debe contar doble.
- **Efecto buscado:** una contraseña débil no gasta 64 MiB de Argon2 ni llega a la base; hay pruebas que lo verifican contando invocaciones del hasher.

**Evidencia**

- `npm test` → **53/53** (46 unitarios + 4 HTTP + 3 de integración), 0 fallos.
- `tests/unit/PoliticaPassword.test.ts`: 18 casos (válidas, bordes 11/12/128/129, cada categoría, lista de comunes y variante de mayúsculas).
- `tests/unit/RegistrarOperador.test.ts`: 9 casos, incluidos "contraseña inválida sin hashear" y "contraseña común aunque cumpla complejidad".

## Trazabilidad RF → HU cerrada (2026-10-27)

Los cuatro requerimientos que la matriz marcaba como "Falta historia" ya tienen historia y criterios de aceptación:

| RF | Historia nueva | Qué cubre |
| :--- | :--- | :--- |
| RF-09 | **HU-27** | Panel del cliente con reserva o check-in activo, y los estados vacío, en curso y expirado |
| RF-17 | **HU-29** | Recalculo por uso real y abono como crédito, incluido el excedente y la fracción mínima |
| RF-21 | **HU-28** | Historial paginado con desglose económico y reembolsos |
| RF-26 | **HU-30** | Dashboard de ocupación del operador con alertas de sobretiempo y actualización ≤ 500 ms |

- Resultado: **32 de 32 RF con historia**; el backlog pasa de 26 a **30 historias**.
- **No cierra:** los 4 RF sin caso de uso (RF-09, RF-21, RF-31, RF-32), los 3 con CU parcial (RF-13, RF-20, RF-26) y las 3 historias sin RF (HU-03, HU-16, HU-26). La matriz sigue declarándolos en §4.
- **Evidencia:** `docs/docs/formativo/05-historias-usuario.md` (HU-27…HU-30 con criterios), `docs/docs/formativo/07-matriz-trazabilidad.md` §4 ("RF sin historia: Ninguno") y la página publicada en producción.

## Cambio de Alcance (2026-10-27): App del Cliente híbrida mobile-first y web

El negocio pidió que la App del Cliente (conductores) deje de plantearse como app sólo móvil. La decisión es una **PWA *mobile-first*** con un único código fuente: se instala desde el navegador en el celular (sin tiendas en esta fase) y se usa directamente en el navegador de escritorio, con la misma sesión.

| Documento | Qué cambió |
| :--- | :--- |
| `formativo/03-alcance-requerimientos.md` | Casilla del alcance "App del Cliente multiplataforma"; §2.2 define plataforma, entornos soportados (iOS 16.4+/Android Chrome 110+, navegadores de escritorio), sesión única y una tabla de aclaraciones por RF (RF-09/10, RF-13/19, RF-15, RF-18, RF-20/21, RF-22). Añade cómo funcionarán las notificaciones (Web Push + correo) sin crear un RF nuevo |
| `formativo/05-historias-usuario.md` | **HU-26** en la Épica 4 (acceso a la cuenta y QR desde computador o celular) con criterios de aceptación en ambos entornos; criterio transversal en la Épica 3 (mapa, filtros y QR no dependen de sensores) |
| `formativo/07-matriz-trazabilidad.md` | Rango de historias `HU-01…HU-26`; HU-26 declarada transversal y registrada como hueco (historia sin RF propio) |
| `tecnico/arquitectura-hexagonal.md` | §6 nueva: `web-cliente` como PWA Next.js/React *mobile-first*, manifest + service worker, sin APIs exclusivas de móvil, sesión con cookie `httpOnly`, alcance offline limitado al *shell*; `web-operador` y `web-admin` con prioridad escritorio. §4 actualizada con la estructura real (la capa HTTP ya existe) |
| `tecnico/referencia/guia-diseno-ui.md` | §3 nueva: "Diseño Responsivo y Mobile-First" con puntos de corte (360 / 640 / 1024 px), área de toque de 44 px en cualquier dispositivo, prohibición de interacciones sólo-*hover*, tipografía fluida, formularios y QR imprimible; tabla de principios HIG aplicados a móvil y escritorio |
| `tecnico/guia-diseno-ui.md` | El área táctil de 44 px deja de estar limitada a móvil; enlaza a la nueva sección |

**Consecuencias técnicas**

- El backend ya está preparado: CORS por allowlist (`CORS_ORIGINS`) y cookies; el QR se entrega como token y lo dibuja el frontend, para que sirva a la PWA, al dashboard del operador y a la impresión.
- No hay código de frontend todavía. El primer entregable de `web-cliente` debe nacer con `manifest.webmanifest`, *service worker* y layout de una columna antes de la versión de escritorio.
- **Pendiente de decisión:** sigue sin existir un RF de notificaciones; la documentación describe el canal (Web Push + correo) pero no un requerimiento numerado con criterio de aceptación.
- **Pendiente de decisión:** registrar la elección Next.js vs React + Vite en un ADR cuando se cree el módulo (hoy la doc admite ambas).

## Backlog del Administrador (2026-10-28)

Se expandió la **Épica 6: Administrador (LOCIFY) — Operación del SaaS** porque el rol dueño de la plataforma
tenía apenas HU-04, HU-07 y HU-22…HU-24 en el backlog. Dos commits: `5745221` (historias) y el de esta
sincronización, en la rama `docs/hu-admin` que se integró a `main`.

### Historias de Usuario (HU-A05…HU-A11)

Las siete historias viven en `docs/docs/formativo/05-historias-usuario.md` con prioridad, estimación y tres
escenarios Gherkin cada una. `HU-A11` (reinvitación) ya está implementada; las otras seis no.

| Historia | Tema | RF/CU |
| :--- | :--- | :--- |
| HU-A05 | Minutos de gracia y tarifas desde panel | RF-31 / CU-11 |
| HU-A06 | RBAC para el equipo de soporte | RF-32 / CU-12 |
| HU-A07 | Línea de tiempo de reserva y reembolsos | RF-30 / CU-13 |
| HU-A08 | Suspensión de operadores (moderación) | **RF-33** / CU-14 |
| HU-A09 | Log de auditoría inmutable | RNF-02 / CU-15 |
| HU-A10 | Métricas globales agregadas | **RF-34** / *(sin CU)* |
| HU-A11 | Reenvío de invitación | RF-04 / CU-16 (implementado) |

### Sincronización de la documentación

- **RF-33 y RF-34 (`03-alcance-requerimientos.md` §2.4):** al redactar las historias quedó claro que la
  moderación de operadores y las métricas globales **no tenían RF propio**; se adicionaron con nota de origen.
  El total pasa de 32 a **34 RF**, y CA-02/CA-04 de la matriz en ese documento los incluyen.
- **CU-11 a CU-16 (`04-casos-uso.md`):** flujo principal, precondiciones, escenarios alternativos y estado
  honesto en el código. El diagrama Mermaid suma al **Soporte** como actor (A5) y dependencias
  (`CU-11 -.-> CU-9`, `CU-16 -.-> CU-1`, `CU-13 -.-> A4`).
- **Matriz (`07-matriz-trazabilidad.md`):** cubre 34/34 RF; CU-11/CU-12 vinculados a RF-31/RF-32,
  CU-13 a RF-30, y las filas nuevas de RF-33/RF-34. Los huecos se ajustaron: ya no existen
  "RF sin CU" por RF-31/RF-32 ni "historia sin RF" por HU-A08/HU-A10; restan RF-09, RF-21 y RF-34 sin CU.
- **Verificación:** `npm run build` en `docs/` → verde (cliente y servidor compilados, sin enlaces rotos).

## Identidad visual — Logo LOCIFY (2026-10-28)

**Estado: conceptos entregados y recomendación construida; pendiente de aprobación.** No integrar en la UI.

- **Skill:** `brand-identity` (instalada desde `Esi-Abolfazl/skills` con `npx skills add`; evaluación
  Socket 0 alerts / Snyk Low). Live en `.agents/skills/brand-identity/` y fijada en `skills-lock.json`.
- **Proceso (según la skill):** brief de 9 preguntas (fuente: brief del usuario + proyecto; suposiciones
  marcadas) → posicionamiento → barrido de clichés del sector → 14 ideas de divergencia → 3 conceptos
  en 3 direcciones → recomendación con racional → construcción del recomendado → **validación visual por
  render** (16/32/48 px, claro y oscuro) → board autocontenido + spec.
- **Pipeline técnico:** wordmark delineado desde **Poppins SemiBold (SIL OFL 1.1)** con
  `uv run --with uharfbuzz --with fonttools` (snippet probado de la skill); composición y rasterizado con
  `resvg-py`; todos los masters SVG son **paths only** (gate automatizado: 0 coincidencias de
  `font-family|<text|<image|href`). Lección de la ronda 1: el anillo con barra diagonal leía como
- **Conceptos** (`conceptos/`): C-1 «Vía libre» (celda con puerta + tick verde que sale por ella),
  C-2 «La celda encendida» (rejilla 2×2 con la celda libre en verde), C-3 «Punto y seguido»
  (wordmark + punto terminal verde).
- **Recomendado y construido:** **C-1 «Vía libre»**. Masters en `svg/` (marca full-color/mono/reverse +
  lockup horizontal full-color/mono/reverse; la marca se escala 1.12× sobre la cap-height en el lockup),
  set de favicon en `png/` (16/32/48/180/192/512, apple-touch incluido) y **hoja-validacion.png**.
- **Entregables para revisión:** `docs/static/img/brand/board-locify.html` (board, sección 1–9),
  `especificacion-logo.md` (colores por rol, clearspace, mínimos, tres no-hacer), `png/` y `svg/`.
- **Flag honesto:** no se pudo verificar colisión de nombre «LOCIFY» (búsqueda web no disponible
  en la sesión); revisar dominio y registro de marca antes de invertir.

### Integración en Docusaurus (2026-10-29 — aprobado e integrado)

El equipo **aprueba** el concepto C-1. Cambios verificados con `npm run build` verde
(cliente + servidor, sin enlaces rotos):

| Asset / config | Qué cambió |
| :--- | :--- |
| `static/img/logo.svg` | Sustituido por el **lockup horizontal full-color** (marca + LOCIFY Poppins delineada); sustituye el logo genérico de Docusaurus |
| `static/img/logo-dark.svg` | Lockup **reverse** (blanco) — el grafito del full-color desaparecería en el navbar oscuro; vía `logo.srcDark` |
| `static/img/favicon.ico` | Regenerado **multi-tamaño** (16/32/48) con Pillow desde el master 512 |
| `static/img/favicon-16/32.png`, `apple-touch-icon.png`, `android-chrome-192/512.png` | Set moderno de favicons copiado desde `brand/png/` |
| `static/img/social-card.png` | **Nueva tarjeta social 1200 × 630** (marca sola sobre Azul Profundo); sustituye a `docusaurus-social-card.jpg` (eliminada) |
| `docusaurus.config.ts` | `themeConfig.image → img/social-card.png`; navbar sin `title` (el lockup ya trae el nombre) y `logo.src/srcDark`; `headTags` con los `<link>` de la familia de favicons |
| `tecnico/referencia/guia-diseno-ui.md` | Nueva **§5 Logotipo Oficial**: concepto, colores por rol, Poppins OFL, clearspace, mínimos y las tres «no hacer»; enlaza (por ruta, no como página del sitio) a `especificacion-logo.md` |
| `brand/especificacion-logo.md` + `board-locify.html` | Estado actualizado a **aprobado 2026-10-29** |

Lección de build: Docusaurus rechaza enlaces Markdown a archivos fuera del plugin de docs
(`static/**`), se referencian como rutas de código.

## Auditoría de Seguridad y Docs del backend (2026-10-29)

Auditoría en dos fases sobre `services/admin-api`: (1) docs vs código con el código
como fuente de verdad, (2) ataque ofensivo Red Team escrito primero como pruebas
fallidas (TDD) y luego parcheo.

### Incongruencias docs ↔ código corregidas

| Doc | Problema | Corrección |
| :--- | :--- | :--- |
| `07-matriz-trazabilidad.md` §3 | La tabla de Criterios de Aceptación omitía RF-33 (CA-02) y RF-34 (CA-04), que el SRS (03 §4) sí lista — la propia doc exige replicar los cambios | RF-33 añadido a CA-02 y RF-34 a CA-04 |
| `03-alcance-requerimientos.md` §2.2 | La sesión se describía como "cookie `httpOnly` emitida por el backend"; ningún servicio emite cookies. El mecanismo real es JWT Bearer por `Authorization` (1 h) | Párrafo reescrito + nota de corrección honesta |
| `modelo-datos.md` ER + diccionario | `USUARIO.id` dibujado como `uuid`; la BD real lo materializa como `text` (UUID v4 dentro), verificado con `\d usuario` | ER y fila del diccionario corregidos |
| `modelo-datos.md` ER | `token_invitacion` / `token_expiracion` dibujados como obligatorios; en `contract.prisma` y la BD son `NULL`-ables | Marcados opcionales en ER y diccionario (campo nuevo en la §2.1) |
| `07-matriz-trazabilidad.md` | El endpoint `GET /health` (200/503) no aparece en ningún doc | Añadido en la nota de auditoría (observabilidad, no RF) |

Verificado y correcto sin cambio: `rol`/`estado` = `text` + `CHECK` (afirmación
verificada contra la BD viva), `email` = `text` sin límite, todas las filas
"Implementado/Parcial" de RF-01 a RF-08 y RF-32.

### Seguridad: 17 ataques (AN-A1…AN-E1) en `tests/http/seguridad.test.ts`

| Ataque | Resultado |
| :--- | :--- |
| **AN-A1** JWT con `alg: none` | ✅ contenido — 401 (jose fija `algorithms: ['HS256']`) |
| **AN-A2** Token firmado con secreto ajeno | ✅ 401 |
| **AN-A3** Token expirado con firma válida | ✅ 401 |
| **AN-A4** Token con emisor o audiencia ajenos | ✅ 401 |
| **AN-A5** Payload alterado conservando la firma | ✅ 401 |
| **AN-A6** Token sin `sub` | ✅ 401 (verificación de claims a mano) |
| **AN-B1** Email como objeto de inyección (`{"$gt":""}`) | ✅ 400 (`coerceTypes: false`) |
| **AN-B2** Inyección SQL en email | ✅ 401 genérico, sin detalles (Prisma parametriza; honeypot de Argon2 anti-enumeración) |
| **AN-B3** **Cuerpo gigante (40 KiB)** | ⚠️ **hallazgo real** — Fastify aceptaba 1 MiB por defecto y llegaba al parser/validación → **corregido: `bodyLimit: 32 KiB`, el ataque ahora da 413** |
| **AN-C1** Fuerza bruta login | ✅ 429 en el 6.º intento del minuto |
| **AN-C2** Rotación de `X-Forwarded-For` para evadir el límite | ✅ no evadió (sin `trustProxy` la llave es la IP del par TCP) |
| **AN-C3** `/health` drena la cuota global | ✅ no (exenta con `rateLimit: false`) |
| **AN-D1** `X-Powered-By` filtrado | ✅ no se expone |
| **AN-D2** Cabeceras helmet | ✅ CSP + `nosniff` + `frame-ancestors` + CORP presentes |
| **AN-D3** CORS con Origin foráneo sin `CORS_ORIGINS` | ✅ cerrado (sin `access-control-allow-origin`) |
| **AN-D4** `trustProxy: true` tras proxy propio | ✅ la cuota pasa a la IP real del cliente (opción **nueva**: `TRUST_PROXY` en `.env.example`; por defecto `false`) |
| **AN-E1** Error interno simulando caída de PostgreSQL | ✅ 500 genérico (`Error interno del servidor.`), sin stack ni detalles de Prisma |

Lo que ya venía bien (evidencia `archivo:línea`): `JWT_SECRET` ≥ 32 chars y falta fatal
(`JwtService.ts:33-49`); `removeAdditional: false` para rechazar props inesperadas con 400
(`server.ts:53-58`); redacción de contraseñas/authorization en logs (`server.ts:63-66`);
honeypot Argon2id con tiempo igual para email inexistente (`LoginUsuario.ts:15-16,52-55`);
rate limit 5/min en login y 10/min en registro (`routes/auth.ts:82`,
`routes/operadores.ts:90`); password máx 128 antes de Argon2 (`routes/auth.ts:33`,
`routes/operadores.ts:42`).

### Riesgos residuales (declarados, no parcheados)

1. Sin revocación de JWT: un token sigue válido hasta su expiración aunque la
   cuenta se suspenda después (mitigado por vigencia de 1 h; `LoginUsuario.ts:69-72`).
   Requiere lista de revocación o versiones de token en la base.
2. TLS: no hay terminación HTTPS en el stack local (RNF-01 "Parcial" en la matriz).
   Debe resolverse en el proxy de producción; `TRUST_PROXY` ya está previsto.
3. La cuota global de 100 req/min se comparte por IP: tras poner el servicio
   detrás de un proxy sin `TRUST_PROXY=true`, todos los clientes comparten la
   cuota (todos los clientes del proxy comparten 100/min y un solo atacante
   puede agotarla) — documentado en `.env.example`.
4. No hay flujo de recuperación de contraseña — HU-03
   (recuperación de contraseña) sigue sin implementación (hueco histórico ya
   declarado en la matriz §4).

### Verificación de la pasada

- `npm test` en `services/admin-api`: **134/134 verde** (117 previas + 17 de seguridad),
  incluida la integración real contra PostgreSQL (`docker start locify-admin-db`).
- `npm run build` (tsc): verde.

## Frontend del cliente — `apps/web-cliente` (2026-10-29)

```
npx create-next-app@latest apps/web-cliente --typescript --tailwind --eslint
  --app --src-dir --import-alias "@/*" --use-npm --yes
```

Next.js **16.4.3** + React 19 + **Tailwind v4** dentro del monorepo npm ya
existente (`package.json` raíz = `locify-monorepo` con `workspaces: [services/*,
apps/*, packages/*]`: las dependencias se hoistean a la raíz).

| Pieza | Qué se hizo |
| :--- | :--- |
| Tokens de color | **Tailwind v4 es CSS-first**: `tailwind.config.ts` ya no aplica (obsoleto sin `@config`); los tokens viven en `@theme` de `src/app/globals.css` → `bg-acero` `#2F5D9F`, `text-grafito` `#1F2937`, `verde-esmeralda` `#00C853` (solo estado), `bg-fondo` `#F4F6F8` |
| Tipografía | **Poppins** (400/500/600, SIL OFL) con `next/font/google` en `layout.tsx`, expuesta como `--font-poppins` y conectada al token `--font-sans` |
| Logos | `logo.svg`, `logo-dark.svg`, `favicon.ico`, `favicon-16/32`, `apple-touch-icon`, `android-chrome-192/512` y `social-card.png` copiados a `public/`; los SVG genéricos del scaffold se eliminaron |
| Metadata | `lang="es"`; título + descripción del producto; `icons` apuntando al set de favicon |
| Hero | `src/app/page.tsx`: logo lockup (`next/image` con `unoptimized` para SVG), titular «Encuentra tu parqueadero en segundos», subtítulo y dos CTAs (Buscar parqueadero / Iniciar sesión, enlaces placeholder hasta crear las rutas) |

**Verificación:** `next build` verde (2 rutas estáticas), `eslint` 0 problemas, y
screenshot-equivalente computado contra `next start`: fuente computada Poppins,
fondo `rgb(244,246,248)`, texto `rgb(31,41,55)`, botón primario `rgb(47,93,159)`,
logo cargado (`naturalWidth 542`), `favicon.ico` servido.

**Notas de entorno:** el servidor de consumo HTTP del backend aún no está
conectado; los CTAs son `#buscar`/`#iniciar-sesion` a la espera de las rutas
reales. El modo oscuro está desactivado deliberadamente (la marca se diseña en
claro, §5 de la guía de diseño).

### Login + PWA (2026-10-29)

| Pieza | Qué hizo |
| :--- | :--- |
| `src/lib/api.ts` | Cliente del `admin-api` en el navegador: `login()` contra `${NEXT_PUBLIC_API_URL:-http://localhost:3000}/api/auth/login` con traducción de errores (400/401/403/429 → mensajes accionables, 0 = backend caído) y helpers de sesión en localStorage (`guardar/obtener/cerrar`) |
| `src/app/iniciar-sesion/page.tsx` | Formulario Email + Contraseña (tokens de marca, `aria-live` con `role=alert`, botón con estado «Ingresando…», `autoComplete`) |
| `src/app/dashboard/page.tsx` | Placeholder: lee la sesión con `useSyncExternalStore` (regla `react-hooks/set-state-in-effect` de React/Next 16 prohíbe `setState` directo en efectos), guard → login si no hay sesión, botón de cierre |
| `src/app/manifest.ts` | PWA `standalone` con nombre corto, fondo `#F4F6F8`, `theme_color` `#2F5D9F` e iconos 192/512; Next 16 expone `/manifest.webmanifest` y enlaza el `<link rel="manifest">` automáticamente |
| `layout.tsx` | `viewport.themeColor = #2F5D9F` (patrón `Viewport`, separado de `metadata`) |
| Puertas | `.env.example` con `NEXT_PUBLIC_API_URL=http://localhost:3001` (front 3000 / admin-api 3001; `CORS_ORIGINS=http://localhost:3000` del lado del backend) |

**Validación E2E real** (web de producción `next start` en 3000 + admin-api dev en 3001,
con un operador creado por `POST /api/operadores` y promocionado a ACTIVO por SQL):

| Caso | Resultado |
| :--- | :--- |
| Contraseña incorrecta | **401** → «Email o contraseña incorrectos.» en pantalla |
| Cuenta PENDIENTE | **403** → «Tu cuenta no está activa. Actívala desde la invitación…» |
| Cuenta ACTIVA | **200** → token JWT en `localStorage`, redirect a `/dashboard` con email + rol OPERADOR, badge «Sesión activa» |
| Cerrar sesión | localStorage vacío + redirect al login |
| Guard del dashboard sin sesión | redirect a `/iniciar-sesion` |
| PWA | `<link rel=manifest>` en `<head>`, `theme-color #2F5D9F`, manifiesto servido con los campos correctos |

Pendiente registrado: cookie **httpOnly** (hoy localStorage; §2.2 del SRS exige
cookie) y Service Worker/offline (RNF-08), para el sprint de seguridad.

### Mapa `/buscar` — RF-11 (2026-10-29)

Stack: **MapLibre GL JS 6.16** (BSD-3-Clause, MapLibre Foundation; tipos
TypeScript incluidos — `@types/maplibre-gl` está deprecado y NO se instaló) sobre
**OpenFreeMap** (tiles vectoriales sin API key, estilo `liberty`).

| Pieza | Qué hizo |
| :--- | :--- |
| `src/lib/mockSedes.ts` | 5 sedes mock de Medellín (id, nombre, dirección, lat/lng, precio COP, disponibles/total). Se reemplaza por `GET /api/sedes` del futuro `operador-api` (RF-25) manteniendo la forma |
| `src/components/MapaParqueaderos.tsx` | Client component: mapa centrado en Medellín `[-75.5636, 6.2442]` zoom 13, controles navegación + escala, marcadores custom (pin circular **Verde Esmeralda `#00C853`** con check blanco = celdas disponibles; **gris** = lleno; uso legítimo del color de estado de la marca), popup con nombre/dirección/precio format `Intl COP`/celdas + botón «Reservar» placeholder |
| Búsqueda flotante | Estilo Google Maps; geocodificación real vía **Nominatim** (OSM, sin key) → `flyTo` zoom 16; estados «Buscando…», «Sin resultados», error de red |
| Geolocalización | Botón flotante; `navigator.geolocation` → `flyTo` zoom 15; manejo de `PERMISSION_DENIED` y navegador sin soporte |

**Validación en navegador** (`next start` de producción):

| Caso | Resultado |
| :--- | :--- |
| Carga del mapa | canvas Web GL vivo, overlay «Cargando…» desaparece tras `load` |
| Marcadores | 5 renderizados; 4 verdes `rgb(0,200,83)` + 1 gris (Centro, 0 disponibles); `aria-label` con nombre y disponibilidad |
| Popup | nombre, dirección, `$ 4.500 /hora`, «12 de 30 celdas disponibles», botón Reservar |
| Búsqueda | «Parque Berrío, Medellín» → mensaje «Parque Berrío» + `flyTo` real |

Pendiente registrado: consumidores del `operador-api` (RF-25) para sedes reales;
cierre de sesión de RNF-08 (offline) aplica también al mapa.

## Plan del Próximo Sprint (bloqueantes de producción)

- **Objetivo:** que `admin-api` atienda peticiones HTTP reales, guarde contraseñas hasheadas y envíe la invitación por correo.
- **Duración sugerida:** 2 semanas.
- **Orden:** 0 → 1 → 2 → 3. El paso 0 es común; los bloqueantes 2 y 3 son paralelizables entre dos personas; el bloqueante 1 integra a los otros dos al final.

### Paso 0 — Base común (1 día, antes de los tres bloqueantes)

1. `src/config/env.ts`: validar el entorno al arrancar con un validador propio (≈30 líneas, sin dependencia nueva): `PORT` numérico (3000 por defecto), `NODE_ENV` (`development`/`test`/`production`), `DATABASE_URL` obligatoria, `CORS_ORIGINS` (lista separada por comas), `EMAIL_DRIVER` (`console`/`smtp`) y, si `EMAIL_DRIVER=smtp`, las cinco `SMTP_*`. Si falta una obligatoria, el proceso termina con un mensaje que nombre la variable.
2. `tests/unit/env.test.ts`: falta `DATABASE_URL` → error con su nombre; `PORT=abc` → error; `EMAIL_DRIVER=smtp` sin `SMTP_HOST` → error.
3. Añadir `tests/http/*.test.ts` al script `test` de `package.json` y crear `"test:http": "node --import tsx --test tests/http/*.test.ts"`.

**Criterio de aceptación:** `npm run test:unit` verde y `npm start` sin `.env` falla indicando la variable faltante.

### Bloqueante 1 — Capa HTTP (5–6 días)

**Estado: cerrado el 2026-10-27.** `GET /health`, `POST /api/operadores`, mapeo de errores y composition root implementados y verificados; ver "Registro de operadores por HTTP". Dos desviaciones: el composition root vive en `src/index.ts` (no en `src/composition.ts`, por indicación del alcance) y el logger con `redact` ya estaba en `buildServer`. Pendientes de este bloqueante: autenticación/RBAC y pruebas de allowlist CORS.

**Decisión a registrar en `ADR-004`:** Fastify 5 (validación por JSON Schema, sin decoradores). Alternativa si el equipo prefiere lo conocido: Express + `zod`.

1. `npm i fastify @fastify/helmet @fastify/cors @fastify/rate-limit` (esto es la dependencia de runtime que exige aprobación del equipo; queda cubierta por el ADR-004).
2. **Prueba primero** `tests/http/health.test.ts`: `const app = await buildServer(deps); const res = await app.inject({ method: 'GET', url: '/health' });` con `assert.equal(res.statusCode, 200)`. Correr `npm run test:http` y confirmar que falla por módulo inexistente.
3. `src/interfaces/http/server.ts`: `buildServer(deps: Dependencias): FastifyInstance`, **sin** `listen` (para poder probar con `inject`). Registrar `helmet`, `cors` con la allowlist de `CORS_ORIGINS`, `rateLimit` global 100 req/min por IP y 10 req/min en `/api/operadores`. Logger con `redact: ['req.body.password', 'req.headers.authorization']`.
4. `src/interfaces/http/errores.ts`: `setErrorHandler` que traduce `ErrorValidacion → 400`, `EmailDuplicado → 409`, `ErrorEnvioCorreo → 502` y el resto → 500 sin filtrar `stack` ni detalles de Prisma.
5. `src/interfaces/http/routes/health.ts`: `GET /health` ejecuta `SELECT 1` y responde `{ status: 'ok', db: 'up' }`; 503 si la base no responde.
6. `src/interfaces/http/routes/operadores.ts`: `POST /api/operadores` con schema `{ email, password }`, `additionalProperties: false`; responde `201 { id }` (nunca el hash ni el token).
7. `src/composition.ts`: único lugar que instancia adaptadores (`PostgresUsuarioRepository`, hasher, correo, `CryptoGeneradorId`, `RelojSistema`) y arma `AdminService`. `src/index.ts` solo llama `buildServer`, `listen` y cierra con `SIGTERM`.
8. `tests/http/operadores.test.ts`: 201 válido, 400 email inválido, 400 campo extra, 409 duplicado, 429 al superar el límite, y que la respuesta no contenga `password_hash`.

**Criterio de aceptación:** `npm test` verde sin abrir puertos; `npm start` + `curl -X POST /api/operadores` → 201 y en la base solo hay un hash; `/health` → 200; `curl` con email inválido → 400.

### Bloqueante 2 — Hashing (2–3 días, paralelizable)

**Estado: cerrado el 2026-10-27.** Ver "Hashing con Argon2id" más arriba para la evidencia. Queda pendiente la política de complejidad (RF-06), que este bloqueante no cubría.

1. *Spike* de 30 min: `npm i argon2` en Node 24 / Windows. Si no hay binario precompilado, usar `bcryptjs` (JS puro) y registrar el cambio de algoritmo en el ADR-004.
2. `src/domain/ports/PasswordHasher.ts`: `hashear(password: string): Promise<string>` y `verificar(hash: string, password: string): Promise<boolean>`.
3. `src/domain/services/PoliticaPassword.ts`: 12–128 caracteres, al menos una mayúscula, una minúscula, un dígito y un símbolo; rechaza las 1000 contraseñas más comunes (`politica-passwords-comunes.ts`).
4. `src/infrastructure/security/Argon2PasswordHasher.ts`: Argon2id con `memoryCost 19456` KiB, `timeCost 2`, `parallelism 1` (recomendación OWASP).
5. Cambiar `RegistrarOperadorDTO` a `{ email, password }` y hashear dentro del caso de uso; `Usuario.crear` sigue exigiendo formato de hash (BCrypt/Argon2), lo que impide guardar texto plano incluso si alguien se salta el caso de uso.
6. Pruebas: el valor guardado no es la contraseña, empieza por `$argon2id$`, `verificar` acepta la correcta y rechaza la incorrecta; tabla de casos límite de la política.

**Criterio de aceptación:** `npm test` verde; ninguna respuesta ni log contiene la contraseña; un usuario registrado se valida con `verificar`.

### Bloqueante 3 — Adaptador de correo (2 días, paralelizable)

**Estado: cerrado el 2026-10-27.** `EmailConsola`, `SmtpEmailService` con timeouts de 10 s, plantilla HTML/texto y `POST /api/operadores/:id/reinvitar` implementados y probados; ver "Correo SMTP y reinvitación". Desviaciones: el adaptador vive en `src/infrastructure/notifications/` (no en `email/`) y la plantilla en `notifications/plantillas/`. Queda pendiente el criterio de aceptación contra un proveedor real.

1. `npm i nodemailer` + `npm i -D @types/nodemailer`.
2. `src/infrastructure/email/EmailConsola.ts` para desarrollo (`EMAIL_DRIVER=console`): imprime el enlace y no falla si no hay SMTP.
3. `src/infrastructure/email/SmtpEmailService.ts`: `connectionTimeout` y `socketTimeout` de 10 s, `FROM` obligatorio, credenciales desde `env.ts` (nunca en el repositorio).
4. `src/infrastructure/email/plantillas/invitacion.ts`: HTML + texto plano con el token y la caducidad de 24 h; el token no se escribe en logs de producción.
5. Mitigación del doble fallo (el outbox completo queda para el sprint siguiente): `POST /api/operadores/:id/reinvitar` regenera token y reenvía; si el correo falla, el registro ya confirmado responde `502` con "usuario creado, invitación no enviada" y el operador queda `PENDIENTE`.
6. Pruebas: el adaptador de consola registra el token; un fallo SMTP produce `502` y no revierte el usuario; reinvitar cambia el token y la expiración.

**Criterio de aceptación:** registro completo contra Mailtrap (o SMTP real) con el correo recibido y el enlace funcionando; `npm test` verde usando el doble de consola.

### Fuera de este sprint

- Outbox transaccional con reintentos y *backoff* (sprint siguiente, con ADR de mensajería).
- Login, JWT y RBAC: **implementados el 2026-10-27** (ver "Autenticación JWT y RBAC").
- Activación de la cuenta: consumir el token de invitación y pasar a ACTIVO (RF-07 de la matriz; el login ya está hecho).
- CI con PostgreSQL de servicio, cobertura (`c8`) y `verify.sh`: se abordan en el sprint de infraestructura.

### Definición de hecho del sprint

- [x] `npm run build` y `npm test` verdes en local. (`npm test` → 88/88)
- [x] `npm start` deja `/health` en 200 contra la base real.
- [x] Registro por HTTP → 201, solo hash en la base e invitación generada (consola en local; `SmtpEmailService` implementado, **sin validar contra un proveedor real**).
- [x] Reinvitación → 200 con token nuevo persistido y correo reenviado; 404/400/502 según el caso.
- [x] `.env.example` actualizado y ningún secreto en el repositorio.
- [x] `PROJECT_STATE.md` con la evidencia de cada bloqueante cerrado.

## Documentación Web (Docusaurus + Vercel)

**URL de publicación:** https://locify-wheat.vercel.app

### Estado del despliegue (2026-10-27)

- **Producción sirviendo el commit `b2b160d`** (`main` sincronizado con `origin/main`).
- **Verificado sobre el sitio publicado, no sobre el build local:**
  - `GET /docs/formativo/matriz-trazabilidad` → rango `HU-01…HU-30` y la fila "RF sin historia de usuario: **Ninguno (32 de 32 cubiertos)**".
  - `GET /docs/formativo/historias-usuario` → HU-26, HU-27, HU-28, HU-29 y HU-30, con los criterios de aceptación de cada una.
- **Comportamiento observado:** tras el `git push`, el primer `GET` devolvió la versión anterior durante ~1 minuto (build de Vercel en curso); el siguiente ya sirvió el commit nuevo. No hay caché agresiva en las rutas de documentación.
- **Assets:** `HEAD /` → 200, `HEAD /img/logo.svg` → 200, `HEAD /img/favicon.ico` → 200. La raíz `/favicon.ico` devuelve 404 a propósito: `docusaurus.config.ts` declara `img/favicon.ico`, y el HTML apunta a esa ruta.

### Infraestructura
- `url` y `baseUrl` corregidos en `docs/docusaurus.config.ts` (`/Locify/` → `/`), porque Vercel sirve el sitio desde la raíz.
- `favicon` (`img/favicon.ico`) y `logo` del navbar (`img/logo.svg`) en rutas relativas al `baseUrl`.

### Rediseño UI/UX
- `docs/src/css/custom.css` reescrito como sistema de diseño con tokens semánticos: color (texto, superficie, acento, acción, borde, estado), tipografía, radios, sombras y espaciado.
- Paleta LOCIFY aplicada por rol: Azul Acero `#2F5D9F` (acento/acción), Azul Profundo `#244A80` (hover), Azul Muy Claro `#E6EEF8` (tarjetas), Grafito `#1F2937` (texto), Blanco `#FFFFFF` (fondo).
- Tipografía del sistema (`-apple-system`/`SF Pro Text`/`Segoe UI`), jerarquía por roles y lectura con interlineado de 1.75.
- Landing nueva en `docs/src/pages/index.tsx`: hero con título **LOCIFY**, subtítulo, dos CTA ("Documentación SENA" y "Arquitectura Técnica") y tres tarjetas de sección. Sin texto genérico de Docusaurus.
- Accesibilidad verificada con estilos computados en el build de producción: cuerpo 14,68:1 (claro) y 15,82:1 (oscuro); botón primario 6,59:1 / 5,07:1; borde de control 3,42:1 / 3,39:1; `prefers-reduced-motion` respetado.
- Modo oscuro con los mismos roles y contraste equivalente.

### Auditoría de Markdown (`formativo`, `tecnico`, `gestion`)
- 16 archivos auditados: sin enlaces relativos rotos, sin enlaces absolutos `/docs/...`, tablas con columnas consistentes y bloques de código balanceados.
- **Corregido:** `docs/docs/tecnico/arquitectura-hexagonal.md` terminaba con un bloque Mermaid **sin cerrar** (el archivo se cortaba en la línea 57). Se cerró el bloque y se completó el documento con las secciones 3 (regla de dependencia), 4 (estructura real del microservicio) y 5 (verificación por capa).
- 24 bloques Mermaid validados en el repositorio; el diagrama de arquitectura hexagonal renderiza en el navegador (10 nodos y sus aristas).

### Verificación
- `npm run build` en `docs/` → `Generated static files in "build"` (sin enlaces rotos; `onBrokenLinks: 'throw'`).
- Artefacto revisado: la portada generada incluye los CTA y las tres tarjetas, y el CSS emitido contiene los tokens de marca.

### Configuración esperada en Vercel
- **Root Directory:** `docs`
- **Framework Preset:** Docusaurus
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Node.js:** 20 o superior

### Navegación móvil y movimiento
- **Bug corregido:** el drawer móvil es hijo de `<nav class="navbar">`; un `backdrop-filter` en `.navbar` crea un *containing block* y dejaba el menú anclado a los 60 px de la barra. El efecto vidrio se movió a `.navbar::before` (pseudo-elemento, no es ancestro del drawer).
- **Entrada desde la derecha:** `translate3d(100%, 0, 0)` oculto → `translate3d(0, 0, 0)` con `.navbar-sidebar--show`, `right: 0`, ancho `min(86vw, 380px)`, `z-index` sobre backdrop y contenido, sombra y esquina redondeada.
- **Áreas de toque:** hamburguesa 44×44, cierre 44×44, enlaces del drawer `min-height: 44px` con padding vertical de 0.85 rem.
- **Animaciones (framer-motion ^14.7.1 en `docs/package.json`):** hero con fade + desplazamiento; tarjetas escalonadas con `whileInView` (`once`), `whileHover` 1.03 y `whileTap` 0.98. El efecto hover por ratón lo aporta framer-motion; el foco por teclado conserva anillo propio en CSS.
- **Accesibilidad del movimiento:** bloque global `@media (prefers-reduced-motion: reduce)` (`animation`/`transition` a `none`) y `<MotionConfig reducedMotion="user">` para que framer-motion sólo anime opacidad.
- **Evidencia medida en el build de producción:** drawer 380 × 717,6 px anclado al viewport (alto completo, no a la barra), `transform` de `translate(380px)` a `translate(0)` al abrir, enlaces de 49,6 px, tarjetas de `opacity: 0` a `1` al hacer scroll, `backdrop-filter` del `.navbar` = `none` y presente en `::before`.

### Verificación en escritorio (1440 px)
Medido cargando el build dentro de un viewport de 1440 × 900:

| Elemento | Resultado |
|---|---|
| Barra lateral de documentación | 299,2 px, `position: sticky` (`.sidebarViewport`, alto 900 px); el menú sigue visible tras 1200 px de scroll |
| Hueco barra lateral → contenido | 16,8 px |
| Columna de lectura | 811,6 px (75 % de Docusaurus) |
| Índice derecho (TOC) | `sticky`, `top: 76px`, 249,2 px; sigue visible tras 1400 px de scroll |
| Menú hamburguesa / drawer | `display: none` y no se renderiza en escritorio |
| Overflow horizontal | Ninguno (documento 1425 px con scrollbar) |
| Landing | Contenedor de 1320 px centrado, título de 88 px, 3 tarjetas de 416 px con 20 px de separación |

- **Corregido en esta pasada:** el pie de página tomaba `#303846` porque Infima aplica `.footer--dark`, que redefine `--ifm-footer-background-color` en el propio elemento y gana a `:root`. Se fijó el token a nivel de `.footer, .footer--dark` → `#1F2937`, con contraste 9,86:1 en enlaces y 6,64:1 en copyright.
- **Observación (no modificado):** a 1440 px el ancho de lectura ronda las 100 caracteres por línea frente a los 60–75 recomendados. Se dejó el valor de Docusaurus porque la documentación es intensiva en tablas y matrices: estrechar la columna las forzaría a scroll horizontal. Si se decide limitar, basta con `--doc-item-container-width` en `custom.css`.

### Pendiente
- ~~Reemplazar `static/img/docusaurus-social-card.jpg` (imagen social genérica) por una propia de LOCIFY~~ → **Hecho el 2026-10-29:** `static/img/social-card.png` (1200 × 630, marca «Vía libre» sobre Azul Profundo) y la tarjeta genérica fue eliminada.
- `npm install` reportó 23 avisos de `npm audit` en el árbol de `docs` (dependencias transitivas del toolchain); no se aplicó `npm audit fix --force` porque introduce cambios incompatibles.

### Correcciones de tipado y repositorios — 2026-10-30
- **PostgresReservaRepository**: eliminado `orderBy` incompatible; consultas `buscarActivaPorUsuario` y `buscarActivasPorSede` usan literales `'ACTIVA'` para evitar mismatch enum↔string literal.
- **PostgresSedeRepository**: corregida firma de `actualizarEstado` a `where({id}).update({estado})`; se eliminó `estado` del `upsert.update` y se normalizó `listarActivas` a literal `'ACTIVA'`.
- **Stripe**: actualizado `apiVersion` a `2026-10-28.endive` en `StripePaymentGateway` y `StripeWebhook`.
- **Dominio KYB**: `SubirDocumentosKYB` reconstruye `Sede` con campos explícitos en lugar de spread de entidad.
- **Tests**: `SedeRepositoryEnMemoria` actualizado a `listarActivas` para coincidir con el puerto; `npm test` → **140/140** pasando.
- **Frontend**: `npm run build` verde para `apps/web-cliente`.
- **E2E**: configuración Playwright preparada; smoke test verde; errores 500 resueltos al corregir repositorios.

### Landing Page Oficial LOCIFY — 2026-10-30
- Navbar glassmorphism con logo LOCIFY y botones "Soy Conductor" (`/buscar`), "Soy Parqueadero" (`/operador/kyb`), "Iniciar Sesión" (`/iniciar-sesion`).
- Hero con escena 3D interactiva (React Three Fiber), título "El futuro del estacionamiento urbano", subtítulo de valor y CTAs "Buscar Parqueadero" (Verde Esmeralda) y "Digitalizar mi Parqueadero" (Azul Acero).
- Sección "¿Cómo funciona?" con dos tarjetas glassmorphism para Conductores y Operadores, animadas con `whileInView`.
- Footer minimalista con logo y copyright © 2026 LOCIFY.
- Build verde: `npm run build` exitoso en `apps/web-cliente`.
\n- [x] Reingeniería profesional - Lógica de negocio, Roadmap y Diseño Premium (2026-10-31)\n