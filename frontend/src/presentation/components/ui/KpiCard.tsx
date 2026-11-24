import React from 'react';

interface KpiCardProps {
  number: number | string;
  label: string;
  subLabel?: string;
  variant?: 'neutral' | 'urgent' | 'scheduled' | 'unassigned' | 'waiting' | 'success';
  className?: string;
}

const colorVariants = {
  neutral: {
    bg: 'bg-slate-50/80 dark:bg-slate-900/50',
    border: 'border-slate-200/80 dark:border-slate-800',
    number: 'text-slate-900 dark:text-slate-100',
    label: 'text-slate-800 dark:text-slate-200',
  },
  urgent: {
    bg: 'bg-red-50/70 dark:bg-red-950/30',
    border: 'border-red-200/70 dark:border-red-900/40',
    number: 'text-red-600 dark:text-red-400',
    label: 'text-red-700 dark:text-red-300 font-bold',
  },
  scheduled: {
    bg: 'bg-blue-50/70 dark:bg-blue-950/30',
    border: 'border-blue-200/70 dark:border-blue-900/40',
    number: 'text-blue-600 dark:text-blue-400',
    label: 'text-blue-700 dark:text-blue-300 font-bold',
  },
  unassigned: {
    bg: 'bg-purple-50/70 dark:bg-purple-950/30',
    border: 'border-purple-200/70 dark:border-purple-900/40',
    number: 'text-purple-600 dark:text-purple-400',
    label: 'text-purple-700 dark:text-purple-300 font-bold',
  },
  waiting: {
    bg: 'bg-amber-50/70 dark:bg-amber-950/30',
    border: 'border-amber-200/70 dark:border-amber-900/40',
    number: 'text-amber-600 dark:text-amber-400',
    label: 'text-amber-700 dark:text-amber-300 font-bold',
  },
  success: {
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    border: 'border-emerald-200/70 dark:border-emerald-900/40',
    number: 'text-emerald-600 dark:text-emerald-400',
    label: 'text-emerald-700 dark:text-emerald-300 font-bold',
  },
};

export const KpiCard: React.FC<KpiCardProps> = ({
  number,
  label,
  subLabel,
  variant = 'neutral',
  className = '',
}) => {
  const styles = colorVariants[variant];

  return (
    <div
      className={`glass-panel neumorph-shadow rounded-2xl p-3 sm:p-4 md:p-5 flex items-center gap-2.5 sm:gap-4 ${styles.bg} ${styles.border} ${className}`}
    >
      <span className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight shrink-0 ${styles.number}`}>
        {number}
      </span>
      <div className="flex flex-col min-w-0">
        <span className={`text-sm sm:text-lg md:text-xl lg:text-2xl leading-tight font-bold break-words ${styles.label}`}>
          {label}
        </span>
        {subLabel && (
          <span className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};

