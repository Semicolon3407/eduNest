import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home, CreditCard } from 'lucide-react';
import Button from '../../components/ui/Button';
import { verifyEsewaPayment } from '../../services/studentService';
import toast from 'react-hot-toast';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      handleVerification(data);
    } else {
      setVerifying(false);
      setSuccess(false);
    }
  }, [searchParams]);

  const handleVerification = async (data: string) => {
    try {
      const res = await verifyEsewaPayment(data);
      if (res.success) {
        setSuccess(true);
        toast.success('Payment completed successfully!');
      } else {
        setSuccess(false);
        toast.error(res.message || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setSuccess(false);
      toast.error('An error occurred while verifying your payment');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-[40px] p-12 shadow-premium max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto">
            <Loader2 className="animate-spin text-brand-500" size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verifying Payment</h2>
            <p className="text-slate-500 mt-2">Please wait while we secure your transaction details with eSewa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] p-12 shadow-premium max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
        {success ? (
          <>
            <div className="w-24 h-24 bg-success-light text-success rounded-full flex items-center justify-center mx-auto shadow-lg shadow-success/20">
              <CheckCircle2 size={56} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Payment Success!</h2>
              <p className="text-slate-500 mt-3 text-lg">Your transaction has been processed successfully. Your fees are now up to date.</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-error-light text-error rounded-full flex items-center justify-center mx-auto shadow-lg shadow-error/20">
              <XCircle size={56} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Payment Failed</h2>
              <p className="text-slate-500 mt-3 text-lg">We couldn't verify your payment. If amount was deducted, please contact support.</p>
            </div>
          </>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => navigate('/student/fees')} className="w-full h-14 rounded-2xl bg-brand-500 text-white font-bold text-lg hover:bg-brand-600 shadow-premium">
            View Billing History <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button variant="outline" onClick={() => navigate('/student')} className="w-full h-14 rounded-2xl border-slate-200 font-bold text-lg">
            Back to Dashboard <Home className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const uuid = localStorage.getItem('pending_esewa_uuid');
      const amount = localStorage.getItem('pending_esewa_amount');
      
      if (uuid && amount) {
        try {
          const { checkEsewaStatus } = await import('../../services/studentService');
          const res = await checkEsewaStatus(uuid, amount);
          if (res.success && res.data.status === 'COMPLETE') {
            setSuccess(true);
            toast.success('Payment completed successfully!');
            localStorage.removeItem('pending_esewa_uuid');
            localStorage.removeItem('pending_esewa_amount');
            return;
          }
        } catch (error) {
          // Silent catch, let it proceed to failure screen
        }
      }
      setChecking(false);
      localStorage.removeItem('pending_esewa_uuid');
      localStorage.removeItem('pending_esewa_amount');
    };

    checkStatus();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-[40px] p-12 shadow-premium max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto">
            <Loader2 className="animate-spin text-brand-500" size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verifying Payment Status</h2>
            <p className="text-slate-500 mt-2">Checking if your transaction succeeded despite a redirection error...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-[40px] p-12 shadow-premium max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-success-light text-success rounded-full flex items-center justify-center mx-auto shadow-lg shadow-success/20">
            <CheckCircle2 size={56} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Payment Success!</h2>
            <p className="text-slate-500 mt-3 text-lg">Your transaction has been processed successfully. Your fees are now up to date.</p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={() => navigate('/student/fees')} className="w-full h-14 rounded-2xl bg-brand-500 text-white font-bold text-lg hover:bg-brand-600 shadow-premium">
              View Billing History <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button variant="outline" onClick={() => navigate('/student')} className="w-full h-14 rounded-2xl border-slate-200 font-bold text-lg">
              Back to Dashboard <Home className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] p-12 shadow-premium max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-warning-light text-warning-dark rounded-full flex items-center justify-center mx-auto shadow-lg shadow-warning/20">
          <XCircle size={56} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Payment Cancelled</h2>
          <p className="text-slate-500 mt-3 text-lg">The payment process was cancelled or encountered an error. No funds were charged.</p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => navigate('/student/fees')} className="w-full h-14 rounded-2xl bg-brand-500 text-white font-bold text-lg hover:bg-brand-600 shadow-premium">
            Try Again <CreditCard className="ml-2" size={20} />
          </Button>
          <Button variant="outline" onClick={() => navigate('/student')} className="w-full h-14 rounded-2xl border-slate-200 font-bold text-lg">
            Back to Dashboard <Home className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
