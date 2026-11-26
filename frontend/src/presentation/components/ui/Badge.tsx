import React from 'react';

export type BadgeVariant =
  'urgent' | 'alert' | 'scheduled' | 'waiting' | 'success' | 'unassigned' | 'neutral' | 'brand';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<BadgeVariant, string> = {
  urgent: 'bg-red-50 text-red-700 border-red-200',
  alert: 'bg-[#fff1ee] text-[#a2342d] border-[#f7c8c2]',
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  waiting: 'bg-amber-50 text-amber-700 border-amber-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  unassigned: 'bg-purple-50 text-purple-700 border-purple-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  brand: 'bg-pink-50 text-[#e6007e] border-pink-200',
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
