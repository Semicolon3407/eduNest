import { useState } from 'react';
import { Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    login('SUPER_ADMIN'); // Defaulting to super admin for now
    navigate('/dashboard');
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

                <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="h-5 w-5 rounded border-2 border-muted bg-background checked:bg-primary-600 transition-all appearance-none cursor-pointer" />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Keep me signed in</span>
                    </label>
                </div>

                <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary-600 py-4 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 active:scale-[0.98] transition-all"
                >
                    Sign In <ArrowRight size={18} />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
