'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';

interface StripePaymentModalProps {
  reservaId: string;
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ clientSecret, onSuccess, onCancel }: Omit<StripePaymentModalProps, 'reservaId'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required',
    });
    if (submitError) {
      setError(submitError.message || 'Error al procesar el pago');
      setLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess();
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 rounded-2xl bg-acero px-6 py-3 font-semibold text-white"
        >
          {loading ? 'Procesando…' : 'Pagar'}
        </button>
      </div>
    </form>
  );
}

export default function StripePaymentModal({ reservaId, clientSecret, onSuccess, onCancel }: StripePaymentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Pago garantizado</h2>
        <p className="mt-2 text-sm text-white/80">Completa tu pago para confirmar la reserva.</p>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      </div>
    </div>
  );
}
