import { StripeProvider } from '@/components/providers/StripeProvider';

/**
 * Layout para rutas de pago
 * Envuelve todas las páginas bajo /pago con el provider de Stripe
 * Usa únicamente la clave publicable
 */
export default function PagoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StripeProvider>{children}</StripeProvider>;
}
