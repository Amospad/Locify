import { loadStripe } from '@stripe/stripe-js';

// Inicializa Stripe con la clave publicable disponible en el cliente
// La clave secreta nunca se expone al cliente
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
