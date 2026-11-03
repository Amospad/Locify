import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const componentPath = join(__dirname, 'PaymentForm.tsx');

function testFileExists() {
  if (!existsSync(componentPath)) {
    throw new Error('PaymentForm.tsx no existe');
  }
}

function testContainsStripeHooks(content: string) {
  if (!content.includes('useStripe') || !content.includes('useElements')) {
    throw new Error('Falta useStripe o useElements');
  }
}

function testContainsCardElement(content: string) {
  if (!content.includes('CardElement')) {
    throw new Error('Falta CardElement');
  }
}

function testCallsCreateIntent(content: string) {
  if (!content.includes('/api/payments/create-intent')) {
    throw new Error('No llama a /api/payments/create-intent');
  }
}

function testHandlesEstados(content: string) {
  if (!content.includes('loading') || !content.includes('success') || !content.includes('error')) {
    throw new Error('No maneja estados loading/success/error');
  }
}

function testCardDeclinedHandling(content: string) {
  if (!content.includes('card_declined') || !content.includes('stripeError.code') || !content.includes('fue rechazada')) {
    throw new Error('No maneja error card_declined con mensaje en español');
  }
}

function runTests() {
  try {
    testFileExists();
    const content = readFileSync(componentPath, 'utf-8');
    testContainsStripeHooks(content);
    testContainsCardElement(content);
    testCallsCreateIntent(content);
    testHandlesEstados(content);
    testCardDeclinedHandling(content);
    console.log('✓ Todos los tests pasaron');
    process.exit(0);
  } catch (e: any) {
    console.error('✗ Test falló:', e.message);
    process.exit(1);
  }
}

runTests();
