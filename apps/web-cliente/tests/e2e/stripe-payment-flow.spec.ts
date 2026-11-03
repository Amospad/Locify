import { test, expect } from '@playwright/test';

test.describe('Stripe Payment E2E - Flujo completo de pago', () => {
  test('flujo reserva → pago con tarjeta test 4242 → webhook → reserva PAGADA', async ({ page }) => {
    // 1. Iniciar sesión como conductor
    await page.goto('/iniciar-sesion');
    await page.getByRole('textbox', { name: 'Email' }).fill('conductor@test.com');
    await page.getByLabel('Contraseña').fill('Password123!');
    await page.getByRole('button', { name: /ingresar/i }).click();
    await page.waitForURL('**/dashboard');

    // 2. Ir a buscar parqueadero
    await page.getByRole('link', { name: /buscar parqueadero/i }).first().click();
    await page.waitForURL('**/buscar');

    // 3. Abrir reserva y elegir modalidad Garantizada
    await page.getByRole('button', { name: /reservar/i }).first().click();
    await page.getByRole('button', { name: /garantizada/i }).click();

    // 4. Esperar modal de pago Stripe
    await expect(page.getByRole('heading', { name: /pago garantizado/i })).toBeVisible({ timeout: 15000 });

    // 5. Llenar datos de tarjeta en iframe de Stripe PaymentElement
    const paymentFrame = page.frameLocator('iframe[title*="Secure payment"]');
    await paymentFrame.locator('[name="number"]').waitFor({ state: 'visible', timeout: 15000 });
    await paymentFrame.locator('[name="number"]').fill('4242 4242 4242 4242');
    await paymentFrame.locator('[name="expiry"]').fill('12 / 34');
    await paymentFrame.locator('[name="cvc"]').fill('123');

    // 6. Confirmar pago
    await page.getByRole('button', { name: /pagar/i }).click();

    // 7. Esperar confirmación de pago exitoso y modal de reserva exitosa
    await expect(page.getByText(/pago exitoso/i)).toBeVisible({ timeout: 30000 });
    await expect(page.getByText(/reserva exitosa/i)).toBeVisible({ timeout: 30000 });
    await expect(page.getByAltText(/código qr de reserva/i)).toBeVisible();

    // 8. Verificar estado PAGADA en dashboard (consulta opcional vía API)
    await page.getByRole('link', { name: /mis reservas/i }).click();
    await page.waitForURL('**/reservas');
    await expect(page.getByText(/PAGADA/i)).toBeVisible({ timeout: 15000 });
  });
});
