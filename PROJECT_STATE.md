# Estado del Proyecto LOCIFY

## Fase Actual
- [x] Documentación (SENA y Técnica)
- [x] Publicación de la documentación en Vercel con rediseño UI/UX
- [x] Configuración de Skills (QA, CI/CD, Seguridad, Diseño)
- [ ] Implementación de Microservicio `admin-api` (Prisma + PostgreSQL)
- [ ] Implementación de los demás microservicios

## Stack Tecnológico
- Backend: Node.js + TypeScript + Prisma
- Base de Datos: PostgreSQL (Docker)
- Arquitectura: Hexagonal (Puertos y Adaptadores)

## Decisiones Clave (ADRs)
- ADR-001: Arquitectura Hexagonal.
- ADR-002: Modelo Híbrido de Reservas.
- ADR-003: Buffer de seguridad del 95% en celdas.

## Tareas Pendientes (Backlog Técnico)
- [x] Terminar la prueba de conexión de Prisma. (`npm run test:db` en `services/admin-api` → `SELECT 1`)
- [x] Aplicar el contrato de Prisma a PostgreSQL. (`npm run db:init` → tabla `usuario` con índice único en `email` y checks de enums)
- [x] Implementar el adaptador `PostgresUsuarioRepository`. (`npm test` → 7/7 tests verdes, incluida la integración real contra PostgreSQL)
- [x] Documentar la arquitectura de agentes IA. (`docs/docs/tecnico/arquitectura-agentes.md` + sección "Automatización y Agentes de IA" en el documento formativo 09)

## Documentación Web (Docusaurus + Vercel)

**URL de publicación:** https://locify-wheat.vercel.app

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

### Pendiente
- Reemplazar `static/img/docusaurus-social-card.jpg` (imagen social genérica) por una propia de LOCIFY.
- Confirmar el deploy de producción en Vercel tras el push y validar las rutas de los assets.
- `npm install` reportó 23 avisos de `npm audit` en el árbol de `docs` (dependencias transitivas del toolchain); no se aplicó `npm audit fix --force` porque introduce cambios incompatibles.
