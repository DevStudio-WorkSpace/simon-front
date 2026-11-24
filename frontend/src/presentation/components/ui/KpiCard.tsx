import React from 'react';

type KpiVariant =
  | 'neutral'
  | 'urgent'
  | 'alert'
  | 'scheduled'
  | 'unassigned'
  | 'waiting'
  | 'success';

interface KpiCardProps {
  number: number | string;
  label: string;
  subLabel?: string;
  variant?: KpiVariant;
  className?: string;
}

const toneStyles: Record<KpiVariant, { surface: string; number: string; label: string }> = {
  neutral: {
    surface: 'semantic-surface--neutral',
    number: 'semantic-number--neutral',
    label: 'semantic-text--neutral',
  },
  urgent: {
    surface: 'semantic-surface--urgent',
    number: 'semantic-number--urgent',
    label: 'semantic-text--urgent',
  },
  alert: {
    surface: 'semantic-surface--alert',
    number: 'semantic-number--alert',
    label: 'semantic-text--alert',
  },
  scheduled: {
    surface: 'semantic-surface--scheduled',
    number: 'semantic-number--scheduled',
    label: 'semantic-text--scheduled',
  },
  unassigned: {
    surface: 'semantic-surface--unassigned',
    number: 'semantic-number--unassigned',
    label: 'semantic-text--unassigned',
  },
  waiting: {
    surface: 'semantic-surface--waiting',
    number: 'semantic-number--waiting',
    label: 'semantic-text--waiting',
  },
  success: {
    surface: 'semantic-surface--success',
    number: 'semantic-number--success',
    label: 'semantic-text--success',
  },
};

export const KpiCard: React.FC<KpiCardProps> = ({
  number,
  label,
  subLabel,
  variant = 'neutral',
  className = '',
}) => {
  const tone = toneStyles[variant];

  return (
    <div
      className={`glass-panel neumorph-shadow rounded-2xl p-4 sm:p-5 flex flex-col items-start justify-center gap-1.5 border ${tone.surface} ${className}`}
    >
      <span className={`tv-kpi ${tone.number}`}>{number}</span>
      <span className={`tv-body font-extrabold break-words ${tone.label}`}>{label}</span>
      {subLabel && (
        <span className="tv-caption font-semibold text-slate-500 dark:text-slate-400">
          {subLabel}
        </span>
      )}
    </div>
  );
};
