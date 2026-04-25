import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setIsSent(true);
        toast.success('Reset link sent to your email');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-premium p-12 text-center border border-slate-100">
          <div className="w-20 h-20 bg-success-light/20 text-success-dark rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-display font-medium text-slate-900 mb-4">Check Your Email</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span>. Please check your inbox and follow the instructions.
          </p>
          <Link to="/login">
            <Button className="w-full h-14 rounded-2xl bg-brand-500 text-white shadow-premium">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-500 font-bold text-[10px] uppercase tracking-widest mb-8 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>
        
        <div className="bg-white rounded-[40px] shadow-premium p-12 border border-slate-100">
          <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-3xl flex items-center justify-center mb-8">
            <Mail size={32} />
          </div>
          
          <h1 className="text-3xl font-display font-medium text-slate-900 mb-2">Forgot Password?</h1>
          <p className="text-slate-500 mb-10 leading-relaxed text-sm font-medium">
            No worries, it happens. Enter your institutional email address and we'll send you a recovery link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Institutional Email"
              type="email"
              placeholder="e.g. name@edunest.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-brand-500 text-white shadow-premium flex items-center justify-center gap-2 hover:bg-brand-600 transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Recovery Link'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
