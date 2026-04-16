import React from 'react';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: any;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'brand' }) => {
  return (
    <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-soft border border-surface-200 group hover:border-brand-200 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm",
          color === 'brand' ? 'bg-brand-50 text-brand-600' :
          color === 'success' ? 'bg-success-light text-success-dark' :
          color === 'warning' ? 'bg-warning-light text-warning-dark' :
          'bg-danger-light text-danger-dark'
        )}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg",
            trend.isUp ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'
          )}>
            {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-medium text-gray-900 mt-1 ">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
