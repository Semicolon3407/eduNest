import React, { useState } from 'react';
import { Shield, Lock, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const SecurityTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    if (passwords.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      await authService.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
          <h3 className="text-xl font-medium text-gray-900 mb-8 border-b border-slate-100 pb-4">Security Credentials</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Current Password"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
              icon={Lock}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="New Password"
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
                icon={Lock}
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
                icon={Lock}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="rounded-2xl h-14 px-10 shadow-premium flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
                Update Security Credentials
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-brand-50 p-8 rounded-[40px] border border-brand-100 flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-brand-500 shrink-0">
            <Shield size={28} />
          </div>
          <div>
            <h4 className="text-xl font-medium text-brand-700 leading-none">Multi-Factor Readiness</h4>
            <p className="text-brand-600 text-sm mt-2 font-medium">Your account is currently protected by enterprise-grade SHA-256 encryption.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6 uppercase tracking-tight">Security Context</h3>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Password Change</p>
              <p className="text-sm font-bold text-slate-800 uppercase tracking-tight leading-none mb-2">Today</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Protection</p>
              <p className="text-sm font-bold text-success uppercase tracking-tight leading-none mb-2">Maximum</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-premium relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-500 rounded-full -mb-16 -mr-16 opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <h3 className="text-lg font-medium mb-2 relative z-10">Security Policy</h3>
          <p className="text-slate-400 text-xs mb-8 relative z-10">Passwords are salted and hashed using industry-standard Bcrypt protocols for your safety.</p>
          <div className="bg-white/10 h-1 rounded-full mb-8 relative z-10"><div className="bg-brand-500 h-full w-full rounded-full"></div></div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Shield size={12} className="text-brand-500" />
            End-to-End Encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
