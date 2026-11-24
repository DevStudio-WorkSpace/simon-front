import React from 'react';

export type BadgeVariant = 
  | 'urgent' 
  | 'alert' 
  | 'scheduled' 
  | 'waiting' 
  | 'success' 
  | 'unassigned' 
  | 'neutral'
  | 'brand';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<BadgeVariant, string> = {
  urgent: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900/60',
  alert: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-900/60',
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60',
  waiting: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60',
  unassigned: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900/60',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  brand: 'bg-pink-50 text-[#e6007e] border-pink-200 dark:bg-pink-950/60 dark:text-[#ff2d95] dark:border-pink-900/60',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs md:text-sm font-semibold rounded-md border',
  md: 'px-3 py-1 text-sm md:text-base font-semibold rounded-lg border',
  lg: 'px-4 py-1.5 text-base md:text-lg font-bold rounded-xl border',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  size = 'md',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

