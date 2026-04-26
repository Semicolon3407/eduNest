import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Button from '../ui/Button';
import { Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface StripePaymentFormProps {
  subscriptionName: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ subscriptionName, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Payment system is still loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Submit the elements form first (validates card fields)
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message || 'Please check your card details.');
        setIsProcessing(false);
        return;
      }

      // Step 2: Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/organization/profile?payment=success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          toast.error(error.message || 'Card error. Please check your details.');
        } else {
          toast.error(`Payment failed: ${error.message}`);
        }
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful! Your plan is being activated.');
        onSuccess();
      } else {
        // For other statuses (e.g. requires_action), set processing false
        toast.error('Payment requires additional action. Please try again.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan Selection</span>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">{subscriptionName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
          <span className="text-lg font-bold text-slate-900 font-display">Rs {amount.toLocaleString()}</span>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 min-h-[120px] relative">
        {!isElementReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        )}
        <PaymentElement
          options={{ layout: 'tabs' }}
          onReady={() => setIsElementReady(true)}
          onLoadError={(e) => {
            console.error('PaymentElement load error:', e);
            toast.error('Failed to load payment form. Please refresh and try again.');
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
        <ShieldCheck size={14} className="text-success" />
        Payments are secured and encrypted by Stripe
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 rounded-xl h-12"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !elements || !isElementReady}
          className="flex-[2] rounded-xl h-12 shadow-premium"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span>Processing...</span>
            </div>
          ) : !isElementReady ? (
            <div className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            `Pay Rs ${amount.toLocaleString()}`
          )}
        </Button>
      </div>
    </form>
  );
};

export default StripePaymentForm;
