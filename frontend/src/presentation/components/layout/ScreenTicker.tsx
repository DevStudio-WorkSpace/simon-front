'use client';

import React from 'react';
import { ScreenTickerItem } from '../../../domain/models';
import { Badge, BadgeVariant } from '../ui/Badge';

interface ScreenTickerProps {
  items: ScreenTickerItem[];
  compact?: boolean;
}

const typeVariantMap: Record<string, BadgeVariant> = {
  urgente: 'urgent',
  alerta: 'alert',
  anuncio: 'scheduled',
  por_mejorar: 'waiting',
  logro: 'success',
};

const typeLabelMap: Record<string, string> = {
  urgente: 'Urgente',
  alerta: 'Alerta',
  anuncio: 'Anuncio',
  por_mejorar: 'Por mejorar',
  logro: 'Logro',
};

export const ScreenTicker: React.FC<ScreenTickerProps> = ({ items, compact = false }) => {
  // We duplicate the list so the ticker can loop smoothly
  const loopedItems = [...items, ...items];

  return (
    <footer
      className={`z-20 min-w-0 w-full overflow-hidden bg-slate-100 px-4 backdrop-blur-md ${compact ? 'py-1.5' : 'border-t border-slate-200 py-2.5'}`}
    >
      <div className="flex items-center overflow-hidden">
        <div className="animate-ticker flex items-center gap-10">
          {loopedItems.map((item, index) => {
            const variant = typeVariantMap[item.type] || 'neutral';
            const label = typeLabelMap[item.type] || item.type;

            return (
              <div key={`${item.id}-${index}`} className="flex items-center gap-3 shrink-0">
                <Badge variant={variant} size="sm">
                  {label}
                </Badge>
                <span
                  className={`font-semibold text-slate-800 ${compact ? 'text-xs xl:text-base' : 'text-base md:text-lg'}`}
                >
                  {item.text}
                </span>
                <span className="text-slate-300 mx-2">·</span>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
