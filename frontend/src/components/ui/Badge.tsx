import React from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
  showIcon?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'brand', className, showIcon = true }) => {
  const variants = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-success-light text-success-dark border-success/30',
    warning: 'bg-warning-light text-warning-dark border-warning/30',
    danger: 'bg-danger-light text-danger-dark border-danger/30',
    neutral: 'bg-surface-100 text-gray-600 border-surface-200',
  };

  const Icon = variant === 'success' ? CheckCircle2 :
               variant === 'warning' ? Clock :
               variant === 'danger' ? XCircle :
               variant === 'brand' ? CheckCircle2 : AlertCircle;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all hover:scale-105 active:scale-95 cursor-default',
      variants[variant],
      className
    )}>
      {showIcon && <Icon size={14} className="shrink-0" />}
      <span className="leading-none">{children}</span>
    </span>
  );
};

export default Badge;
