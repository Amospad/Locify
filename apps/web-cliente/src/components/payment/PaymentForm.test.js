const fs = require('fs');
const path = require('path');

const componentPath = path.join(__dirname, 'PaymentForm.tsx');

function testFileExists() {
  if (!fs.existsSync(componentPath)) {
    throw new Error('PaymentForm.tsx no existe');
  }
}

function testContainsStripeHooks(content) {
  if (!content.includes('useStripe') || !content.includes('useElements')) {
    throw new Error('Falta useStripe o useElements');
  }
}

function testContainsCardElement(content) {
  if (!content.includes('CardElement')) {
    throw new Error('Falta CardElement');
  }
}

function testCallsCreateIntent(content) {
  if (!content.includes('/api/payments/create-intent')) {
    throw new Error('No llama a /api/payments/create-intent');
  }
}

function testHandlesEstados(content) {
  if (!content.includes('loading') || !content.includes('success') || !content.includes('error')) {
    throw new Error('No maneja estados loading/success/error');
  }
}

function testCardDeclinedHandling(content) {
  if (!content.includes('card_declined') || !content.includes('stripeError.code') || !content.includes('fue rechazada')) {
    throw new Error('No maneja error card_declined con mensaje en español');
  }
}

function runTests() {
  try {
    testFileExists();
    const content = fs.readFileSync(componentPath, 'utf-8');
    testContainsStripeHooks(content);
    testContainsCardElement(content);
    testCallsCreateIntent(content);
    testHandlesEstados(content);
    testCardDeclinedHandling(content);
    console.log('✓ Todos los tests pasaron');
    process.exit(0);
  } catch (e) {
    console.error('✗ Test falló:', e.message);
    process.exit(1);
  }
}

runTests();
