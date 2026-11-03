'use client';

import { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  reservaId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentForm({ reservaId, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchClientSecret() {
      try {
        setLoading(true);
        const res = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservaId }),
        });
        if (!res.ok) {
          throw new Error('No se pudo obtener clientSecret');
        }
        const data = await res.json();
        if (!cancelled) {
          setClientSecret(data.clientSecret);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Error al cargar pago');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (reservaId) fetchClientSecret();
    return () => { cancelled = true; };
  }, [reservaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Elemento de tarjeta no encontrado');
      setProcessing(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (stripeError) {
      if (stripeError.code === 'card_declined') {
        setError('Tu tarjeta fue rechazada. Por favor, verifica los datos o intenta con otro método de pago.');
      } else {
        setError(stripeError.message || 'Error al procesar el pago');
      }
      setProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      setSuccess(true);
      onSuccess?.();
    } else {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-white">Cargando formulario de pago...</div>;
  }

  if (error && !clientSecret) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  if (success) {
    return <div className="text-green-400">Pago exitoso. ¡Gracias!</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-white/20 bg-white/5 p-4">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          className="flex-1 rounded-2xl bg-acero px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {processing ? 'Procesando…' : 'Pagar'}
        </button>
      </div>
    </form>
  );
}
