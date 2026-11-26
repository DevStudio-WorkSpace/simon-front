import React from 'react';

interface KpiCardProps {
  number: number | string;
  label: string;
  subLabel?: string;
  variant?: 'neutral' | 'urgent' | 'scheduled' | 'unassigned' | 'waiting' | 'success';
  className?: string;
  compact?: boolean;
}

const colorVariants = {
  neutral: {
    bg: 'bg-slate-50/80',
    border: 'border-slate-200/80',
    number: 'text-slate-900',
    label: 'text-slate-800',
  },
  urgent: {
    bg: 'bg-red-50/70',
    border: 'border-red-200/70',
    number: 'text-red-600',
    label: 'text-red-700 font-bold',
  },
  scheduled: {
    bg: 'bg-blue-50/70',
    border: 'border-blue-200/70',
    number: 'text-blue-600',
    label: 'text-blue-700 font-bold',
  },
  unassigned: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-200/70',
    number: 'text-purple-600',
    label: 'text-purple-700 font-bold',
  },
  waiting: {
    bg: 'bg-amber-50/70',
    border: 'border-amber-200/70',
    number: 'text-amber-600',
    label: 'text-amber-700 font-bold',
  },
  success: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200/70',
    number: 'text-emerald-600',
    label: 'text-emerald-700 font-bold',
  },
};

export const KpiCard: React.FC<KpiCardProps> = ({
  number,
  label,
  subLabel,
  variant = 'neutral',
  className = '',
  compact = false,
}) => {
  const styles = colorVariants[variant];

  return (
    <div
      className={`flex items-center ${compact ? 'min-w-0 gap-2 rounded-lg p-2.5 xl:gap-4 xl:p-4' : `neumorph-shadow gap-2.5 rounded-2xl border p-3 sm:gap-4 sm:p-4 md:p-5 ${styles.border}`} ${styles.bg} ${className}`}
    >
      <span
        className={`shrink-0 font-black leading-none tracking-tight ${compact ? 'text-3xl md:text-[40px] xl:text-6xl' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'} ${styles.number}`}
      >
        {number}
      </span>
      <div className="flex flex-col min-w-0">
        <span
          className={`break-words font-bold leading-tight ${compact ? 'text-xs xl:text-xl' : 'text-sm sm:text-lg md:text-xl lg:text-2xl'} ${styles.label}`}
        >
          {label}
        </span>
        {subLabel && (
          <span
            className={
              compact
                ? 'text-[11px] text-slate-500 xl:text-base'
                : 'text-xs text-slate-500 sm:text-sm md:text-base'
            }
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};
