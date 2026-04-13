import { useState } from 'react';
import { Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4 md:p-8">
      <div className="w-full max-w-md space-y-8 bg-background p-8 md:p-12 rounded-3xl border shadow-xl shadow-primary-900/5 transition-all">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/20">
                <GraduationCap size={32} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-foreground">EduNest System</h1>
                <p className="text-sm text-muted-foreground mt-1">Institutional Management Portal</p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Welcome Back</h2>
                <p className="text-sm text-muted-foreground mt-1">Please enter your credentials to access your account.</p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Work Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input 
                            type="email" 
                            required 
                            placeholder="name@institution.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl border bg-muted/10 py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-foreground/80">Secret Key</label>
                        <Link to="/forgot-password" title="Recover Access" className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">Forgot Password?</Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input 
                            type="password" 
                            required 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl border bg-muted/10 py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary-600 py-4 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
