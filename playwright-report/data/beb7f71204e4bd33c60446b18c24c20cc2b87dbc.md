# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flujo-critico.spec.ts >> Flujo Crítico E2E - LOCIFY >> a) Flujo del Conductor (Happy Path - Reserva Garantizada)
- Location: tests-e2e\flujo-critico.spec.ts:9:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e4]:
    - generic [ref=e5]:
      - link "← Volver al inicio" [ref=e6] [cursor=pointer]:
        - /url: /
      - heading "Iniciar sesión" [level=1] [ref=e7]
      - paragraph [ref=e8]: "Entra con la cuenta de tu rol: operador, conductor o administración."
      - generic [ref=e9]:
        - generic [ref=e10]:
          - text: Email
          - textbox "Email" [ref=e11]:
            - /placeholder: tu@correo.co
            - text: conductor@test.com
        - generic [ref=e12]:
          - text: Contraseña
          - textbox "Contraseña" [ref=e13]:
            - /placeholder: ••••••••
            - text: Password123!
        - alert [ref=e14]: No se pudo conectar con el servidor. Verifica que el backend esté corriendo.
        - button "Ingresar" [ref=e15]
  - button "Open Next.js Dev Tools" [ref=e21] [cursor=pointer]
  - alert [ref=e25]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Flujo Crítico E2E - LOCIFY', () => {
  4  |   test('Smoke test: la aplicación carga correctamente', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveTitle(/.+/);
  7  |   });
  8  | 
  9  |   test('a) Flujo del Conductor (Happy Path - Reserva Garantizada)', async ({ page }) => {
  10 |     // 1. Iniciar sesión como conductor
  11 |     await page.goto('/iniciar-sesion');
  12 |     await page.getByRole('textbox', { name: 'Email' }).fill('conductor@test.com');
  13 |     await page.getByLabel('Contraseña').fill('Password123!');
  14 |     await page.getByRole('button', { name: /ingresar/i }).click();
  15 |     
  16 |     // Esperar redirección al dashboard
> 17 |     await page.waitForURL('**/dashboard');
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  18 | 
  19 |     // Ir a buscar parqueaderos
  20 |     await page.getByRole('link', { name: /buscar parqueadero/i }).first().click();
  21 |     await page.waitForURL('**/buscar');
  22 | 
  23 |     // 2. Seleccionar parqueadero y modalidad Garantizada
  24 |     await page.getByRole('button', { name: /reservar/i }).first().click();
  25 |     await page.getByRole('button', { name: /garantizada/i }).click();
  26 | 
  27 |     // 3. Llenar datos de tarjeta simulados
  28 |     await page.getByLabel(/número de tarjeta/i).fill('4242424242424242');
  29 |     await page.getByRole('button', { name: /confirmar pago y reserva/i }).click();
  30 | 
  31 |     // 4. Verificar modal y QR
  32 |     await expect(page.getByText(/reserva exitosa/i)).toBeVisible();
  33 |     await expect(page.getByAltText(/código qr de reserva/i)).toBeVisible();
  34 |   });
  35 | 
  36 |   test('b) Flujo de Expiración (Reserva Exprés)', async ({ page }) => {
  37 |     await page.goto('/iniciar-sesion');
  38 |     await page.getByRole('textbox', { name: 'Email' }).fill('conductor@test.com');
  39 |     await page.getByLabel('Contraseña').fill('Password123!');
  40 |     await page.getByRole('button', { name: /ingresar/i }).click();
  41 |     await page.waitForURL('**/dashboard');
  42 |     await page.getByRole('link', { name: /buscar parqueadero/i }).first().click();
  43 |     await page.waitForURL('**/buscar');
  44 | 
  45 |     await page.getByRole('button', { name: /reservar/i }).first().click();
  46 |     await page.getByRole('button', { name: /exprés/i }).click();
  47 | 
  48 |     await expect(page.getByText(/reserva exprés/i)).toBeVisible();
  49 |     await expect(page.getByAltText(/código qr de reserva/i)).toBeVisible();
  50 |   });
  51 | });
  52 | 
```