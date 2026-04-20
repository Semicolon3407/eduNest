import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePassword = () => setShowPassword(!showPassword);

    return (
      <div className="w-full space-y-1.5 focus-within:z-10 group">
        {label && (
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-medium outline-none transition-all',
              'placeholder:text-gray-400',
              'focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10',
              Icon && 'pl-11',
              isPassword && 'pr-11',
              error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[10px] font-medium text-red-500 px-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
