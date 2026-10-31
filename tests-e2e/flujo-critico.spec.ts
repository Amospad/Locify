import { test, expect } from '@playwright/test';

test.describe('Flujo Crítico E2E - LOCIFY', () => {
  test('Smoke test: la aplicación carga correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
  });

  test('a) Flujo del Conductor (Happy Path - Reserva Garantizada)', async ({ page }) => {
    // 1. Iniciar sesión como conductor
    await page.goto('/iniciar-sesion');
    await page.getByRole('textbox', { name: 'Email' }).fill('conductor@test.com');
    await page.getByLabel('Contraseña').fill('Password123!');
    await page.getByRole('button', { name: /ingresar/i }).click();
    
    // Esperar redirección al dashboard
    await page.waitForURL('**/dashboard');

    // Ir a buscar parqueaderos
    await page.getByRole('link', { name: /buscar parqueadero/i }).first().click();
    await page.waitForURL('**/buscar');

    // 2. Seleccionar parqueadero y modalidad Garantizada
    await page.getByRole('button', { name: /reservar/i }).first().click();
    await page.getByRole('button', { name: /garantizada/i }).click();

    // 3. Llenar datos de tarjeta simulados
    await page.getByLabel(/número de tarjeta/i).fill('4242424242424242');
    await page.getByRole('button', { name: /confirmar pago y reserva/i }).click();

    // 4. Verificar modal y QR
    await expect(page.getByText(/reserva exitosa/i)).toBeVisible();
    await expect(page.getByAltText(/código qr de reserva/i)).toBeVisible();
  });

  test('b) Flujo de Expiración (Reserva Exprés)', async ({ page }) => {
    await page.goto('/iniciar-sesion');
    await page.getByRole('textbox', { name: 'Email' }).fill('conductor@test.com');
    await page.getByLabel('Contraseña').fill('Password123!');
    await page.getByRole('button', { name: /ingresar/i }).click();
    await page.waitForURL('**/dashboard');
    await page.getByRole('link', { name: /buscar parqueadero/i }).first().click();
    await page.waitForURL('**/buscar');

    await page.getByRole('button', { name: /reservar/i }).first().click();
    await page.getByRole('button', { name: /exprés/i }).click();

    await expect(page.getByText(/reserva exprés/i)).toBeVisible();
    await expect(page.getByAltText(/código qr de reserva/i)).toBeVisible();
  });
});
