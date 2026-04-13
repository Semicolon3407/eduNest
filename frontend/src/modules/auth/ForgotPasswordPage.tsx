import { useState } from 'react';
import { Mail, ArrowLeft, ShieldCheck, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4 md:p-8">
      <div className="w-full max-w-md space-y-8 bg-background p-8 md:p-12 rounded-3xl border shadow-xl shadow-primary-900/5 transition-all">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/20">
                <ShieldCheck size={32} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-foreground">Account Recovery</h1>
                <p className="text-sm text-muted-foreground mt-1">Restore your access to EduNest</p>
            </div>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Forgot Password?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Enter your work email and we will send you a recovery link.
                </p>
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

                <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary-600 py-4 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 active:scale-[0.98] transition-all"
                >
                    Send Recovery Link <Send size={18} />
                </button>
            </form>

            <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                    <ArrowLeft size={16} /> Back to Sign In
                </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 animate-in zoom-in-95 duration-500">
             <div className="h-20 w-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mb-6 mx-auto border-2 border-green-100">
                <Send size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8">
                We have sent a recovery password link to <br />
                <span className="text-foreground font-bold">{email}</span>
            </p>
            <Link 
                to="/login"
                className="w-full flex items-center justify-center rounded-2xl bg-primary-600 py-4 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all"
            >
                Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
