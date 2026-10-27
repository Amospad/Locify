# Estado del Proyecto LOCIFY

## Fase Actual
- [x] Documentación (SENA y Técnica)
- [x] Publicación de la documentación en Vercel con rediseño UI/UX
- [x] Configuración de Skills (QA, CI/CD, Seguridad, Diseño)
- [x] Auditoría técnica de código, documentación y arquitectura (2026-10-27)
- [x] Ratificación del ADR-003: monolito modular con un esquema por módulo (2026-10-27)
- [x] Capa HTTP mínima: `buildServer()` (sin `listen`) + `GET /health` con Fastify, helmet, CORS y rate limit (2026-10-27)
- [x] Cambio de alcance: App del Cliente como PWA *mobile-first* usable también desde escritorio (2026-10-27)
- [x] Trazabilidad RF→HU al 100 % (32/32) con 30 historias de usuario (2026-10-27)
- [ ] Implementación del módulo `admin-api` (Prisma + PostgreSQL)
- [ ] Implementación de los demás módulos (`operador`, `cliente`, `pagos`)

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
| Sin capa HTTP ni autenticación | `src/interfaces/http/` (antes inexistente) | **Parcial:** `GET /health` en 200 contra PostgreSQL real; faltan `POST /api/operadores`, autenticación y pruebas de rate limit/CORS |
| Sin hashing real de contraseñas | `package.json` no incluía bcrypt/argon2 | **Resuelto (2026-10-27):** puerto `PasswordHasher` + `Argon2Hasher` (Argon2id, m=65536 t=3 p=4) + `RegistrarOperador` hashea antes de persistir |
| Sin adaptador de correo | `EmailService` sin implementación | Requiere proveedor y credenciales |
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
- **Pendiente de este bloqueante:** `POST /api/operadores`, autenticación/RBAC y pruebas de 429 y de allowlist CORS.

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

- Flujo de activación/login que use `compare` (RF-07): el adaptador está listo, no hay ruta HTTP que lo consuma.

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

1. `npm i nodemailer` + `npm i -D @types/nodemailer`.
2. `src/infrastructure/email/EmailConsola.ts` para desarrollo (`EMAIL_DRIVER=console`): imprime el enlace y no falla si no hay SMTP.
3. `src/infrastructure/email/SmtpEmailService.ts`: `connectionTimeout` y `socketTimeout` de 10 s, `FROM` obligatorio, credenciales desde `env.ts` (nunca en el repositorio).
4. `src/infrastructure/email/plantillas/invitacion.ts`: HTML + texto plano con el token y la caducidad de 24 h; el token no se escribe en logs de producción.
5. Mitigación del doble fallo (el outbox completo queda para el sprint siguiente): `POST /api/operadores/:id/reinvitar` regenera token y reenvía; si el correo falla, el registro ya confirmado responde `502` con "usuario creado, invitación no enviada" y el operador queda `PENDIENTE`.
6. Pruebas: el adaptador de consola registra el token; un fallo SMTP produce `502` y no revierte el usuario; reinvitar cambia el token y la expiración.

**Criterio de aceptación:** registro completo contra Mailtrap (o SMTP real) con el correo recibido y el enlace funcionando; `npm test` verde usando el doble de consola.

### Fuera de este sprint

- Outbox transaccional con reintentos y *backoff* (sprint siguiente, con ADR de mensajería).
- Login, JWT y RBAC: necesitan el módulo de sesiones, no solo el registro.
- CI con PostgreSQL de servicio, cobertura (`c8`) y `verify.sh`: se abordan en el sprint de infraestructura.

### Definición de hecho del sprint

- [ ] `npm run build` y `npm test` verdes en local.
- [ ] `npm start` deja `/health` en 200 contra la base real.
- [ ] Registro por HTTP → 201, solo hash en la base e invitación enviada.
- [ ] `.env.example` actualizado y ningún secreto en el repositorio.
- [ ] `PROJECT_STATE.md` y `session-handoff.md` con la evidencia de cada bloqueante cerrado.

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
- Reemplazar `static/img/docusaurus-social-card.jpg` (imagen social genérica) por una propia de LOCIFY.
- `npm install` reportó 23 avisos de `npm audit` en el árbol de `docs` (dependencias transitivas del toolchain); no se aplicó `npm audit fix --force` porque introduce cambios incompatibles.
