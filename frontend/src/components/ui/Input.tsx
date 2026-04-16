import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 focus-within:z-10 group">
        {label && (
          <label className="text-xs font-medium text-gray-400   px-1">
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
            className={cn(
              'w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-4 text-sm font-medium outline-none transition-all',
              'placeholder:text-gray-400',
              'focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10',
              Icon && 'pl-11',
              error && 'border-danger focus:ring-danger/10 focus:border-danger',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] font-medium text-danger px-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
