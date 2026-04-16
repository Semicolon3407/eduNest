import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/super-admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 md:p-4 sm:p-8 font-sans overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[32px] sm:rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white overflow-hidden relative z-10">
        
        {/* Left Panel: High-End Visual Info */}
        <div className="hidden lg:flex lg:col-span-5 bg-brand-500 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-500/5 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-16">
                    <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-bold text-white tracking-tighter uppercase leading-none">eduNest</h3>
                        <p className="text-[9px] font-bold text-brand-300 uppercase tracking-widest mt-1 opacity-70">Unified Ecosystem</p>
                    </div>
                </div>

                <div className="space-y-12">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight tracking-tight mb-4">
                            The complete engine for modern <span className="text-brand-400">institutions.</span>
                        </h2>
                        <div className="h-1 w-12 bg-brand-500 rounded-full"></div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: ShieldCheck, title: 'Secure Infrastructure', desc: 'Enterprise-grade encryption for all data.' },
                            { icon: Globe, title: 'Multi-Tenant Ready', desc: 'Seamlessly manage multiple branches.' },
                            { icon: Zap, title: 'Fast & Precise', desc: 'Optimized performance for daily tasks.' }
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400 shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                                    <feature.icon size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-0.5">{feature.title}</h4>
                                    <p className="text-xs text-brand-200/60 leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-10 pt-12 border-t border-white/5">
                <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em]">Institutional Grade v2.0</p>
            </div>
        </div>

        {/* Right Panel: Clean Professional Form */}
        <div className="lg:col-span-7 p-4 sm:p-8 md:p-16 flex flex-col justify-center bg-white relative">
            <div className="w-full max-w-sm mx-auto">
                <div className="mb-12">
                    <h2 className="text-3xl sm:text-4xl font-display font-medium text-gray-900 mb-3">Sign In</h2>
                    <p className="text-base text-slate-500 font-medium leading-relaxed">Please enter your institutional credentials to access your workspace.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-2">
                        <Input 
                            label="Email Address" 
                            placeholder="name@institution.com" 
                            type="email" 
                            icon={Mail}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <Input 
                            label="Password" 
                            placeholder="••••••••" 
                            type="password" 
                            icon={Lock}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button type="button" className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors uppercase tracking-widest">
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-14 bg-brand-500 text-white hover:bg-brand-600 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] rounded-2xl group overflow-hidden relative" 
                        isLoading={isLoading}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold">
                            Login To Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Button>
                </form>

                <div className="mt-16 text-center">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Authorized Access Only</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
