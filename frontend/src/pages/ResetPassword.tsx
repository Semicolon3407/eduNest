import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setIsLoading(true);
      const response = await authService.resetPassword(token!, password);
      if (response.success) {
        setIsSuccess(true);
        toast.success('Password updated successfully');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-premium p-12 text-center border border-slate-100">
          <div className="w-20 h-20 bg-success-light/20 text-success-dark rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-display font-medium text-slate-900 mb-4">Security Updated</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Your password has been successfully reset. You will be redirected to the login page momentarily.
          </p>
          <div className="flex items-center justify-center gap-2 text-brand-500 font-bold text-[10px] uppercase tracking-widest animate-pulse">
            <Loader2 size={16} className="animate-spin" /> Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[40px] shadow-premium p-12 border border-slate-100">
          <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-3xl flex items-center justify-center mb-8">
            <Shield size={32} />
          </div>
          
          <h1 className="text-3xl font-display font-medium text-slate-900 mb-2">Set New Password</h1>
          <p className="text-slate-500 mb-10 leading-relaxed text-sm font-medium">
            Choose a strong, secure password for your institutional account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Shield}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Shield}
              required
            />
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-brand-500 text-white shadow-premium flex items-center justify-center gap-2 hover:bg-brand-600 transition-all active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
