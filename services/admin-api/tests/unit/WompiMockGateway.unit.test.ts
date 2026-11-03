import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { WompiMockGateway } from '../../src/infrastructure/payments/WompiMockGateway.js';

describe('WompiMockGateway - unit (TDD)', () => {
  it('crea PaymentIntent con respuesta estática exitosa', async () => {
    const gateway = new WompiMockGateway();
    const result = await gateway.crearPaymentIntent('res-001', 10000, 'COP', { origin: 'web' });
    assert.ok(result.clientSecret);
    assert.equal(typeof result.clientSecret, 'string');
    // Respuesta mock estática
    assert.equal(result.clientSecret, 'wompi_mock_client_secret');
  });

  it('reembolsa con respuesta estática exitosa', async () => {
    const gateway = new WompiMockGateway();
    const result = await gateway.reembolsar('pi_mock_123', 5000);
    assert.equal(result.success, true);
  });

  it('reembolsa total cuando monto no se proporciona', async () => {
    const gateway = new WompiMockGateway();
    const result = await gateway.reembolsar('pi_mock_123');
    assert.equal(result.success, true);
  });
});
