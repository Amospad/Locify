# Comandos de Git para Flujo de Pagos y Cancelación

Ejecuta estos comandos en tu terminal desde la raíz del proyecto:

```bash
# 1. Agregar todos los archivos modificados
git add .

# 2. Hacer commit con el mensaje estandarizado
git commit -m "feat(admin-api/web-cliente): implementar flujo de pagos y cancelación (RF-14, RF-16, RF-19)"

# 3. Subir los cambios al repositorio remoto
git push origin main
```

# Comandos de Git para Adaptador Stripe + Webhooks

```bash
git add .
git commit -m "feat(admin-api): implementar adaptador real de Stripe y webhooks"
git push origin main
```

# Comandos de Git para Pruebas E2E con Playwright

```bash
git add playwright.config.ts tests-e2e/
git commit -m "test(e2e): agregar pruebas críticas con Playwright para flujos de conductor"
git push origin main
```

# Comandos de Git para Corrección de Errores TypeScript y Repositorios

```bash
git add services/admin-api/src/infrastructure/persistence/ services/admin-api/src/infrastructure/payments/ services/admin-api/src/domain/use-cases/ services/admin-api/tests/http/sedes-reservas.test.ts PROJECT_STATE.md
git commit -m "fix(admin-api): corregir errores TS en repositorios, Stripe API v2026-10-28.endive y tests"
git push origin main
```

# Comandos de Git para Rediseño de Landing Page Oficial

```bash
git add apps/web-cliente/src/app/page.tsx PROJECT_STATE.md
git commit -m "feat(web-cliente): rediseñar landing oficial con navbar glassmorphism, hero 3D y sección Cómo funciona para Conductores y Operadores"
git push origin main
```

# Comandos de Git para Seed Masivo, Contraste y Rediseño Mapa

```bash
git add services/admin-api/prisma/seed.ts services/admin-api/prisma/seed.ts apps/web-cliente/src/app/dashboard/page.tsx apps/web-cliente/src/components/MapaParqueaderos.tsx PROJECT_STATE.md
git commit -m "feat(admin-api/web-cliente): seed masivo 3 admins/20 operadores/30 sedes/50 reservas, corrección contraste WCAG AA y rediseño mapa conductor estilo Apple Maps con 3D, pills y bottom sheet"
git push origin main
```

# Comandos de Git para Corrección Mapa Valle de Aburrá y Depuración

```bash
git add apps/web-cliente/src/components/MapaParqueaderos.tsx services/admin-api/prisma/seed.ts PROJECT_STATE.md
git commit -m "fix(web-cliente/admin-api): depurar error MapLibre, estilo positron, mapa centrado en Medellín, marcadores tras load y seed coordenadas Valle de Aburrá"
git push origin main
```
