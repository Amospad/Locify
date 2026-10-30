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
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /buscar parqueadero/i }).first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [active]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - navigation [ref=e7]:
          - button [disabled] [ref=e8]:
            - img "previous" [ref=e9]
          - generic [ref=e11]:
            - generic [ref=e12]: 1/
            - generic [ref=e13]: "4"
          - button [ref=e14] [cursor=pointer]:
            - img "next" [ref=e15]
        - generic [ref=e18]:
          - generic "Latest available version is detected (16.4.3)." [ref=e21]: Next.js 16.4.3
          - generic [ref=e22]: Turbopack
      - dialog "Console Error" [ref=e24]:
        - generic [ref=e27]:
          - generic [ref=e29]:
            - generic [ref=e30]:
              - generic [ref=e31]: Console Error
              - generic [ref=e33]:
                - button "Copy Error Info" [ref=e34] [cursor=pointer]
                - button "No related documentation found" [disabled] [ref=e37]
                - button "Attach Node.js inspector" [ref=e40] [cursor=pointer]
            - generic [ref=e49]: The result of getSnapshot should be cached to avoid an infinite loop
          - generic [ref=e51]:
            - generic [ref=e52]:
              - paragraph [ref=e54]:
                - generic [ref=e59]: src/app/dashboard/page.tsx (245:38) @ PaginaDashboard
                - button "Open in editor" [ref=e60] [cursor=pointer]
              - generic [ref=e64]:
                - generic [ref=e65]: "243 | export default function PaginaDashboard() {"
                - generic [ref=e66]: 244 | const router = useRouter();
                - generic [ref=e67]: "> 245 | const sesion = useSyncExternalStore(SIN_SUSCRIPCION, alCliente, alServidor);"
                - generic [ref=e68]: "| ^"
                - generic [ref=e69]: 246 | const [reservas, setReservas] = useState<ReservaUsuario[]>([]);
                - generic [ref=e70]: 247 | const [reservaActiva, setReservaActiva] = useState<ReservaActivaUsuario | null>(null);
                - generic [ref=e71]: 248 | const [cargando, setCargando] = useState(true);
            - generic [ref=e72]:
              - generic [ref=e73]:
                - paragraph [ref=e74]:
                  - text: Call Stack
                  - generic [ref=e75]: "19"
                - button "Show 18 ignore-listed frame(s)" [ref=e76] [cursor=pointer]
              - generic [ref=e79]:
                - generic [ref=e80]:
                  - text: PaginaDashboard
                  - button "Open PaginaDashboard in editor" [ref=e81] [cursor=pointer]
                - text: src/app/dashboard/page.tsx (245:38)
    - generic [ref=e88] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e89]
      - generic [ref=e93]:
        - button "Open issues overlay" [ref=e94]:
          - generic [ref=e95]:
            - generic [aria-hidden] [ref=e96]: "3"
            - generic [ref=e97]: "4"
          - generic [ref=e98]:
            - text: Issue
            - generic [aria-hidden] [ref=e99]: s
        - button "Collapse issues badge" [ref=e100]
  - generic [ref=e104]:
    - heading "This page couldn’t load" [level=1] [ref=e107]
    - paragraph [ref=e108]: Reload to try again, or go back.
    - generic [ref=e109]:
      - button "Reload" [ref=e111] [cursor=pointer]
      - button "Back" [ref=e112] [cursor=pointer]
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
  17 |     await page.waitForURL('**/dashboard');
  18 | 
  19 |     // Ir a buscar parqueaderos
> 20 |     await page.getByRole('link', { name: /buscar parqueadero/i }).first().click();
     |                                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
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