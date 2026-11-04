'use client';

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';

interface StripeProviderProps {
  children: React.ReactNode;
  options?: React.ComponentProps<typeof Elements>['options'];
}

/**
 * Provider raíz para Stripe Elements
 * Inicializa Stripe con NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 * No expone STRIPE_SECRET_KEY al cliente
 */
export function StripeProvider({ children, options }: StripeProviderProps) {
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
