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
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<BadgeVariant, string> = {
  urgent: 'semantic-surface--urgent semantic-text--urgent',
  alert: 'semantic-surface--alert semantic-text--alert',
  scheduled: 'semantic-surface--scheduled semantic-text--scheduled',
  waiting: 'semantic-surface--waiting semantic-text--waiting',
  success: 'semantic-surface--success semantic-text--success',
  unassigned: 'semantic-surface--unassigned semantic-text--unassigned',
  neutral: 'semantic-surface--neutral semantic-text--neutral',
  brand: 'semantic-surface--brand semantic-text--brand',
};

const sizeStyles = {
  xs: 'px-2 py-0.5 text-[11px] font-bold rounded-md border',
  sm: 'px-2.5 py-1 text-xs md:text-sm lg:text-base xl:text-[24px] font-bold rounded-lg border',
  md: 'px-3 py-1 text-sm md:text-base lg:text-lg xl:text-[28px] font-bold rounded-lg border',
  lg: 'px-4 py-2 text-base md:text-lg lg:text-xl xl:text-[32px] font-extrabold rounded-xl border',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  size = 'md',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
